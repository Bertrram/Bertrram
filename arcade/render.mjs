// Draws every picture on the profile into a folder.
//
//   node arcade/render.mjs --out dist             (needs GITHUB_TOKEN)
//   node arcade/render.mjs --out dist --fixture   (made-up data, no token)

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import config from './config.mjs';
import { fetchUser, fixtureUser, summarize } from './lib/data.mjs';
import { world } from './scenes/world.mjs';
import { title } from './scenes/title.mjs';
import { stats } from './scenes/stats.mjs';
import { projects } from './scenes/projects.mjs';
import { nowPlaying } from './scenes/nowplaying.mjs';
import { buttons } from './scenes/buttons.mjs';

const args = process.argv.slice(2);
const out = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'dist';
const fixture = args.includes('--fixture');

let user;
if (fixture) {
  user = fixtureUser();
} else {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('Set GITHUB_TOKEN, or pass --fixture to draw with made-up data.');
  user = await fetchUser(config.login, token);
}
const today = fixture ? new Date('2026-10-08T12:00:00Z') : new Date();
const s = summarize(user, { today });

const files = {
  'title.svg': title(config),
  ...buttons(config),
  'stats.svg': stats(s),
  ...projects(s, config),
  'world.svg': world(s),
  'now-playing.svg': nowPlaying(s, config),
};

await mkdir(out, { recursive: true });
for (const [name, content] of Object.entries(files)) {
  const path = join(out, name);
  await mkdir(join(path, '..'), { recursive: true });
  await writeFile(path, content);
  console.log(`${path}  ${(content.length / 1024).toFixed(1)} KB`);
}
