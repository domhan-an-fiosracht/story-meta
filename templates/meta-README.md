# <Universe> — meta

Reference material for keeping every story in this universe consistent. Structure follows the [story-meta](https://github.com/domhan-an-fiosracht/story-meta) conventions.

## Map

| | |
|---|---|
| [universe.md](universe.md) | Setting, factions, systems, glossary |
| [timeline.md](timeline.md) | Event spine (delete this row if there's no timeline) |
| [voice.md](voice.md) | What the books sound like, and their known failure modes |
| [threads.md](threads.md) | Open threads, promises to the reader, Chekhov inventory |
| [characters/](characters/README.md) | Full roster |
| [places/](places/README.md) | Index of places |

## Conventions

- **(ch N)** cites story 01; **(<story-slug> ch N)** cites any other story; **(YYYY-MM-DD-NN)** cites a scene.
- **[implied]** / **[unconfirmed]** marks what the text points at but never states.
- A fact lives in one file; everything else links to it.
- Character/place/lore pages carry YAML frontmatter (`name`, `type`, `aka`, optional `group`).

## Maintenance

When a chapter or scene lands: update touched dossiers and places; move resolved threads (struck through, with resolution) out of threads.md; extend timeline.md if there is one; update the story README's current-state line.
