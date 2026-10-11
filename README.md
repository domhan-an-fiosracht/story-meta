# story-meta

Structure rules and templates for story repos, so every story's `meta/` folder parses the same way — and a future static-site generator can turn any story repo into a themed site by swapping CSS, not parsers.

- **[STRUCTURE.md](STRUCTURE.md)** — the layout, routing rules, frontmatter schema, and content conventions.
- **[templates/](templates/)** — starting files for a new story's `meta/` folder.

## Status

- Current file style: `story/chapter-NN.md` + `meta/` per STRUCTURE.md.
- Reference implementation: [shipfall](https://github.com/domhan-an-fiosracht/shipfall/tree/main/meta).
- [herman](https://github.com/domhan-an-fiosracht/herman) is the site-generator effort; it predates the chapter file style and needs updating to this spec.
