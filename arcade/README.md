# arcade

Draws the pictures on my profile. A GitHub Action runs it every six hours,
asks GitHub for my contributions and repos, and publishes the SVGs to the
`arcade-output` branch, which the profile README shows.

There are no dependencies. Everything is drawn as rectangles: the text uses
the 5x7 font in `lib/font.mjs`, and the sprites and block textures are rows
of characters in `lib/sprites.mjs` and `lib/blocks.mjs`.

```sh
node arcade/render.mjs --out dist --fixture   # made-up data, no token needed
GITHUB_TOKEN=... node arcade/render.mjs --out dist
```

What the profile says about me is in `config.mjs`.

| Picture | Drawn from |
| --- | --- |
| `title.svg` | the name and tagline in `config.mjs` |
| `stats.svg` | contributions, longest streak, busiest day and stars in the last year, and bytes of each language across my repos |
| `projects/*.svg` | each repo's stars, forks, open issues, commits, last push and main language |
| `world.svg` | the contribution calendar: hills are weeks, ore underground is days |
