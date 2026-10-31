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
  // a house
  house: wrap('<path d="M4 11 L12 4 L20 11"/><path d="M6 10 V20 H18 V10"/><path d="M10 20 V14 H14 V20"/>'),
  // a bell: the school
  bell: wrap('<path d="M7 16 V11 a5 5 0 0 1 10 0 V16 L19 18 H5 Z"/><path d="M10 20 a2 2 0 0 0 4 0"/>'),
  // a cross: the hospital
  cross: wrap('<path d="M9 4 H15 V9 H20 V15 H15 V20 H9 V15 H4 V9 H9 Z"/>'),
  // a cup: the cafe
  cup: wrap('<path d="M5 8 H17 V15 a4 4 0 0 1 -4 4 H9 a4 4 0 0 1 -4 -4 Z"/><path d="M17 10 h2 a2 2 0 0 1 0 4 h-2"/><path d="M8 4 V6 M11 3 V6 M14 4 V6"/>'),
  // a shield: the field office
  shield: wrap('<path d="M12 3 L19 6 V11 C19 16 15.5 19.5 12 21 C8.5 19.5 5 16 5 11 V6 Z"/>'),
  // a lectern: the college
  book: wrap('<path d="M4 6 Q8 4 12 6 Q16 4 20 6 V19 Q16 17 12 19 Q8 17 4 19 Z"/><path d="M12 6 V19"/>'),
  // the fallback
  pin: wrap('<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>'),
};

export function glyphSvg(name) {
  return GLYPHS[name] ?? GLYPHS.pin;
}
