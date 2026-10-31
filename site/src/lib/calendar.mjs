import { getCollection } from "astro:content";
import { sceneStories } from "./scenes.mjs";

// The calendar page exists only when the universe has meta/calendar.md. It is
// the real calendar with three overlays:
//   school  — meta/calendar.md frontmatter: tracks with first/last day and off ranges
//   events  — the timeline's rows whose When column names an exact day
//   scenes  — how many scene files (across every scene story) sit on each date
//
// meta/calendar.md:
//   school:
//     - { label, track, first: YYYY-MM-DD, last: YYYY-MM-DD,
//         off: [{ from, to, label }] }

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const iso = (d) => d.toISOString().slice(0, 10);
const day = (s) => new Date(`${ymd(s)}T00:00:00Z`);
const ymd = (v) => (v instanceof Date ? iso(v) : String(v).slice(0, 10));

export function monthName(m) {
  return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m];
}

function* eachDay(a, b) {
  for (let d = day(a); d <= day(b); d.setUTCDate(d.getUTCDate() + 1)) yield iso(d);
}

export async function schoolTracks() {
  const lore = await getCollection("lore");
  const cal = lore.find((e) => e.id === "calendar");
  const list = Array.isArray(cal?.data?.school) ? cal.data.school : [];
  return list.map((t) => ({
    label: t.label ?? t.track ?? "school",
    track: t.track ?? "school",
    first: ymd(t.first),
    last: ymd(t.last),
    off: (Array.isArray(t.off) ? t.off : []).map((o) => ({
      from: ymd(o.from),
      to: ymd(o.to ?? o.from),
      label: o.label ?? "No school",
    })),
  }));
}

// date -> { session: [track labels], off: [{track, label, first}] }
export async function schoolByDate() {
  const by = new Map();
  const get = (d) => by.get(d) ?? by.set(d, { session: [], off: [] }).get(d);
  for (const t of await schoolTracks()) {
    const offDays = new Map();
    for (const o of t.off) {
      let first = true;
      for (const d of eachDay(o.from, o.to)) {
        offDays.set(d, { track: t.track, label: o.label, first });
        first = false;
      }
    }
    for (const d of eachDay(t.first, t.last)) {
      const wd = day(d).getUTCDay();
      if (wd === 0 || wd === 6) continue;
      const o = offDays.get(d);
      if (o) get(d).off.push(o);
      else get(d).session.push(t.track);
    }
  }
  return by;
}

// Dated rows of meta/timeline.md: "| Wed Jul 14 2032 | Strand | Event |", with
// optional ** emphasis and a leading ~ for "about".
export async function timelineEvents() {
  const lore = await getCollection("lore");
  const tl = lore.find((e) => e.id === "timeline");
  if (!tl?.body) return [];
  const out = [];
  const re = /^\|\s*(~?)\**\s*(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{4})\**\s*\|\s*([^|]*)\|\s*([^|]*)\|/;
  for (const line of tl.body.split("\n")) {
    const m = line.match(re);
    if (!m) continue;
    const month = MONTHS.indexOf(m[2]);
    if (month < 0) continue;
    const date = `${m[4]}-${String(month + 1).padStart(2, "0")}-${m[3].padStart(2, "0")}`;
    const clean = (s) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "").trim();
    out.push({ date, approx: m[1] === "~", strand: clean(m[5]), label: clean(m[6]), strong: /\*\*/.test(m[6]) });
  }
  return out;
}

export async function calendarEntry() {
  return (await getCollection("lore")).find((e) => e.id === "calendar") ?? null;
}

// date -> { count, href }: href is that day on the first scene story's year page.
let counts;
export async function sceneCounts() {
  if (counts) return counts;
  counts = new Map();
  for (const idx of (await sceneStories()).values()) {
    for (const s of idx.scenes) {
      const c = counts.get(s.date) ?? { count: 0, href: `${idx.base}${s.year}/#${s.date}` };
      c.count++;
      counts.set(s.date, c);
    }
  }
  return counts;
}

export async function calendarYears() {
  const years = new Set();
  for (const e of await timelineEvents()) years.add(+e.date.slice(0, 4));
  for (const d of (await sceneCounts()).keys()) years.add(+d.slice(0, 4));
  for (const t of await schoolTracks()) {
    years.add(+t.first.slice(0, 4));
    years.add(+t.last.slice(0, 4));
  }
  return [...years].sort();
}

// Twelve months of cells for one year.
export async function yearGrid(year) {
  const school = await schoolByDate();
  const events = (await timelineEvents()).filter((e) => e.date.startsWith(`${year}-`));
  const counts = await sceneCounts();
  const tracks = (await schoolTracks()).filter((t) => t.first.slice(0, 4) <= String(year) && t.last.slice(0, 4) >= String(year));
  const months = [];
  for (let m = 0; m < 12; m++) {
    const first = new Date(Date.UTC(year, m, 1));
    const lead = first.getUTCDay(); // Sunday-first grid
    const days = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    const cells = Array.from({ length: lead }, () => null);
    for (let n = 1; n <= days; n++) {
      const date = `${year}-${String(m + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
      const wd = (lead + n - 1) % 7;
      const s = school.get(date);
      cells.push({
        date,
        n,
        weekend: wd === 0 || wd === 6,
        session: s?.session ?? [],
        off: s?.off ?? [],
        events: events.filter((e) => e.date === date),
        scenes: counts.get(date)?.count ?? 0,
        scenesHref: counts.get(date)?.href ?? null,
      });
    }
    months.push({ m, name: monthName(m), cells });
  }
  return { year, months, tracks, events };
}
