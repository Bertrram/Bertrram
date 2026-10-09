// Small helpers for drawing pixel art as SVG.

/**
 * Draw a sprite given as rows of characters. `palette` maps a character to a
 * colour; any character not in it is transparent. Runs of one colour in a row
 * become one rectangle, and all rectangles of a colour share one <path>.
 */
export function sprite(rows, palette, x0 = 0, y0 = 0, s = 1) {
  const byColor = new Map();
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const fill = palette[row[x]];
      if (!fill) { x++; continue; }
      let e = x;
      while (e < row.length && row[e] === row[x]) e++;
      if (!byColor.has(fill)) byColor.set(fill, []);
      byColor.get(fill).push(`M${r(x0 + x * s)} ${r(y0 + y * s)}h${r((e - x) * s)}v${r(s)}h${r(-(e - x) * s)}z`);
      x = e;
    }
  });
  return [...byColor].map(([fill, d]) => `<path fill="${fill}" d="${d.join('')}"/>`).join('');
}

/** Width and height in sprite pixels. */
export function size(rows) {
  return { w: Math.max(...rows.map((row) => row.length)), h: rows.length };
}

/** Flip a sprite left to right. */
export function mirror(rows) {
  return rows.map((row) => [...row].reverse().join(''));
}

export function rect(x, y, w, h, fill, attrs = '') {
  return `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${fill}" ${attrs}/>`;
}

/** The outer <svg>. Animations stop for people who ask for reduced motion. */
export function svg({ w, h, title, body, style = '', defs = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${style}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; } }
</style>
<defs>${defs}</defs>
${body}
</svg>
`;
}

/**
 * A chunky pixel frame like an old game's dialog box: dark fill, a light
 * border and a darker inner edge.
 */
export function panel(x, y, w, h, { fill = '#0b1226', border = '#2b3f73', light = '#3d5aa6', px = 4 } = {}) {
  return [
    rect(x + px, y, w - 2 * px, h, border),
    rect(x, y + px, w, h - 2 * px, border),
    rect(x + px, y + px, w - 2 * px, h - 2 * px, light),
    rect(x + 2 * px, y + 2 * px, w - 4 * px, h - 4 * px, fill),
  ].join('');
}

/** CRT scanlines over an area. */
export function scanlines(id, x, y, w, h, opacity = 0.12) {
  return {
    defs: `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000"/></pattern>`,
    body: `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})" opacity="${opacity}" pointer-events="none"/>`,
  };
}

/** A seeded random number generator, so every run draws the same scene. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function r(n) {
  return Math.round(n * 100) / 100;
}
