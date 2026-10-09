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

// The latest release as a small blue tag next to the name.
function releaseBadge(tag, x, y) {
  if (!tag) return [];
  const w = textWidth(tag, 2) + 16;
  return [rect(x, y, w, 22, '#126BFC'), text(tag, x + 8, y + 4, 2, '#ffffff')];
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
    // The name, its release tag and the counts share a row. A long name drops
    // to a smaller size, and the tag is left out if it still doesn't fit.
    const room = W - 28 - textWidth(right, 2) - 16 - tx;
    const badgeW = repo.release ? textWidth(repo.release, 2) + 30 : 0;
    const roomy = textWidth(repo.name, 3) + badgeW <= room;
    const nameScale = roomy ? 3 : 2;
    const release = textWidth(repo.name, nameScale) + badgeW <= room ? repo.release : null;
    const parts = [
      panel(0, 0, W, H, { fill: '#0b1226', border: '#1f2b4d', light: '#2a3a66', px: 3 }),
      rect(24, 24, 72, 72, '#111a35'),
      sprite(icon, pal, 28, 28, 4),
      text(repo.name, tx, roomy ? 20 : 24, nameScale, '#ffffff'),
      ...releaseBadge(release, tx + textWidth(repo.name, nameScale) + 14, 20),
      text(right, W - 28, 24, 2, '#c9d3ee', { anchor: 'end' }),
      ...blurb.map((line, i) => text(line, tx, 56 + i * 20, 2, '#c9d3ee')),
    ];
    let mx = tx;
    if (repo.language) {
      parts.push(rect(mx, 102, 10, 10, repo.language.color ?? '#8a8f99'));
      mx += 18;
    }
    parts.push(text(meta, mx, 101, 2, '#8f9bbf'));

    out[`projects/${repo.name}.svg`] = svg({
      w: W, h: H,
      title: `${repo.name}: ${project.blurb || repo.description}. ${repo.stars} stars, ${repo.commits} commits.`,
      body: parts.join(''),
    });
  }
  return out;
}
