// Map-marker glyphs: spare single-weight strokes, in the spirit of a scout's
// field notation. 24x24, stroke = currentColor. Generic names so any universe
// can use them; "pin" is the fallback.
const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
const wrap = (body) =>
  `<svg viewBox="0 0 24 24" width="24" height="24" ${S} aria-hidden="true">${body}</svg>`;

export const GLYPHS = {
  // a gate between two hills
  gate: wrap('<path d="M1 18 Q6 9 10.5 18"/><path d="M13.5 18 Q18 9 23 18"/><path d="M9 18 V12 H15 V18"/><path d="M9 15 H15"/>'),
  // a wall line with its tick
  wall: wrap('<path d="M3 16 H21"/><path d="M12 16 V7"/><path d="M6 16 V12 M18 16 V12"/>'),
  // furrows
  furrow: wrap('<path d="M3 8 Q12 5 21 8"/><path d="M3 13 Q12 10 21 13"/><path d="M3 18 Q12 15 21 18"/>'),
  // water with a crossing
  river: wrap('<path d="M2 12 Q5 9 8 12 T14 12 T20 12 T23 12"/><path d="M12 5 V19"/>'),
  // listening arcs
  ear: wrap('<path d="M9 15 a5 5 0 0 1 7 -7"/><path d="M6 19 a10 10 0 0 1 13 -13"/><circle cx="11" cy="13" r="1.2" fill="currentColor" stroke="none"/>'),
  // a conifer
  tree: wrap('<path d="M12 3 L7 11 H10 L5 18 H19 L14 11 H17 Z"/><path d="M12 18 V22"/>'),
  // a tent
  camp: wrap('<path d="M4 19 L12 5 L20 19"/><path d="M9 19 L12 13.5 L15 19"/>'),
  // an unfinished enclosure: walls up, open top — not done being a place
  site: wrap('<path d="M5 4 V19 H19 V4"/><path d="M8 13 Q12 11 16 13"/>'),
  // the fallback
  pin: wrap('<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>'),
};

export function glyphSvg(name) {
  return GLYPHS[name] ?? GLYPHS.pin;
}
