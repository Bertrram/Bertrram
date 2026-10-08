// A row of numbers from the last year on GitHub, and the languages across my
// repos as one bar.

import { rect, svg, panel } from '../lib/pixel.mjs';
import { text, textWidth } from '../lib/font.mjs';

const W = 880;
const H = 224;

const num = (n) => n.toLocaleString('en-US');

export function stats(s) {
  const tiles = [
    [num(s.total), 'contributions'],
    [num(s.longestStreak), 'day streak'],
    [num(s.busiest?.count ?? 0), 'busiest day'],
    [num(s.stars), 'stars'],
  ];
  const tw = 196;
  const gap = (W - 48 - tiles.length * tw) / (tiles.length - 1);
  const parts = [
    panel(0, 0, W, H, { fill: '#0b1226', border: '#1f2b4d', light: '#2a3a66', px: 3 }),
    text('The last 12 months', 24, 18, 2, '#8f9bbf'),
  ];
  tiles.forEach(([value, label], i) => {
    const x = Math.round(24 + i * (tw + gap));
    parts.push(
      rect(x, 44, tw, 80, '#111a35'),
      rect(x, 44, 4, 80, '#126BFC'),
      text(value, x + 18, 58, 4, '#ffffff'),
      text(label, x + 18, 96, 2, '#8f9bbf'),
    );
  });

  // Languages, by bytes of code across all my repos.
  const all = s.languages.reduce((n, l) => n + l.size, 0) || 1;
  const shown = s.languages.filter((l) => l.size / all >= 0.02).slice(0, 6);
  parts.push(text('Languages', 24, 144, 2, '#8f9bbf'));
  let x = 24;
  const bw = W - 48;
  s.languages.forEach((l, i) => {
    const w = i === s.languages.length - 1 ? 24 + bw - x : Math.round((l.size / all) * bw);
    if (w > 0) parts.push(rect(x, 168, w, 10, l.color));
    x += w;
  });
  x = 24;
  for (const l of shown) {
    const label = `${l.name} ${Math.round((l.size / all) * 100)}%`;
    if (x + 16 + textWidth(label, 2) > W - 24) break;
    parts.push(rect(x, 194, 10, 10, l.color), text(label, x + 16, 193, 2, '#c9d3ee'));
    x += 16 + textWidth(label, 2) + 24;
  }

  return svg({
    w: W, h: H,
    title: `The last 12 months: ${s.total} contributions, a ${s.longestStreak} day streak, ${s.stars} stars. Languages: ${shown.map((l) => l.name).join(', ')}.`,
    body: parts.join(''),
  });
}
