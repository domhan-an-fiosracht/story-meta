// Scene stories: reading order and cross-links, built once per story.
//
// Answers, for each scene: what's next/previous, which scenes retell the same
// event from another point of view (same date and NN), which are alternate
// renditions of the same beat (same `prompt`), and what else happened that day
// in other arcs. Arcs (`arc:` frontmatter) are optional; without them the
// reading order is simply the timeline.
import { getCollection } from "astro:content";
import { groupStories } from "./stories.mjs";

const cache = new Map();

const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function longDate(iso) {
  return WEEKDAY.format(new Date(`${iso}T00:00:00Z`));
}

function arcOf(data) {
  const a = Array.isArray(data.arc) ? data.arc[0] : data.arc;
  return a ? String(a).trim().toLowerCase() : null;
}

export function arcName(slug) {
  const s = slug.replace(/[-_]+/g, " ");
  return s[0].toUpperCase() + s.slice(1);
}

function normPrompt(p) {
  // Only a real beat description identifies a scene; "sure" or "continue" doesn't.
  const s = typeof p === "string" ? p.replace(/\s+/g, " ").trim().toLowerCase() : "";
  return s.split(" ").length >= 8 ? s : "";
}

async function characterIndex() {
  const chars = (await getCollection("characters")).filter((c) => c.id !== "readme");
  const byKey = new Map();
  const add = (key, c) => {
    const k = key?.toLowerCase().trim();
    if (k && !byKey.has(k)) byKey.set(k, c);
  };
  for (const c of chars) add(c.id, c);
  for (const c of chars) for (const a of c.data.aka ?? []) add(String(a).split(/\s+/)[0], c);
  for (const c of chars) add(String(c.data.name ?? "").split(/\s+/)[0], c);
  return byKey;
}

// Every scene story, keyed by slug: { story, scenes, years }.
export async function sceneStories() {
  if (cache.size) return cache;
  const chars = await characterIndex();
  for (const story of groupStories(await getCollection("stories"))) {
    const parts = story.parts.filter((p) => p.kind === "scene");
    if (parts.length) cache.set(story.slug, build(story, parts, chars));
  }
  return cache;
}

export async function sceneIndex(slug) {
  return (await sceneStories()).get(slug);
}

function build(story, parts, chars) {
  const base = `/stories/${story.slug}/`;
  const scenes = parts.map((p) => {
    const ch = chars.get(p.pov);
    const data = p.entry.data;
    return {
      id: p.id,
      base,
      href: `${base}${p.id}/`,
      entry: p.entry,
      date: p.date,
      year: p.date.slice(0, 4),
      n: p.n,
      pov: p.pov,
      povName: ch ? (ch.data.aka?.find((a) => a.toLowerCase().startsWith(p.pov)) ?? String(ch.data.name).split(" ")[0]) : p.pov[0].toUpperCase() + p.pov.slice(1),
      povHref: ch ? `/characters/${ch.id}/` : null,
      arc: arcOf(data),
      override: { next: data.next ?? null, prev: data.prev ?? null },
      prompt: normPrompt(data.prompt),
      title: data.title ?? null,
    };
  });
  // parts arrive sorted by date, NN, pov
  scenes.forEach((s, i) => (s.i = i));

  const group = (key) => {
    const m = new Map();
    for (const s of scenes) {
      const k = key(s);
      if (!k) continue;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(s);
    }
    return m;
  };
  const byEvent = group((s) => `${s.date}-${s.n}`); // retellings share a number
  const byPrompt = group((s) => s.prompt); // same beat drafted more than once
  const arcs = group((s) => s.arc);
  const byDate = group((s) => s.date);
  const years = group((s) => s.year);
  const hasArcs = arcs.size > 0;

  const sameEvent = (a, b) => a.date === b.date && a.n === b.n;
  const byId = new Map(scenes.map((s) => [s.id, s]));
  const scan = (s, dir, ok) => {
    for (let j = s.i + dir; j >= 0 && j < scenes.length; j += dir) {
      const t = scenes[j];
      if (!sameEvent(s, t) && ok(t)) return t;
    }
    return null;
  };
  // Reading order: stay in the scene's arc; when the arc runs out, follow the same
  // point-of-view character into whatever comes next for them; failing that, the
  // next scene on the timeline. A story without arcs reads straight down the
  // timeline. A `next:`/`prev:` scene id in frontmatter overrides.
  const step = (s, dir) => {
    const override = byId.get(dir > 0 ? s.override.next : s.override.prev);
    if (override) return override;
    if (!hasArcs) return scenes[s.i + dir] ?? null;
    return (
      (s.arc && scan(s, dir, (t) => t.arc === s.arc)) ||
      scan(s, dir, (t) => t.pov === s.pov) ||
      scan(s, dir, () => true)
    );
  };

  const root = (a) => a?.replace(/-take-\d+$/, "");
  for (const s of scenes) {
    s.retellings = byEvent.get(`${s.date}-${s.n}`).filter((t) => t !== s);
    s.renditions = s.prompt ? byPrompt.get(s.prompt).filter((t) => t !== s && !s.retellings.includes(t)) : [];
    if (s.arc) {
      const list = arcs.get(s.arc);
      s.arcPos = { n: list.indexOf(s) + 1, of: list.length };
    }
    // Elsewhere that day: the first scene of each other arc on the same date.
    // Re-runs (-take-N) of an arc are left out; they show up as renditions.
    const seen = new Set([root(s.arc)]);
    s.elsewhere = [];
    for (const t of byDate.get(s.date)) {
      if (t.arc && !seen.has(root(t.arc))) {
        seen.add(root(t.arc));
        s.elsewhere.push(t);
      }
    }
  }
  for (const s of scenes) {
    s.prev = step(s, -1);
    s.next = step(s, 1);
  }
  return { story, base, scenes, years };
}

export function sceneLabel(s) {
  return `${longDate(s.date)} · ${s.povName}${s.title ? ` — ${s.title}` : ""}`;
}
