// Hand-drawn sprites. Each is rows of characters and a palette; '.' is clear.

export const TRUCK_BODY = [
  '...............OOOOOK...',
  '...............OWWWOK...',
  '...............OWWWOK...',
  '...............OWWWOOOO.',
  '..BBBBBBBBBBBB.OOOOOOOOL',
  '..BOOOOOOOOOOBDOOOOOOOOO',
  '..BOOOOOOOOOOBDOOOOOOOOD',
  '.DDDDDDDDDDDDDDDDDDDDDDD',
];
export const TRUCK_P = {
  O: '#f08a2c', B: '#b8561a', D: '#3a2a22', K: '#1b1b1f', W: '#a8dcff', L: '#fff1a6',
};
// Two frames for each wheel, swapped quickly so the wheels look like they spin.
export const WHEEL_A = ['.KKKK.', 'KKRRKK', 'KRGGRK', 'KRGGRK', 'KKRRKK', '.KKKK.'];
export const WHEEL_B = ['.KKKK.', 'KRKKRK', 'KKGGKK', 'KKGGKK', 'KRKKRK', '.KKKK.'];
export const WHEEL_P = { K: '#16161a', R: '#8a8f99', G: '#d7dbe2' };

export const ICON_OMOIO = [
  '..UUUUUUUUUUUU..',
  '.UUUUUUUUUUUUUU.',
  'UUUUUUUUUUUUUUUU',
  'UUUWUWWWWWWWWUUU',
  'UUUWUWWWWWWWWUUU',
  'UUUWUWWUWWWWWUUU',
  'UUUWUWWUUWWWWUUU',
  'UUUWUWWUUUWWUUUU',
  'UUUWUWWUUUWWUUUU',
  'UUUWUWWUUWWWWUUU',
  'UUUWUWWUWWWWWUUU',
  'UUUWUWWWWWWWWUUU',
  'UUUWUWWWWWWWWUUU',
  'UUUUUUUUUUUUUUUU',
  '.uUUUUUUUUUUUUu.',
  '..uuuuuuuuuuuu..',
];
export const ICON_OMOIO_P = { U: '#126BFC', u: '#0b4fc0', W: '#ffffff' };

export const ICON_RECODE = [
  '................',
  'FFFFFFFFFFFF....',
  'FKKKKKKKKKKF....',
  'FKKKKKKYYKKF....',
  'FKKKKKKYYKKF....',
  'FKKKMKKKKKKF....',
  'FKKMMMKKKKKFAA..',
  'FKMMMMMKMKKF.AA.',
  'FMMmMMMMMMMF..AA',
  'FMmmMMMmMMMF..AA',
  'FFFFFFFFFFFF..AA',
  '.............AA.',
  '..........AAAA..',
  '.........AAA....',
  '..........A.....',
  '................',
];
export const ICON_RECODE_P = {
  F: '#e8ecf4', K: '#7ec8ff', M: '#3e9b4f', m: '#2b6e38', Y: '#ffd84a', A: '#ff8a3d',
};

export const ICON_PORTAL = [
  '................',
  '......RRRR......',
  '....RRDDDDRR....',
  '...RDDggggDDR...',
  '..RDggGGGGggDR..',
  '..RDgGGWWGGgDR..',
  '.RDgGGWWWWGGgDR.',
  '.RDgGWWWWWWGgDR.',
  '.RDgGWWWWWWGgDR.',
  '.RDgGGWWWWGGgDR.',
  '..RDgGGWWGGgDR..',
  '..RDggGGGGggDR..',
  '...RDDggggDDR...',
  '....RRDDDDRR....',
  '......RRRR......',
  '................',
];
export const ICON_PORTAL_P = { R: '#6b5bd6', D: '#2b2050', g: '#2fd0e0', G: '#7ff8ee', W: '#ffffff' };

export const ICON_FLOPPY = [
  'BBBBBBBBBBBBBB..',
  'BBBSSSSSSSSBBBB.',
  'BBBSSSSSDDSBBBBB',
  'BBBSSSSSDDSBBBBB',
  'BBBSSSSSDDSBBBBB',
  'BBBSSSSSSSSBBBBB',
  'BBBBBBBBBBBBBBBB',
  'BBBBBBBBBBBBBBBB',
  'BBLLLLLLLLLLLLBB',
  'BBLLLLLLLLLLLLBB',
  'BBLDDDDDDDDDDLBB',
  'BBLLLLLLLLLLLLBB',
  'BBLDDDDDDDLLLLBB',
  'BBLLLLLLLLLLLLBB',
  'BBLLLLLLLLLLLLBB',
  'DDDDDDDDDDDDDDDD',
];
export const ICON_FLOPPY_P = { B: '#3d5aa6', S: '#c9d1e0', D: '#22325e', L: '#f4f4f4' };

export const ICONS = {
  omoio: [ICON_OMOIO, ICON_OMOIO_P],
  recode: [ICON_RECODE, ICON_RECODE_P],
  portal: [ICON_PORTAL, ICON_PORTAL_P],
  floppy: [ICON_FLOPPY, ICON_FLOPPY_P],
};

export const CLOUD = [
  '....WWWW........',
  '..WWWWWWWW.WWW..',
  '.WWWWWWWWWWWWWW.',
  'WWWWWWWWWWWWWWWW',
  'SWWWWWWWWWWWWWWS',
  '.SSSSSSSSSSSSSS.',
];
export const CLOUD_P = { W: '#ffffff', S: '#d6e4f5' };

export const SUN = [
  '..YYYY..',
  '.YYYYYY.',
  'YYYWYYYY',
  'YYWYYYYY',
  'YYYYYYYY',
  'YYYYYYYY',
  '.YYYYYY.',
  '..YYYY..',
];
export const SUN_P = { Y: '#ffd84a', W: '#fff6c4' };

export const MOON = [
  '..MMMM..',
  '.MMMMc..',
  'MMMMc...',
  'MMMc....',
  'MMMc....',
  'MMMMc...',
  '.MMMMc..',
  '..MMMM..',
];
export const MOON_P = { M: '#f2f0d8', c: '#c9c6aa' };

export const TUFT = ['.G...G..', '.GG.GG.G', 'GGGGGGGG'];
export const FLOWER_RED = ['..R.....', '.RYR....', '..R...G.', '..G..GG.'];
export const FLOWER_YELLOW = ['.....Y..', '....YWY.', '.G...Y..', '.GG..G..'];
export const PLANT_P = { G: '#4a9e2f', R: '#ff4d6d', Y: '#ffd84a', W: '#fff6c4' };

export const FLAG = [
  'PRRRRR',
  'PRRRRR',
  'PRRRR.',
  'PR....',
  'P.....',
  'P.....',
  'P.....',
  'P.....',
];
export const FLAG_P = { P: '#d7dbe2', R: '#ff4d6d' };

export const LINKEDIN = [
  'BBBBBBBBBB',
  'BWWBBBBBBB',
  'BWWBBBBBBB',
  'BBBBBBBBBB',
  'BWWBWWWWBB',
  'BWWBWWWWWB',
  'BWWBWWBWWB',
  'BWWBWWBWWB',
  'BWWBWWBWWB',
  'BBBBBBBBBB',
];
export const LINKEDIN_P = { B: '#0a66c2', W: '#ffffff' };

export const CHAT = [
  '.BBBBBBBB.',
  'BBBBBBBBBB',
  'BBWBBWBBWB',
  'BBBBBBBBBB',
  '.BBBBBBBB.',
  '...BB.....',
  '..B.......',
];
export const CHAT_P = { B: '#5865f2', W: '#ffffff' };

