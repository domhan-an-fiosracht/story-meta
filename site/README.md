# site

The static-site generator: one Astro project that turns any [STRUCTURE.md](../STRUCTURE.md)-shaped universe repo into a themed site. Parsing is shared; a universe's look is one tokens-only CSS file that lives **in the universe repo** as `theme.css` at its root.

## Build

```sh
cd site
npm install
STORY_PATH=/path/to/universe-repo npm run build   # output in dist/
STORY_PATH=/path/to/universe-repo npm run dev     # local preview
```

`STORY_PATH` points at a checkout of the universe repo (the prebuild script symlinks it to `story-content/` and copies its `theme.css`, if any, to `public/themes/repo.css`). Theme precedence: a `THEME=<name>` env naming a file in `public/themes/` > the repo's own `theme.css` > the quiet default.

## Routes

| Repo path | Route |
|---|---|
| `README.md` | `/` |
| `meta/README.md` | `/meta/` |
| `meta/<topic>.md` | `/<topic>/` (`universe`, `timeline`, `calendar` and `threads` also get a nav link when present) |
| `meta/characters/<slug>.md` | `/characters/<slug>/` (README → `/characters/`, rendered as the roster: see [STRUCTURE.md](../STRUCTURE.md#character-roster)) |
| `meta/places/<slug>.md` | `/places/<slug>/` (README → `/places/`) |
| `story/NN-<slug>/README.md` | `/stories/<slug>/` |
| `story/NN-<slug>/chapter-NN.md` | `/stories/<slug>/chapter-NN/` |
| `story/NN-<slug>/YYYY/[YYYY-MM-DD/]<scene>.md` | `/stories/<slug>/<scene>/` |
| a scene story's year | `/stories/<slug>/YYYY/` |
| `meta/calendar.md` | `/calendar/` and `/calendar/YYYY/` |

Relative `.md` links in the repo (anchors included) are rewritten to these routes at build time, so the meta's own hyperlinks just work.

## Deploying a private universe repo

This repo is public; the universe repos stay private. Two patterns, neither needs a long-lived token:

- **Cloudflare Workers/Pages, Git integration** — connect Cloudflare to the private universe repo (its GitHub App handles auth). The universe repo keeps a thin `package.json` whose `build` script clones this public repo, runs `npm ci` in `site/`, and builds with `STORY_PATH` pointing back at itself; plus a `wrangler.jsonc` serving the built `dist/` as static assets.
- **GitHub Actions in the universe repo** — checkout self (automatic `GITHUB_TOKEN`), checkout this public repo beside it, build, deploy with wrangler (one Cloudflare API token as a repo/org secret).

## Adding a universe theme

Copy `public/themes/default.css` into the universe repo as `theme.css` at its root and override the `:root` tokens (both color schemes). The build picks it up automatically. Themes stay in their universe repos — this public repo carries only the default.
