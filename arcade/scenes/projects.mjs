// One card per project, each its own picture so each can be a link.

import { sprite, rect, svg, panel } from '../lib/pixel.mjs';
import { text, textWidth, wrap } from '../lib/font.mjs';
import { ICONS } from '../lib/sprites.mjs';

const W = 880;
const H = 132;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function date(iso) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const count = (n, word) => `${n.toLocaleString('en-US')} ${word}${n === 1 ? '' : 's'}`;

/** Returns { 'projects/<repo>.svg': svg } for every project in the config that exists. */
export function projects(s, cfg) {
  const out = {};
  for (const project of cfg.projects) {
    const repo = s.repos.find((r) => r.name.toLowerCase() === project.repo.toLowerCase());
    if (!repo) continue;
    const [icon, pal] = ICONS[project.icon] ?? ICONS.floppy;
    const tx = 120;
    const blurb = wrap(project.blurb || repo.description || '', W - tx - 28, 2).slice(0, 2);
    const right = `★ ${repo.stars.toLocaleString('en-US')}   ${count(repo.forks, 'fork')}   ${count(repo.issues, 'open issue')}`;
    const meta = [repo.language?.name, count(repo.commits, 'commit'), `updated ${date(repo.pushedAt)}`].filter(Boolean).join('  ·  ');
    const parts = [
      panel(0, 0, W, H, { fill: '#0b1226', border: '#1f2b4d', light: '#2a3a66', px: 3 }),
      rect(24, 24, 72, 72, '#111a35'),
      sprite(icon, pal, 28, 28, 4),
      text(repo.name, tx, 20, 3, '#ffffff'),
      text(right, W - 28, 24, 2, '#c9d3ee', { anchor: 'end' }),
      ...blurb.map((line, i) => text(line, tx, 56 + i * 20, 2, '#c9d3ee')),
    ];
    let mx = tx;
    if (repo.language) {
      parts.push(rect(mx, 102, 10, 10, repo.language.color ?? '#8a8f99'));
      mx += 18;
    }
    parts.push(text(meta, mx, 101, 2, '#8f9bbf'));
    // The name and the counts share a row, so long names give way to the counts.
    if (tx + textWidth(repo.name, 3) > W - 28 - textWidth(right, 2) - 16) {
      parts.splice(4, 1, text(repo.name, tx, 22, 2, '#ffffff'));
    }

    out[`projects/${repo.name}.svg`] = svg({
      w: W, h: H,
      title: `${repo.name}: ${project.blurb || repo.description}. ${repo.stars} stars, ${repo.commits} commits.`,
      body: parts.join(''),
    });
  }
  return out;
}
