// Fetches everything the arcade draws from in one GraphQL query, and turns it
// into the numbers the scenes use. With --fixture it uses made-up data, so the
// scenes can be drawn without a token.

import { rng } from './pixel.mjs';

const QUERY = `query($login: String!) {
  user(login: $login) {
    login
    name
    createdAt
    followers { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date weekday contributionCount contributionLevel }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        name
        description
        createdAt
        pushedAt
        stargazerCount
        forkCount
        issues(states: OPEN) { totalCount }
        primaryLanguage { name color }
        languages(first: 20, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } }
        defaultBranchRef { target { ... on Commit { history { totalCount } } } }
      }
    }
  }
}`;

const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

export async function fetchUser(login, token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'arcade-profile' },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(`GitHub answered with errors: ${JSON.stringify(json.errors)}`);
  return json.data.user;
}

/** Numbers the scenes draw from. `today` is the day the pictures are drawn. */
export function summarize(user, { today = new Date() } = {}) {
  const cal = user.contributionsCollection.contributionCalendar;
  const weeks = cal.weeks.map((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      weekday: d.weekday,
      count: d.contributionCount,
      level: LEVELS[d.contributionLevel] ?? 0,
    })),
  );
  const days = weeks.flat();

  let longestStreak = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }
  // Today not being played yet doesn't end the streak.
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) currentStreak++;
    else if (i === days.length - 1) continue;
    else break;
  }
  const busiest = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);

  const repos = user.repositories.nodes
    .filter((r) => r.name.toLowerCase() !== user.login.toLowerCase())
    .map((r) => ({
      name: r.name,
      description: r.description ?? '',
      createdAt: r.createdAt,
      pushedAt: r.pushedAt,
      stars: r.stargazerCount,
      forks: r.forkCount,
      issues: r.issues?.totalCount ?? 0,
      language: r.primaryLanguage,
      languages: r.languages.edges.map((e) => ({ name: e.node.name, color: e.node.color ?? '#8a8f99', size: e.size })),
      commits: r.defaultBranchRef?.target?.history?.totalCount ?? 0,
    }));

  const langBytes = new Map();
  for (const repo of repos) {
    for (const l of repo.languages) {
      const cur = langBytes.get(l.name) ?? { name: l.name, color: l.color, size: 0 };
      cur.size += l.size;
      langBytes.set(l.name, cur);
    }
  }
  const languages = [...langBytes.values()].sort((a, b) => b.size - a.size);

  const total = cal.totalContributions;

  return {
    login: user.login,
    name: user.name || user.login,
    createdAt: user.createdAt,
    followers: user.followers.totalCount,
    today: today.toISOString().slice(0, 10),
    weeks,
    days,
    total,
    activeDays: days.filter((d) => d.count > 0).length,
    longestStreak,
    currentStreak,
    busiest,
    repos,
    stars: repos.reduce((n, r) => n + r.stars, 0),
    forks: repos.reduce((n, r) => n + r.forks, 0),
    commits: repos.reduce((n, r) => n + r.commits, 0),
    languages,
  };
}

/**
 * Made-up data shaped like the real thing: a quiet year that gets busy at the
 * end, the way this account's year looks. Only for drawing without a token.
 */
export function fixtureUser(today = new Date('2026-10-08T12:00:00Z')) {
  const rand = rng(7);
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - end.getUTCDay() - 52 * 7);
  const busyFrom = new Date('2026-08-20T00:00:00Z');
  const weeks = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    if (d.getUTCDay() === 0) weeks.push({ contributionDays: [] });
    let count = 0;
    if (d >= busyFrom) count = rand() < 0.15 ? 0 : Math.floor(rand() * rand() * 70) + 1;
    else if (rand() < 0.04) count = Math.floor(rand() * 4) + 1;
    weeks.at(-1).contributionDays.push({ date: d.toISOString().slice(0, 10), weekday: d.getUTCDay(), contributionCount: count });
  }
  const all = weeks.flatMap((w) => w.contributionDays).map((d) => d.contributionCount).filter((n) => n > 0).sort((a, b) => a - b);
  const q = (p) => all[Math.floor(p * (all.length - 1))] ?? 1;
  for (const d of weeks.flatMap((w) => w.contributionDays)) {
    const n = d.contributionCount;
    d.contributionLevel = n === 0 ? 'NONE' : n <= q(0.25) ? 'FIRST_QUARTILE' : n <= q(0.5) ? 'SECOND_QUARTILE' : n <= q(0.75) ? 'THIRD_QUARTILE' : 'FOURTH_QUARTILE';
  }
  const lang = (name, color, size) => ({ size, node: { name, color } });
  return {
    login: 'Bertrram',
    name: null,
    createdAt: '2023-11-03T17:37:49Z',
    followers: { totalCount: 1 },
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: weeks.flatMap((w) => w.contributionDays).reduce((n, d) => n + d.contributionCount, 0),
        weeks,
      },
    },
    repositories: {
      nodes: [
        {
          name: 'omoio', description: 'A game library for Windows', createdAt: '2026-08-30T18:18:03Z', pushedAt: '2026-10-08T19:16:09Z',
          stargazerCount: 13, forkCount: 1, issues: { totalCount: 4 }, primaryLanguage: { name: 'Rust', color: '#dea584' },
          languages: { edges: [lang('Rust', '#dea584', 910000), lang('TypeScript', '#3178c6', 320000), lang('CSS', '#663399', 84000), lang('HTML', '#e34c26', 9000)] },
          defaultBranchRef: { target: { history: { totalCount: 612 } } },
        },
        {
          name: 'recode', description: 'Convert images from the Explorer menu', createdAt: '2026-08-26T19:02:10Z', pushedAt: '2026-08-27T05:32:19Z',
          stargazerCount: 2, forkCount: 0, issues: { totalCount: 0 }, primaryLanguage: { name: 'C#', color: '#178600' },
          languages: { edges: [lang('C#', '#178600', 126000), lang('PowerShell', '#012456', 4000)] },
          defaultBranchRef: { target: { history: { totalCount: 38 } } },
        },
        {
          name: 'omoio-portraits', description: 'Reads figure pictures', createdAt: '2026-09-28T12:39:07Z', pushedAt: '2026-10-08T19:16:59Z',
          stargazerCount: 0, forkCount: 0, issues: { totalCount: 0 }, primaryLanguage: { name: 'Rust', color: '#dea584' },
          languages: { edges: [lang('Rust', '#dea584', 61000)] },
          defaultBranchRef: { target: { history: { totalCount: 27 } } },
        },
      ],
    },
  };
}
