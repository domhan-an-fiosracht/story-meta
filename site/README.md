# site

The static-site generator: one Astro project that turns any [STRUCTURE.md](../STRUCTURE.md)-shaped universe repo into a themed site. Parsing is shared; a universe's look is one tokens-only CSS file in [`public/themes/`](public/themes/).

## Build

```sh
cd site
npm install
STORY_PATH=/path/to/universe-repo THEME=shipfall npm run build   # output in dist/
STORY_PATH=/path/to/universe-repo THEME=shipfall npm run dev     # local preview
```

`STORY_PATH` points at a checkout of the universe repo (the prebuild script symlinks it to `story-content/`). `THEME` names a file in `public/themes/`; omit for the quiet default.

## Routes

| Repo path | Route |
|---|---|
| `README.md` | `/` |
| `meta/README.md` | `/meta/` |
| `meta/<topic>.md` | `/<topic>/` |
| `meta/characters/<slug>.md` | `/characters/<slug>/` (README → `/characters/`) |
| `meta/places/<slug>.md` | `/places/<slug>/` (README → `/places/`) |
| `story/NN-<slug>/README.md` | `/stories/<slug>/` |
| `story/NN-<slug>/chapter-NN.md` | `/stories/<slug>/chapter-NN/` |
| `story/NN-<slug>/YYYY/<scene>.md` | `/stories/<slug>/YYYY-<scene>/` |

Relative `.md` links in the repo (anchors included) are rewritten to these routes at build time, so the meta's own hyperlinks just work.

## Deploying a private universe repo

This repo is public; the universe repos stay private. Two patterns, neither needs a long-lived token:

- **Cloudflare Pages, Git integration** — connect Pages to the private universe repo (its GitHub App handles auth). Build command: `git clone --depth 1 https://github.com/domhan-an-fiosracht/story-meta && cd story-meta/site && npm ci && STORY_PATH=$CF_PAGES_BUILD_DIR THEME=<theme> npm run build`, output `story-meta/site/dist`.
- **GitHub Actions in the universe repo** — checkout self (automatic `GITHUB_TOKEN`), checkout this public repo beside it, build, deploy with wrangler (one Cloudflare API token as a repo/org secret).

## Adding a universe theme

Copy `public/themes/default.css`, override the `:root` tokens (both color schemes), name it after the universe, build with `THEME=<name>`.
