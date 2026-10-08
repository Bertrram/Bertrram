// An old TV that flips through the games I play, with a static flash between.

import { sprite, rect, svg, panel, rng, scanlines } from '../lib/pixel.mjs';
import { text } from '../lib/font.mjs';
import { blockDefs } from '../lib/blocks.mjs';
import {
  SUN, SUN_P, MOON, MOON_P, CLOUD, CLOUD_P, PLAYER, PLAYER_P, TRUCK_BODY, TRUCK_P, WHEEL_A, WHEEL_B, WHEEL_P,
  ICON_PORTAL, ICON_PORTAL_P, HEART, HEART_P, PAD, PAD_P,
} from '../lib/sprites.mjs';

const W = 880;
const H = 280;
const SW = 288;
const SH = 184;
const SLOT = 4; // seconds per game

const block = (id, x, y, s = 1) => `<use href="#b-${id}" transform="translate(${x} ${y}) scale(${s})"/>`;

function column(x, h, size, s, { snow = false } = {}) {
  let out = '';
  for (let j = 0; j < h; j++) {
    const depth = h - 1 - j;
    const id = snow ? (depth === 0 ? 'snowtop' : 'snow') : depth === 0 ? 'grass' : depth <= 1 ? 'dirt' : 'stone';
    out += block(id, x, SH - (j + 1) * size, s);
  }
  return out;
}

function minecraft() {
  const size = 24;
  const hs = [2, 2, 3, 3, 4, 3, 2, 2, 2, 3, 3, 2];
  let g = rect(0, 0, SW, SH, '#8fc8ff');
  g += sprite(SUN, SUN_P, 226, 14, 4);
  g += `<g class="drift">${sprite(CLOUD, CLOUD_P, 20, 30, 3)}</g>`;
  hs.forEach((h, i) => { g += column(i * size, h, size, 1.5); });
  const tx = 7 * size;
  const base = SH - 2 * size;
  g += block('log', tx, base - size, 1.5) + block('log', tx, base - 2 * size, 1.5);
  for (const [dx, dy] of [[-1, 3], [0, 3], [1, 3], [-1, 4], [0, 4], [1, 4], [0, 5]]) g += block('leaves', tx + dx * size, base - dy * size, 1.5);
  return g;
}

function terraria() {
  const rand = rng(5);
  let g = `<rect width="${SW}" height="${SH}" fill="url(#night)"/>`;
  for (let i = 0; i < 26; i++) g += rect(Math.floor(rand() * SW), Math.floor(rand() * 90), 2, 2, '#ffffff', `class="tw" style="animation-delay:${(rand() * 2).toFixed(2)}s"`);
  g += sprite(MOON, MOON_P, 30, 16, 4);
  const hs = [5, 5, 6, 6, 6, 5, 5, 4, 4, 4, 5, 5, 6, 7, 7, 6, 6, 5];
  hs.forEach((h, i) => { g += column(i * 16, h, 16, 1); });
  // A cave with gold in it.
  for (const [cx, cy] of [[9, 2], [10, 2], [11, 2], [10, 1]]) g += rect(cx * 16, SH - (cy + 1) * 16, 16, 16, '#120c08');
  g += block('gold', 12 * 16, SH - 3 * 16) + block('gold', 9 * 16, SH - 1 * 16) + block('diamond', 13 * 16, SH - 2 * 16);
  // A round tree.
  const tx = 7 * 16;
  const base = SH - hs[7] * 16;
  g += block('log', tx, base - 16) + block('log', tx, base - 32);
  for (const [dx, dy] of [[-1, 3], [0, 3], [1, 3], [-2, 4], [-1, 4], [0, 4], [1, 4], [2, 4], [-1, 5], [0, 5], [1, 5]]) g += block('leaves', tx + dx * 16, base - dy * 16);
  g += sprite(PLAYER, PLAYER_P, 10 * 16, SH - hs[10] * 16 - 24, 1);
  const torch = SH - hs[13] * 16;
  g += `<rect class="torch" x="${13 * 16 + 6}" y="${torch - 10}" width="4" height="4" fill="#ffb347"/>${rect(13 * 16 + 7, torch - 6, 2, 6, '#8a6238')}`;
  return g;
}

function snowrunner() {
  const rand = rng(9);
  let g = `<rect width="${SW}" height="${SH}" fill="url(#snowsky)"/>`;
  for (let i = 0; i < 9; i++) {
    const x = i * 34 + Math.floor(rand() * 10);
    const h = 40 + Math.floor(rand() * 30);
    g += `<path fill="#6c8299" d="M${x + 12} ${SH - 40 - h}h4v8h4v10h4v12h4v14h4v${h - 44}h-40v-${h - 44}h4v-14h4v-12h4v-10h4z"/>`;
  }
  const hs = [3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2];
  hs.forEach((h, i) => { g += column(i * 16, h, 16, 1, { snow: true }); });
  g += `<g class="drive"><g transform="translate(0 ${SH - 3 * 16 - 40})">
    ${sprite(TRUCK_BODY, TRUCK_P, 0, 0, 3)}
    <g class="wa">${sprite(WHEEL_A, WHEEL_P, 6, 24, 3)}${sprite(WHEEL_A, WHEEL_P, 45, 24, 3)}</g>
    <g class="wb">${sprite(WHEEL_B, WHEEL_P, 6, 24, 3)}${sprite(WHEEL_B, WHEEL_P, 45, 24, 3)}</g>
  </g></g>`;
  for (let i = 0; i < 30; i++) {
    g += rect(Math.floor(rand() * SW), Math.floor(rand() * SH) - SH, 2, 2, '#ffffff', `class="fall" style="animation-delay:-${(rand() * 3).toFixed(2)}s;animation-duration:${(2 + rand() * 2).toFixed(2)}s"`);
  }
  return g;
}

function skylanders() {
  const rand = rng(3);
  let g = `<rect width="${SW}" height="${SH}" fill="url(#portalsky)"/>`;
  g += `<rect class="beam" x="${SW / 2 - 36}" y="0" width="72" height="${SH - 60}" fill="url(#beam)"/>`;
  g += `<g class="pulse">${sprite(ICON_PORTAL, ICON_PORTAL_P, SW / 2 - 48, SH - 112, 6)}</g>`;
  for (let i = 0; i < 16; i++) {
    g += rect(SW / 2 - 40 + Math.floor(rand() * 80), SH - 70, 3, 3, i % 2 ? '#7ff8ee' : '#ffffff', `class="rise" style="animation-delay:-${(rand() * 2).toFixed(2)}s"`);
  }
  return g;
}

function nintendo() {
  let g = rect(0, 0, SW, SH, '#ffefd6');
  for (let y = 0; y < SH; y += 24) for (let x = (y / 24) % 2 ? 24 : 0; x < SW; x += 48) g += rect(x, y, 24, 24, '#ffe2bd');
  for (let i = 0; i < 3; i++) g += sprite(HEART, HEART_P, 12 + i * 26, 12, 3);
  g += `<g class="beat">${sprite(PAD, PAD_P, SW / 2 - 48, 46, 8)}</g>`;
  return g;
}

const SCENES = { MINECRAFT: minecraft, TERRARIA: terraria, SNOWRUNNER: snowrunner, SKYLANDERS: skylanders };

export function nowPlaying(s, cfg) {
  const games = cfg.games;
  const n = games.length;
  const loop = n * SLOT;
  const rand = rng(21);
  const sx = 40;
  const sy = 36;

  const scenes = games.map((name, i) => {
    const draw = SCENES[name.toUpperCase()] ?? nintendo;
    const delay = i === 0 ? 0 : i * SLOT - loop;
    return `<g class="show" style="animation-delay:${delay}s">${draw()}
      ${rect(0, SH - 26, SW, 26, '#000000', 'opacity=".6"')}
      ${text(name, SW / 2, SH - 19, 2, '#ffffff', { anchor: 'middle' })}</g>`;
  });

  let noise = '';
  for (let i = 0; i < 260; i++) {
    const c = ['#d7dbe2', '#8a8f99', '#4a4f59', '#ffffff'][Math.floor(rand() * 4)];
    noise += rect(Math.floor(rand() * 72) * 4, Math.floor(rand() * 46) * 4, 4, 4, c);
  }
  const lines = scanlines('tvscan', 0, 0, SW, SH, 0.2);

  const tv = `
${rect(24, 20, 360, 232, '#8d8470')}
${rect(24, 20, 356, 228, '#c9bfa5')}
${rect(28, 24, 348, 4, '#e6dcc2')}
${rect(sx - 6, sy - 6, SW + 12, SH + 12, '#2a2622')}
<g transform="translate(${sx} ${sy})">
  <clipPath id="screen"><rect width="${SW}" height="${SH}"/></clipPath>
  <g clip-path="url(#screen)">
    <rect width="${SW}" height="${SH}" fill="#000"/>
    ${scenes.join('')}
    <g class="static">${noise}</g>
    ${lines.body}
    ${rect(10, 8, 40, 4, '#ffffff', 'opacity=".12"')}${rect(10, 12, 4, 24, '#ffffff', 'opacity=".12"')}
  </g>
</g>
${rect(340, 52, 28, 28, '#5f584a')}${rect(344, 56, 20, 20, '#3a352d')}${rect(352, 56, 4, 8, '#c9bfa5')}
${rect(340, 96, 28, 28, '#5f584a')}${rect(344, 100, 20, 20, '#3a352d')}${rect(356, 108, 8, 4, '#c9bfa5')}
${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => rect(338, 146 + k * 10, 32, 4, '#8d8470')).join('')}
${rect(346, 234, 6, 6, '#ff4d6d', 'class="led"')}
${rect(60, 252, 20, 12, '#5f584a')}${rect(328, 252, 20, 12, '#5f584a')}`;

  const list = games.map((name, i) => {
    const y = 92 + i * 30;
    const delay = i === 0 ? 0 : i * SLOT - loop;
    return text(name, 452, y, 2, '#4a5578') +
      `<g class="show" style="animation-delay:${delay}s">${rect(432, y + 2, 6, 10, '#126BFC')}${text(name, 452, y, 2, '#ffffff')}</g>`;
  });

  const style = `
.show { opacity: 0; animation: show ${loop}s steps(1) infinite; }
@keyframes show { 0% { opacity: 1; } ${(100 / n).toFixed(3)}% { opacity: 0; } 100% { opacity: 0; } }
.static { opacity: 0; animation: static ${SLOT}s steps(1) infinite; }
@keyframes static { 0% { opacity: 1; } 4% { opacity: 0; } 100% { opacity: 0; } }
.tw { animation: tw 2s steps(2) infinite; }
@keyframes tw { 50% { opacity: .2; } }
.drift { animation: drift ${SLOT}s linear infinite; }
@keyframes drift { from { transform: translateX(0); } to { transform: translateX(60px); } }
.drive { animation: drive ${SLOT}s linear infinite; }
@keyframes drive { from { transform: translateX(-80px); } to { transform: translateX(${SW + 10}px); } }
.wa { animation: wa .24s steps(1) infinite; }
@keyframes wa { 50% { opacity: 0; } }
.wb { opacity: 0; animation: wb .24s steps(1) infinite; }
@keyframes wb { 50% { opacity: 1; } }
.fall { animation: fall 3s linear infinite; }
@keyframes fall { from { transform: translate(0, 0); } to { transform: translate(-30px, ${SH * 2}px); } }
.pulse { animation: pulse 1s steps(2) infinite; }
@keyframes pulse { 50% { opacity: .75; } }
.beam { animation: beam 1s steps(2) infinite; }
@keyframes beam { 50% { opacity: .5; } }
.rise { animation: rise 2s linear infinite; }
@keyframes rise { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-110px); opacity: 0; } }
.beat { animation: beat .8s steps(1) infinite; }
@keyframes beat { 50% { transform: translateY(-4px); } }
.torch { animation: torch .3s steps(1) infinite; }
@keyframes torch { 50% { fill: #ffd84a; } }
.led { animation: led 2s steps(1) infinite; }
@keyframes led { 50% { opacity: .3; } }
`;

  const defs = `${blockDefs()}${lines.defs}
<linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d2b"/><stop offset="1" stop-color="#2b3d7a"/></linearGradient>
<linearGradient id="snowsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ea3ba"/><stop offset="1" stop-color="#dfe8f1"/></linearGradient>
<linearGradient id="portalsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0624"/><stop offset="1" stop-color="#2d1a5e"/></linearGradient>
<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ff8ee" stop-opacity="0"/><stop offset="1" stop-color="#7ff8ee" stop-opacity=".45"/></linearGradient>`;

  const body = `
${panel(0, 0, W, H, { fill: '#0b1226', border: '#1f2b4d', light: '#2a3a66', px: 3 })}
${tv}
${text('Currently playing', 428, 40, 3, '#ffffff')}
${rect(428, 66, 420, 2, '#2b3f73')}
${list.join('')}`;

  return svg({ w: W, h: H, title: `Currently playing: ${games.join(', ')}`, body, style, defs });
}
