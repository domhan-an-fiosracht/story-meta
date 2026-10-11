# story-meta

Structure rules and templates for universe repos, so every story and `meta/` folder parses the same way — and a future static-site generator can turn any universe repo into a themed site by swapping CSS, not parsers.

- **[STRUCTURE.md](STRUCTURE.md)** — the layout, routing rules, frontmatter schema, and content conventions.
- **[templates/](templates/)** — starting files for a new universe repo, story, and `meta/` folder.
- **[STORIES.md](STORIES.md)** — index of every story repo.

## Status

- Current file style: `story/NN-<story-slug>/chapter-NN.md` + `meta/` per STRUCTURE.md.
- Reference implementation: [shipfall](https://github.com/domhan-an-fiosracht/shipfall/tree/main/meta).
- [herman](https://github.com/domhan-an-fiosracht/herman) is the site-generator effort; it predates the chapter file style and needs updating to this spec.
