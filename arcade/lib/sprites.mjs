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

export const PLAYER = [
  '......bbbb......',
  '....bbBBBBbb....',
  '...bBBBBBBBBb...',
  '..bBBLLLLLLBBb..',
  '.gbBddddddddBbg.',
  '.GbBddddddddBbG.',
  '.GbBdWEddWEdBbG.',
  '.gbBddddddddBbg.',
  '..bBdddMMdddBb..',
  '..bBBddddddBBb..',
  '...bBBBBBBBBb...',
  '..bBBBBLLBBBBb..',
  '.bBBBBBLLBBBBBb.',
  '.bBBBBBBBBBBBBb.',
  '.bBbCCCCCCCCbBb.',
  '.bBbCcCCCCyCbBb.',
  '.bBBbCCCCCCbBBb.',
  '..bBBBBBBBBBBb..',
  '..bbbbbbbbbbbb..',
  '...PPPPPPPPPP...',
  '...PPPPppPPPP...',
  '...PPPP..PPPP...',
  '..KKKKK..KKKKK..',
  '..kkkkk..kkkkk..',
];
export const PLAYER_P = {
  b: '#0b4fc0', B: '#126BFC', L: '#8fb8ff', d: '#16213f', W: '#ffffff', E: '#16213f',
  M: '#3c5590', g: '#5d6270', G: '#2a2d36', C: '#2c303c', c: '#ff5a5a', y: '#ffd84a',
  P: '#2b2f45', p: '#1d2033', K: '#14151c', k: '#d8dbe6',
};

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

export const TROPHY = [
  '.YYYYYYYYYY.',
  'YYWYYYYYYyYY',
  'Y.YWYYYYyY.Y',
  'Y.YWYYYYyY.Y',
  '.YYYYYYYyYY.',
  '...YYYYyY...',
  '....YYyY....',
  '.....Yy.....',
  '.....Yy.....',
  '....YYYy....',
  '...yyyyyy...',
  '...yyyyyy...',
];
export const TROPHY_GOLD = { Y: '#ffd84a', y: '#c99a1b', W: '#fff6c4' };
export const TROPHY_LOCKED = { Y: '#3a4361', y: '#2a3049', W: '#4a5578' };

export const LOCK = [
  '..###..',
  '.#...#.',
  '.#...#.',
  '#######',
  '###.###',
  '###.###',
  '#######',
];

export const HEART = [
  '.RR.RR.',
  'RWRRRRR',
  'RRRRRRR',
  '.RRRRR.',
  '..RRR..',
  '...R...',
];
export const HEART_P = { R: '#ff4d6d', W: '#ffd1da' };

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

export const PAD = [
  '..CCCCCCCC..',
  '.CCCCCCCCCC.',
  'CCDCCCCCCRCC',
  'CDDDCCCCYCGC',
  'CCDCCCCCCBCC',
  'CCCCCCCCCCCC',
  'CCC......CCC',
  '.C........C.',
];
export const PAD_P = { C: '#d7dbe2', D: '#2c303c', R: '#ff5a5a', Y: '#ffd84a', G: '#4ade80', B: '#5aa9ff' };
