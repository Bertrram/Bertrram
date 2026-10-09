// The contribution calendar as a block world. Each column is a week: the hill
// is as tall as the week was busy, and underneath, each block is one day, with
// rarer ore for busier days. A truck drives over it while the sun goes round.

import { BLOCK as B, ORES, blockDefs, use, oreIcon } from '../lib/blocks.mjs';
import { sprite, rect, svg, rng, r } from '../lib/pixel.mjs';
import { text, textWidth } from '../lib/font.mjs';
import {
  TRUCK_BODY, TRUCK_P, WHEEL_A, WHEEL_B, WHEEL_P, CLOUD, CLOUD_P, SUN, SUN_P, MOON, MOON_P,
  TUFT, FLOWER_RED, FLOWER_YELLOW, PLANT_P, FLAG, FLAG_P,
} from '../lib/sprites.mjs';

const W = 880;
const HUD = 30;
const MAXH = 7;
const Y0 = 200; // top of the first underground row
const BED = Y0 + 7 * B;
const LEGEND = BED + B + 6;
const H = LEGEND + 62;
const CYCLE = 40; // seconds for one day and night
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function world(s) {
  const cols = s.weeks.length;
  const x0 = Math.round((W - cols * B) / 2);
  const colX = (i) => x0 + i * B;
  const rand = rng(cols * 31 + s.total);

  // Hill height in blocks, from the week's total, on a log scale so one huge
  // week doesn't flatten the rest.
  const totals = s.weeks.map((w) => w.reduce((n, d) => n + d.count, 0));
  const maxWeek = Math.max(1, ...totals);
  const h = totals.map((t) => (t === 0 ? 1 : 1 + Math.max(1, Math.round(((MAXH - 1) * Math.log1p(t)) / Math.log1p(maxWeek)))));

  // Snow fills in front of steep climbs so the truck never faces a wall:
  // the top it drives on rises at most one block a column.
  const e = [...h];
  for (let i = 1; i < cols; i++) e[i] = Math.max(e[i], e[i - 1] - 1);
  for (let i = cols - 2; i >= 0; i--) e[i] = Math.max(e[i], e[i + 1] - 1);
  const top = (i) => Y0 - e[i] * B;
  const last = () => cols - 1;

  const surface = [];
  const shade = []; // rects the night darkens
  for (let i = 0; i < cols; i++) {
    const x = colX(i);
    for (let j = 0; j < h[i]; j++) {
      const depth = h[i] - 1 - j; // blocks below the grass
      surface.push(use(depth === 0 ? 'grass' : depth <= 2 ? 'dirt' : 'stone', x, Y0 - (j + 1) * B));
    }
    for (let j = h[i]; j < e[i]; j++) surface.push(use(j === e[i] - 1 ? 'snowtop' : 'snow', x, Y0 - (j + 1) * B));
    shade.push(`M${x} ${top(i)}h${B}v${Y0 - top(i)}h${-B}z`);
  }

  // Beyond the calendar on both sides: the same ground, and unexplored rock.
  const edges = [];
  for (const [from, step, col] of [[x0 - B, -B, 0], [x0 + cols * B, B, last()]]) {
    for (let x = from; x > -B && x < W; x += step) {
      for (let j = 0; j < e[col]; j++) edges.push(use(j === e[col] - 1 ? (e[col] > h[col] ? 'snowtop' : 'grass') : j >= e[col] - 3 ? 'dirt' : 'stone', x, Y0 - (j + 1) * B));
      for (let wd = 0; wd < 7; wd++) edges.push(use('fog', x, Y0 + wd * B));
      edges.push(use('bedrock', x, BED));
      shade.push(`M${x} ${top(col)}h${B}v${Y0 - top(col)}h${-B}z`);
    }
  }

  // Signposts on the weeks projects were started.
  const signs = [];
  const signCols = new Set();
  const firstDay = s.days[0]?.date;
  const placed = [];
  for (const repo of [...s.repos].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    const day = repo.createdAt.slice(0, 10);
    if (!firstDay || day < firstDay) continue;
    const i = s.weeks.findIndex((w) => w.some((d) => d.date >= day) && w[0].date <= day) ;
    const col = i === -1 ? cols - 1 : i;
    const label = repo.name;
    const bw = textWidth(label, 1) + 8;
    const cx = colX(col) + B / 2;
    let bx = Math.round(cx - bw / 2);
    bx = Math.max(4, Math.min(W - bw - 4, bx));
    let by = top(col) - 28;
    while (placed.some((p) => bx < p.x + p.w + 2 && p.x < bx + bw + 2 && Math.abs(p.y - by) < 16)) by -= 16;
    if (by < HUD + 4) continue; // no room left above this week
    placed.push({ x: bx, y: by, w: bw });
    signCols.add(col);
    signs.push(
      rect(cx - 1, by + 13, 2, top(col) - by - 13, '#5a3d22') +
        rect(bx, by, bw, 13, '#c08a4e') +
        rect(bx, by + 12, bw, 1, '#8a5d30') +
        rect(bx, by, bw, 1, '#d9a76a') +
        text(label, bx + 4, by + 2, 1, '#3a2512'),
    );
  }

  // Trees on quiet flat ground, flowers and grass on the rest.
  const deco = [];
  let lastTree = -10;
  for (let i = 2; i < cols - 2; i++) {
    if (e[i] !== h[i]) continue;
    const near = [...signCols].some((c) => Math.abs(c - i) <= 1);
    const flat = e[i - 1] <= h[i] + 1 && e[i + 1] <= h[i] + 1;
    if (!near && flat && h[i] <= 2 && i - lastTree > 4 && rand() < 0.3) {
      const trunk = 2 + Math.floor(rand() * 2);
      const y = top(i);
      for (let t = 1; t <= trunk; t++) {
        deco.push(use('log', colX(i), y - t * B));
        shade.push(`M${colX(i)} ${y - t * B}h${B}v${B}h${-B}z`);
      }
      const ly = y - trunk * B;
      for (const [dx, dy] of [[-1, 1], [0, 1], [1, 1], [-1, 2], [0, 2], [1, 2], [0, 3]]) {
        deco.push(use('leaves', colX(i + dx), ly - dy * B));
        shade.push(`M${colX(i + dx)} ${ly - dy * B}h${B}v${B}h${-B}z`);
      }
      lastTree = i;
      continue;
    }
    if (!near && rand() < 0.45) {
      const pick = [TUFT, TUFT, FLOWER_RED, FLOWER_YELLOW][Math.floor(rand() * 4)];
      deco.push(sprite(pick, PLANT_P, colX(i), top(i) - pick.length * 2, 2));
    }
  }
  deco.push(sprite(FLAG, FLAG_P, colX(last()) + 3, top(last()) - 16, 2));

  // The calendar underground.
  const under = [];
  const sparkles = [];
  s.weeks.forEach((week, i) => {
    const byDay = new Map(week.map((d) => [d.weekday, d]));
    for (let wd = 0; wd < 7; wd++) {
      const d = byDay.get(wd);
      const x = colX(i);
      const y = Y0 + wd * B;
      if (!d || d.date > s.today) { under.push(use('fog', x, y)); continue; }
      under.push(use(ORES[d.level].key, x, y));
      if (d.level === 4) {
        sparkles.push(rect(x + 4 + Math.floor(rand() * 6), y + 3 + Math.floor(rand() * 8), 2, 2, '#ffffff', `class="sp" style="animation-delay:${r(rand() * 3)}s"`));
      }
    }
  });
  const bedrock = [];
  for (let i = 0; i < cols; i++) bedrock.push(use('bedrock', colX(i), BED));

  // Month names on the bedrock.
  const months = [];
  let lastLabel = -100;
  s.weeks.forEach((week, i) => {
    const d = week[0];
    if (!d) return;
    const m = Number(d.date.slice(5, 7)) - 1;
    const prev = s.weeks[i - 1]?.[0];
    if (prev && Number(prev.date.slice(5, 7)) - 1 === m) return;
    const x = colX(i) + 1;
    if (x - lastLabel < 30 || x > W - 30) return;
    months.push(text(MONTHS[m], x, BED + 5, 1, '#c9cbd6'));
    lastLabel = x;
  });

  // Sky, far hills, sun, moon, stars and clouds.
  const kt = '0;0.35;0.45;0.55;0.85;0.95;1';
  const skyTop = ['#4f9dff', '#4f9dff', '#ff7a59', '#070b24', '#070b24', '#ff8fb5', '#4f9dff'].join(';');
  const skyBot = ['#c4e6ff', '#c4e6ff', '#ffd08a', '#1b2350', '#1b2350', '#ffd6a8', '#c4e6ff'].join(';');
  const hillCol = ['#86b9e6', '#86b9e6', '#e7a58e', '#141b3e', '#141b3e', '#e9b7c8', '#86b9e6'].join(';');
  const anim = (attr, values) => `<animate attributeName="${attr}" dur="${CYCLE}s" repeatCount="indefinite" keyTimes="${kt}" values="${values}"/>`;

  const stars = [];
  for (let i = 0; i < 46; i++) {
    stars.push(rect(Math.floor(rand() * W), HUD + 4 + Math.floor(rand() * 110), 2, 2, '#ffffff', `class="tw" style="animation-delay:${r(rand() * 2)}s"`));
  }

  let hills = `M0 ${Y0}`;
  let hy = 120;
  for (let x = 0; x <= W; x += 8) {
    hy = Math.max(96, Math.min(150, hy + Math.round((rand() - 0.5) * 3) * 4));
    hills += `V${hy}h8`;
  }
  hills += `V${Y0}z`;

  const arc = `M30 ${Y0 + 20} Q440 -90 850 ${Y0 + 20}`;
  const below = `L850 ${H + 60} L30 ${H + 60} Z`;
  const arcLen = quadLength([30, Y0 + 20], [440, -90], [850, Y0 + 20]);
  const totalLen = arcLen + (H + 60 - (Y0 + 20)) * 2 + 820;
  const kp = r(arcLen / totalLen);
  const orbit = (rows, pal, offset) =>
    `<g>${sprite(rows, pal, -12, -12, 3)}<animateMotion dur="${CYCLE}s" begin="${offset}s" repeatCount="indefinite" path="${arc} ${below}" keyPoints="0;${kp};1" keyTimes="0;0.5;1" calcMode="linear"/></g>`;

  const clouds = [];
  for (let i = 0; i < 5; i++) {
    const dur = 60 + Math.floor(rand() * 50);
    clouds.push(`<g class="cl" style="animation-duration:${dur}s;animation-delay:-${Math.floor(rand() * dur)}s">${sprite(CLOUD, CLOUD_P, 0, HUD + 14 + Math.floor(rand() * 70), 3)}</g>`);
  }

  // The truck follows the snow and grass tops.
  const pts = [[-70, top(0)], ...e.map((_, i) => [colX(i) + B / 2, top(i)]), [W + 70, top(last())]];
  let road = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    road += ` Q${pts[i][0]} ${pts[i][1]} ${mx} ${my}`;
  }
  road += ` L${pts.at(-1)[0]} ${pts.at(-1)[1]}`;
  const truck = `<g>
  <g transform="translate(-24 -27)">
    ${sprite(TRUCK_BODY, TRUCK_P, 0, 0, 2)}
    <g class="wa">${sprite(WHEEL_A, WHEEL_P, 4, 16, 2)}${sprite(WHEEL_A, WHEEL_P, 30, 16, 2)}</g>
    <g class="wb">${sprite(WHEEL_B, WHEEL_P, 4, 16, 2)}${sprite(WHEEL_B, WHEEL_P, 30, 16, 2)}</g>
    <rect class="spray" x="2" y="22" width="3" height="3" fill="#ffffff"/>
    <rect class="spray" x="4" y="24" width="2" height="2" fill="#d9e4f3" style="animation-delay:.2s"/>
    <rect class="spray" x="1" y="20" width="2" height="2" fill="#ffffff" style="animation-delay:.4s"/>
    <rect class="puff" x="40" y="-3" width="3" height="3" fill="#9aa0ab"/>
    <rect class="puff" x="40" y="-3" width="2" height="2" fill="#c3c8d1" style="animation-delay:.6s"/>
  </g>
  <animateMotion dur="34s" repeatCount="indefinite" rotate="auto" path="${road}"/>
</g>`;

  // HUD and legend.
  const hud = [
    rect(0, 0, W, HUD, '#0b1226', 'opacity="0.86"'),
    rect(0, HUD - 2, W, 2, '#126BFC'),
    text('Contribution world', 16, 7, 2, '#ffffff'),
    text(`${s.total.toLocaleString('en-US')} contributions in the last year`, W - 16, 7, 2, '#c9d3ee', { anchor: 'end' }),
  ];

  const legendItems = ORES.map((o, i) => ({ icon: i, label: o.name }));
  const itemW = legendItems.map((it) => 16 + 8 + textWidth(it.label, 2));
  const gap = 22;
  const total = itemW.reduce((a, b) => a + b, 0) + gap * (legendItems.length - 1);
  let lx = Math.round((W - total) / 2);
  const legend = [rect(0, BED + B, W, H - BED - B, '#0b1226')];
  legendItems.forEach((it, i) => {
    legend.push(oreIcon(it.icon, lx, LEGEND + 2, 2));
    legend.push(text(it.label, lx + 24, LEGEND + 6, 2, '#e6e9f2'));
    lx += itemW[i] + gap;
  });
  legend.push(text('One column per week, one block underground per day', W / 2, LEGEND + 32, 2, '#8f9bbf', { anchor: 'middle' }));

  const style = `
.tw { animation: tw 2.4s steps(2) infinite; }
@keyframes tw { 50% { opacity: .25; } }
.sp { animation: sp 1.8s steps(1) infinite; }
@keyframes sp { 0%, 60% { opacity: 0; } 70% { opacity: 1; } }
.cl { animation: cl linear infinite; }
@keyframes cl { from { transform: translateX(-80px); } to { transform: translateX(${W + 40}px); } }
.wa { animation: wa .24s steps(1) infinite; }
@keyframes wa { 50% { opacity: 0; } }
.wb { opacity: 0; animation: wb .24s steps(1) infinite; }
@keyframes wb { 50% { opacity: 1; } }
.spray { animation: spray .6s linear infinite; }
@keyframes spray { from { transform: translate(0, 0); opacity: 1; } to { transform: translate(-14px, -10px); opacity: 0; } }
.puff { animation: puff 1.2s linear infinite; }
@keyframes puff { from { transform: translate(0, 0); opacity: .9; } to { transform: translate(-10px, -14px); opacity: 0; } }
`;

  const defs = `${blockDefs()}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0">${anim('stop-color', skyTop)}</stop>
  <stop offset="1">${anim('stop-color', skyBot)}</stop>
</linearGradient>
<clipPath id="worldclip"><rect width="${W}" height="${BED + B}"/></clipPath>`;

  const body = `
<g clip-path="url(#worldclip)">
  <rect width="${W}" height="${Y0}" fill="url(#sky)"/>
  <g opacity="0">${stars.join('')}${anim('opacity', '0;0;0;1;1;0;0')}</g>
  ${orbit(SUN, SUN_P, 0)}
  ${orbit(MOON, MOON_P, -CYCLE / 2)}
  <path d="${hills}" fill="#86b9e6">${anim('fill', hillCol)}</path>
  ${clouds.join('')}
  ${edges.join('')}
  ${surface.join('')}
  ${deco.join('')}
  <path d="${shade.join('')}" fill="#060a24" opacity="0">${anim('opacity', '0;0;0.12;0.45;0.45;0.12;0')}</path>
  ${signs.join('')}
  ${under.join('')}
  ${sparkles.join('')}
  ${bedrock.join('')}
  ${months.join('')}
  ${truck}
</g>
${hud.join('')}
${legend.join('')}`;

  return svg({ w: W, h: H, title: `Contribution world: ${s.total} contributions in the last year`, body, style, defs });
}

function quadLength(p0, p1, p2, steps = 64) {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0];
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1];
    len += Math.hypot(x - prev[0], y - prev[1]);
    prev = [x, y];
  }
  return len;
}
