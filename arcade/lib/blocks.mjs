// 8x8 block textures, drawn at 2px a pixel so a block is 16px. They are put
// in <defs> once and placed with <use>, which keeps the world small.

import { sprite } from './pixel.mjs';

export const BLOCK = 16;
const T = 2;

const C = {
  grass1: '#6cc644', grass2: '#4a9e2f', grass3: '#357a22',
  dirt1: '#9b6a3f', dirt2: '#7c5231', dirt3: '#5f3d24',
  stone1: '#9a9ea6', stone2: '#7d8189', stone3: '#5f636b',
  bed1: '#3b3b42', bed2: '#25252b', bed3: '#56565e',
  snow1: '#f4f8ff', snow2: '#d9e4f3', snow3: '#b6c6dd',
  log1: '#6e4b2a', log2: '#523720', log3: '#8a6238',
  leaf1: '#3f9b36', leaf2: '#2c7428', leaf3: '#5cbf4a',
  fog1: '#0c0f16', fog2: '#141924',
};

const GRASS = [
  'AABAAABA',
  'BABBABBB',
  'BCBDBBCD',
  'DDEDDDDE',
  'DEDDDEDD',
  'DDDFDDED',
  'EDDDDDFD',
  'DDEDDDDD',
];
const DIRT = [
  'DDEDDDFD',
  'EDDDEDDD',
  'DDDFDDED',
  'DFDDDDDD',
  'DDDEDFDD',
  'EDDDDDDE',
  'DDFDEDDD',
  'DEDDDDFD',
];
const STONE = [
  'AAABAAAA',
  'ABAAAACA',
  'AAAACAAA',
  'CAAAAABA',
  'AABAAAAA',
  'AAAAABAA',
  'ACAAAAAC',
  'AAABAAAA',
];
const ORE = [
  'AAABAAAA',
  'AXXAAACA',
  'AXYAAAAA',
  'CAAAAXXA',
  'AABAAXYA',
  'AAXXAAAA',
  'ACXYAAAC',
  'AAABAAAA',
];
const BEDROCK = [
  'ABACAABA',
  'CAABACAA',
  'AACAABAC',
  'BAAACAAB',
  'ACABAACA',
  'AABACAAB',
  'CAAABACA',
  'ABCAAAAB',
];
const SNOW_TOP = [
  'AAAAAAAA',
  'AAABAAAA',
  'ABAAAABA',
  'AAAAAAAA',
  'BABAABAB',
  'CBBCBBCB',
  'BCCBCBBC',
  'CCBCCCBC',
];
const SNOW = [
  'BCBBCBBC',
  'CBCBBCBB',
  'BBCBCBCB',
  'CBBCBBBC',
  'BCBBCBCB',
  'BBCBBCBB',
  'CBBCBBCB',
  'BCBBCBBC',
];
const LOG = [
  'ABCBABCA',
  'ABCBABCA',
  'BBCBABBA',
  'ABCAABCA',
  'ABCBABCB',
  'ABBBABCA',
  'ABCBAACA',
  'ABCBABCA',
];
const LEAVES = [
  'ABACABAA',
  'BAABACBA',
  'ACBAABAC',
  'BAACBAAB',
  'AABAACBA',
  'CBAABAAC',
  'ABACBABA',
  'BAABAACB',
];
const FOG = [
  'AAAAAAAA',
  'AAABAAAA',
  'AAAAAABA',
  'ABAAAAAA',
  'AAAAABAA',
  'AAAAAAAA',
  'AABAAAAB',
  'AAAAAAAA',
];

const GRASS_P = { A: C.grass1, B: C.grass2, C: C.grass3, D: C.dirt1, E: C.dirt2, F: C.dirt3 };
const STONE_P = { A: C.stone2, B: C.stone1, C: C.stone3 };

/** Ore colours by GitHub contribution level, from none to the busiest days. */
export const ORES = [
  { key: 'stone', name: 'Stone', light: null, dark: null },
  { key: 'coal', name: 'Coal', light: '#2a2b30', dark: '#121316' },
  { key: 'iron', name: 'Iron', light: '#e6bfa1', dark: '#b98c6c' },
  { key: 'gold', name: 'Gold', light: '#ffe14d', dark: '#d19c12' },
  { key: 'diamond', name: 'Diamond', light: '#7ff8ee', dark: '#1fb5ad' },
];

function def(id, rows, palette) {
  return `<g id="${id}">${sprite(rows, palette, 0, 0, T)}</g>`;
}

/** All block definitions, ids prefixed with `b-`. */
export function blockDefs() {
  const ores = ORES.map((o) =>
    o.light ? def(`b-${o.key}`, ORE, { ...STONE_P, X: o.light, Y: o.dark }) : def(`b-${o.key}`, STONE, STONE_P),
  );
  return [
    def('b-grass', GRASS, GRASS_P),
    def('b-dirt', DIRT, GRASS_P),
    ...ores,
    def('b-bedrock', BEDROCK, { A: C.bed1, B: C.bed2, C: C.bed3 }),
    def('b-snowtop', SNOW_TOP, { A: C.snow1, B: C.snow2, C: C.snow3 }),
    def('b-snow', SNOW, { A: C.snow1, B: C.snow2, C: C.snow3 }),
    def('b-log', LOG, { A: C.log1, B: C.log2, C: C.log3 }),
    def('b-leaves', LEAVES, { A: C.leaf1, B: C.leaf2, C: C.leaf3 }),
    def('b-fog', FOG, { A: C.fog1, B: C.fog2 }),
  ].join('');
}

export function use(id, x, y, attrs = '') {
  return `<use href="#b-${id}" x="${x}" y="${y}" ${attrs}/>`;
}

/** A single ore drawn inline at any size, for legends. */
export function oreIcon(level, x, y, t = 2) {
  const o = ORES[level];
  return o.light ? sprite(ORE, { ...STONE_P, X: o.light, Y: o.dark }, x, y, t) : sprite(STONE, STONE_P, x, y, t);
}

export function blockIcon(name, x, y, t = 2) {
  const map = {
    grass: [GRASS, GRASS_P],
    dirt: [DIRT, GRASS_P],
    snow: [SNOW_TOP, { A: C.snow1, B: C.snow2, C: C.snow3 }],
    log: [LOG, { A: C.log1, B: C.log2, C: C.log3 }],
    leaves: [LEAVES, { A: C.leaf1, B: C.leaf2, C: C.leaf3 }],
    stone: [STONE, STONE_P],
  };
  const [rows, p] = map[name];
  return sprite(rows, p, x, y, t);
}
