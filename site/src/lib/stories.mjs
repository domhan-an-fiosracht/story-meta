import { storySlug } from "./routes.mjs";

// Entry ids look like "01-crossing/chapter-12", "01-crossing/README",
// or "02-foo/2035/2035-03-17-01-harper" for scene stories.
export function parseStoryEntry(entry) {
  const [dir, ...rest] = entry.id.split("/");
  const slug = storySlug(dir);
  const order = parseInt(dir, 10) || 0;
  const stem = rest.join("/");
  const flat = stem.replace(/\//g, "-");

  if (stem === "readme") return { kind: "readme", dir, slug, order, entry };

  let m;
  if ((m = stem.match(/^chapter-(\d+)$/)))
    return { kind: "chapter", dir, slug, order, n: parseInt(m[1], 10), id: flat, entry };

  if ((m = flat.match(/^(\d{4})-(\d{4}-\d{2}-\d{2})-(\d+)-(.+)$/)))
    return { kind: "scene", dir, slug, order, date: m[2], n: parseInt(m[3], 10), pov: m[4], id: flat, entry };

  return { kind: "other", dir, slug, order, id: flat, entry };
}

export function groupStories(entries) {
  const stories = new Map();
  for (const e of entries) {
    const p = parseStoryEntry(e);
    if (!stories.has(p.slug))
      stories.set(p.slug, { slug: p.slug, dir: p.dir, order: p.order, readme: null, parts: [] });
    const s = stories.get(p.slug);
    if (p.kind === "readme") s.readme = p.entry;
    else s.parts.push(p);
  }
  for (const s of stories.values()) {
    s.parts.sort((a, b) =>
      a.kind === "scene" && b.kind === "scene"
        ? a.date.localeCompare(b.date) || a.n - b.n || a.pov.localeCompare(b.pov)
        : (a.n ?? 0) - (b.n ?? 0)
    );
  }
  return [...stories.values()].sort((a, b) => a.order - b.order);
}

export function partTitle(p) {
  const fmTitle = p.entry.data.title;
  if (p.kind === "chapter") return fmTitle ? `Chapter ${p.n} — ${fmTitle}` : `Chapter ${p.n}`;
  if (p.kind === "scene") return fmTitle ? `${p.date} · ${p.pov} — ${fmTitle}` : `${p.date} · ${p.pov}`;
  return fmTitle ?? p.id;
}

export function bodyHasOwnHeading(p) {
  return bodyStartsWithHeading(p.entry);
}

export function bodyStartsWithHeading(entry) {
  return (entry.body ?? "").trimStart().startsWith("# ");
}
