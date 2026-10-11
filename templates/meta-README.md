# <Story> — meta

Reference material for maintaining consistency across the story. Structure follows the [story-meta](https://github.com/domhan-an-fiosracht/story-meta) conventions.

<Current-state line: where the manuscript stands — chapter in progress, its last scene.>

## Map

| | |
|---|---|
| [universe.md](universe.md) | Setting, factions, systems, glossary |
| [timeline.md](timeline.md) | Chapter-by-chapter event spine |
| [voice.md](voice.md) | What the book sounds like, and its known failure modes |
| [threads.md](threads.md) | Open threads, promises to the reader, Chekhov inventory |
| [characters/](characters/README.md) | Full roster |
| [places/](places/README.md) | Index of places |

## Conventions

- **(ch N)** marks where a fact was established.
- **[implied]** / **[unconfirmed]** marks what the text points at but never states.
- A fact lives in one file; everything else links to it.
- Character/place/lore pages carry YAML frontmatter (`name`, `type`, `aka`, optional `group`).

## Maintenance

When a chapter lands: update touched dossiers and places; move resolved threads (struck through, with resolution) out of threads.md; extend timeline.md; update this README's current-state line.
