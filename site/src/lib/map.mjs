import { getCollection } from "astro:content";

// A place file opts onto the map with frontmatter:
//   map: { lat, lng, glyph? }                      — one marker, named after the place
//   map: [{ label, anchor?, lat, lng, glyph? }]    — a cluster file: several markers,
//     each linking to its heading anchor on the place's page.
// glyph names one of src/lib/glyphs.mjs; omitted means the plain pin.
export async function mappedPlaces() {
  const places = await getCollection("places");
  const markers = [];
  for (const e of places) {
    if (e.id === "readme" || !e.data?.map) continue;
    const base = `/places/${e.id}/`;
    const items = Array.isArray(e.data.map) ? e.data.map : [e.data.map];
    for (const m of items) {
      if (typeof m?.lat !== "number" || typeof m?.lng !== "number") continue;
      markers.push({
        name: m.label ?? e.data.name ?? e.id,
        href: m.anchor ? `${base}#${m.anchor}` : base,
        lat: m.lat,
        lng: m.lng,
        glyph: m.glyph ?? "pin",
      });
    }
  }
  return markers;
}
