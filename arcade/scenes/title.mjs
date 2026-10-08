// The header: a scrolling starfield, the name dropping in letter by letter,
// the tagline typed out under it and a player running along the ground.

import { sprite, svg, rng, scanlines, r } from '../lib/pixel.mjs';
import { text, textD, textWidth } from '../lib/font.mjs';
import { blockDefs, use, BLOCK as B } from '../lib/blocks.mjs';
import { PLAYER, PLAYER_P } from '../lib/sprites.mjs';

const W = 880;
const H = 252;
const GROUND = 204;

// The player's legs, in two frames, for running.
const LEGS_A = PLAYER.slice(19);
const LEGS_B = ['...PPPPPPPPPP...', '....PPPPPPPP....', '.....PPPPPP.....', '....KKKKKKKK....', '....kkkkkkkk....'];

// Reveals the tagline a letter at a time. SMIL rather than CSS, because
// animating a rect's width with CSS doesn't work in every browser.
function typing(str, w) {
  const n = [...str].length;
  const values = Array.from({ length: n + 1 }, (_, i) => Math.round((i / n) * (w + 4))).join(';');
  return `<animate attributeName="width" values="${values}" dur="1.6s" begin="1.1s" fill="freeze" calcMode="discrete"/>`;
}

export function title(cfg) {
  const rand = rng(11);

  // Three layers of stars, each drawn twice side by side so the scroll loops.
  const layers = [
    { n: 50, size: 2, color: '#3b4f86', dur: 90 },
    { n: 30, size: 2, color: '#8fa6e0', dur: 45 },
    { n: 14, size: 3, color: '#ffffff', dur: 22 },
  ].map((l) => {
    const pts = Array.from({ length: l.n }, () => [Math.floor(rand() * W), 12 + Math.floor(rand() * (GROUND - 24))]);
    const d = pts.map(([x, y]) => `M${x} ${y}h${l.size}v${l.size}h-${l.size}z`).join('');
    return `<g class="sc" style="animation-duration:${l.dur}s"><path fill="${l.color}" d="${d}"/><path fill="${l.color}" transform="translate(${W} 0)" d="${d}"/></g>`;
  });

  // The name: each letter its own path so it can drop in on its own.
  const scale = 11;
  const name = cfg.name;
  const nameW = textWidth(name, scale);
  let x = Math.round((W - nameW) / 2);
  const y = 46;
  const letters = [];
  [...name].forEach((ch, i) => {
    const d = textD(ch, x, y, scale);
    const outline = [[-3, 0], [3, 0], [0, -3], [0, 3], [6, 6], [3, 6], [6, 3]]
      .map(([dx, dy]) => `<path fill="${dx === 6 || dy === 6 ? '#0a3fa0' : '#050a1c'}" transform="translate(${dx} ${dy})" d="${d}"/>`)
      .join('');
    letters.push(`<g class="drop" style="animation-delay:${r(0.15 + i * 0.11)}s">${outline}<path fill="url(#name)" d="${d}"/></g>`);
    x += textWidth(ch, scale) + scale;
  });

  const sub = cfg.tagline;
  const subW = textWidth(sub, 2);
  const subX = Math.round((W - subW) / 2);

  // Ground that scrolls a block at a time, with the player running on it.
  const ground = [];
  for (let gx = -B; gx < W + B; gx += B) {
    ground.push(use('grass', gx, GROUND), use('dirt', gx, GROUND + B), use('stone', gx, GROUND + 2 * B));
  }
  const body = PLAYER.slice(0, 19);
  const px = 96;
  const py = GROUND - PLAYER.length * 2;
  const player = `<g class="bob">
    ${sprite(body, PLAYER_P, px, py, 2)}
    <g class="la">${sprite(LEGS_A, PLAYER_P, px, py + 19 * 2, 2)}</g>
    <g class="lb">${sprite(LEGS_B, PLAYER_P, px, py + 19 * 2, 2)}</g>
  </g>`;

  const lines = scanlines('scan', 0, 0, W, H, 0.06);

  const style = `
.sc { animation: sc linear infinite; }
@keyframes sc { from { transform: translateX(0); } to { transform: translateX(-${W}px); } }
.drop { animation: drop .9s cubic-bezier(.3,.7,.4,1) both; }
@keyframes drop { 0% { transform: translateY(-200px); } 70% { transform: translateY(0); } 85% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
.gr { animation: gr .5s linear infinite; }
@keyframes gr { from { transform: translateX(0); } to { transform: translateX(-${B}px); } }
.la { animation: la .3s steps(1) infinite; }
@keyframes la { 50% { opacity: 0; } }
.lb { opacity: 0; animation: lb .3s steps(1) infinite; }
@keyframes lb { 50% { opacity: 1; } }
.bob { animation: bob .3s steps(1) infinite; }
@keyframes bob { 50% { transform: translateY(-2px); } }
`;

  const defs = `${blockDefs()}${lines.defs}
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050816"/><stop offset="1" stop-color="#0f1e4a"/></linearGradient>
<linearGradient id="name" gradientUnits="userSpaceOnUse" x1="0" y1="${y}" x2="0" y2="${y + 7 * scale}">
  <stop offset="0" stop-color="#ffffff"/><stop offset=".43" stop-color="#ffffff"/>
  <stop offset=".43" stop-color="#bcd6ff"/><stop offset=".72" stop-color="#bcd6ff"/>
  <stop offset=".72" stop-color="#5d9bff"/><stop offset="1" stop-color="#5d9bff"/>
</linearGradient>
<clipPath id="typed"><rect x="${subX - 2}" y="0" width="0" height="${H}">${typing(sub, subW)}</rect></clipPath>`;

  const bodySvg = `
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${layers.join('')}
${letters.join('')}
<g clip-path="url(#typed)">${text(sub, subX, 148, 2, '#c9d3ee')}</g>
<g class="gr">${ground.join('')}</g>
${player}
${lines.body}`;

  return svg({ w: W, h: H, title: `${cfg.name}. ${cfg.tagline}`, body: bodySvg, style, defs });
}
