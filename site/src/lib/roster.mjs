// Turns meta/characters/README.md into a structured roster for /characters/.
//
// The README format (see STRUCTURE.md § Character roster):
//   # Characters                     page title
//   intro text                       optional
//   ## Section ([group](x.md))       any ##/### heading; a trailing ([group](x.md)) is the group page link
//   | Who | What | First |            a table whose first column is "Who" becomes roster rows
//
// Who = a link, optionally followed by ": Real Name" (otherwise the real name comes from the
// linked file's `name` frontmatter). What and First are optional columns. With a First column,
// an empty First cell means "not yet on page". Anything else in a section renders as markdown.
import { pathToFileURL } from "node:url";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkMdLinks from "./remark-md-links.mjs";
import { resolveMdLink } from "./routes.mjs";

const README = "meta/characters/README.md";

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Strip markdown down to plain text (for ids and jump-bar labels).
function plain(md) {
  return md
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

function splitRow(line) {
  const cells = [];
  let cur = "";
  const body = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  for (let i = 0; i < body.length; i++) {
    if (body[i] === "\\" && body[i + 1] === "|") { cur += "|"; i++; continue; }
    if (body[i] === "|") { cells.push(cur.trim()); cur = ""; continue; }
    cur += body[i];
  }
  cells.push(cur.trim());
  return cells;
}

const isTableLine = (l) => /^\s*\|/.test(l);
const isDivider = (l) => /^\s*\|?\s*:?-{2,}/.test(l) && /^[\s|:-]+$/.test(l);

// Pure parse: markdown body -> { title, intro, sections } with raw markdown strings.
export function parseRoster(body) {
  const lines = (body ?? "").replace(/\r\n/g, "\n").split("\n");
  let title = "Characters";
  const intro = [];
  const sections = [];
  let sec = null;
  let text = [];

  const flushText = () => {
    const md = text.join("\n").trim();
    if (md) (sec ? sec.blocks : intro).push({ kind: "md", md });
    text = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let m;
    if ((m = line.match(/^#\s+(.+?)\s*$/)) && !sec && sections.length === 0) {
      flushText();
      title = plain(m[1]);
      continue;
    }
    if ((m = line.match(/^(#{2,3})\s+(.+?)\s*$/))) {
      flushText();
      let heading = m[2];
      let group = null;
      const g = heading.match(/\s*(?:\(|[—–-]\s*)\[group(?: page)?\]\(([^)]+)\)\)?\s*$/i);
      if (g) { group = g[1]; heading = heading.slice(0, g.index).trim(); }
      sec = { level: m[1].length, heading, id: slugify(plain(heading)), group, blocks: [] };
      sections.push(sec);
      continue;
    }
    if (isTableLine(line)) {
      flushText();
      const tbl = [];
      while (i < lines.length && isTableLine(lines[i])) tbl.push(lines[i++]);
      i--;
      const header = splitRow(tbl[0]).map((h) => plain(h).toLowerCase());
      const rows = tbl.slice(1).filter((l) => !isDivider(l)).map(splitRow);
      if (header[0] === "who") {
        const col = (name) => header.indexOf(name);
        const [wi, fi] = [col("what"), col("first")];
        const block = { kind: "rows", hasFirst: fi !== -1, rows: [] };
        for (const r of rows) block.rows.push({ who: r[0] ?? "", what: wi === -1 ? "" : r[wi] ?? "", first: fi === -1 ? "" : r[fi] ?? "" });
        (sec ? sec.blocks : intro).push(block);
      } else {
        (sec ? sec.blocks : intro).push({ kind: "md", md: tbl.join("\n") });
      }
      continue;
    }
    text.push(line);
  }
  flushText();
  return { title, intro, sections };
}

// "**[Wren](wren-holt.md)**: Wren Adaire Holt" -> { href, label, real, rest }
export function parseWho(cell) {
  const s = cell.replace(/\*\*/g, "").trim();
  const m = s.match(/^\[([^\]]+)\]\(([^)\s]+)\)(.*)$/);
  if (!m) return { href: null, label: s, real: null, rest: "" };
  let rest = m[3].trim();
  let real = null;
  if (rest.startsWith(":")) { real = rest.slice(1).trim(); rest = ""; }
  return { href: m[2], label: m[1], real, rest };
}

// Render the README into HTML-ready data. `entries` is the characters collection;
// `readmePath` is the README's absolute path on disk, so the link rewriter resolves its links.
export async function buildRoster(readme, entries, readmePath) {
  const processor = await createMarkdownProcessor({ remarkPlugins: [remarkMdLinks] });
  const fileURL = pathToFileURL(readmePath);
  const block = async (md) => (await processor.render(md, { fileURL })).code;
  const inline = async (md) => (md ? (await block(md)).replace(/^<p>([\s\S]*)<\/p>\s*$/, "$1") : "");

  const bySlug = new Map(entries.map((e) => [e.id, e]));
  const parsed = parseRoster(readme?.body ?? "");
  const linked = new Set();

  const renderBlocks = async (blocks) => {
    const out = [];
    for (const b of blocks) {
      if (b.kind === "md") { out.push({ kind: "html", html: await block(b.md) }); continue; }
      const rows = [];
      for (const r of b.rows) {
        const who = parseWho(r.who);
        const route = who.href ? resolveMdLink(README, who.href) ?? who.href : null;
        const own = route?.match(/^\/characters\/([^/#]+)\/$/)?.[1];
        const entry = own ? bySlug.get(own) : null;
        const isOwnPage = !!entry && entry.data?.type !== "group";
        if (own) linked.add(own);
        const fmName = isOwnPage ? entry.data?.name : null;
        // Skip the frontmatter name when the label already says it ("Wren / the Mechanic" -> Wren).
        const real = who.real ?? (fmName && !plain(who.label).toLowerCase().includes(fmName.toLowerCase()) ? fmName : null);
        rows.push({
          href: route,
          label: await inline(who.label),
          real: real ? await inline(real) : null,
          rest: await inline(who.rest),
          own: isOwnPage,
          what: await inline(r.what),
          first: await inline(r.first),
          offpage: b.hasFirst && !r.first.trim(),
        });
      }
      out.push({ kind: "rows", rows });
    }
    return out;
  };

  const sections = [];
  for (const s of parsed.sections) {
    const blocks = await renderBlocks(s.blocks);
    sections.push({
      level: s.level,
      id: s.id,
      heading: await inline(s.heading),
      label: plain(s.heading),
      group: s.group ? resolveMdLink(README, s.group) ?? s.group : null,
      blocks,
      count: blocks.reduce((n, b) => n + (b.kind === "rows" ? b.rows.length : 0), 0),
    });
  }
  // A ## part's jump-bar count includes its ### subsections.
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].level !== 2) continue;
    let total = sections[i].count;
    for (let j = i + 1; j < sections.length && sections[j].level > 2; j++) total += sections[j].count;
    sections[i].total = total;
  }

  // Links anywhere in the README count (a group page may list members in prose).
  for (const m of (readme?.body ?? "").matchAll(/\]\(([^)#\s]+\.md)(?:#[^)]*)?\)/g)) {
    const r = resolveMdLink(README, m[1]);
    const slug = r?.match(/^\/characters\/([^/]+)\/$/)?.[1];
    if (slug) linked.add(slug);
  }
  const unlinked = entries
    .filter((e) => e.id !== "readme" && e.data?.type !== "group" && !linked.has(e.id))
    .map((e) => e.id);
  if (unlinked.length) {
    console.warn(`[roster] characters/README.md never links: ${unlinked.join(", ")}`);
  }

  return { title: parsed.title, intro: await renderBlocks(parsed.intro), sections, unlinked };
}
