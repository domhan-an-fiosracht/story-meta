# Story meta structure

The layout every universe repo follows: its stories and its `meta/` folders. The goal is a folder that reads well on GitHub *and* parses mechanically for the static-site generator: predictable paths, frontmatter on content pages, links everywhere.

Reference implementation: [shipfall/meta](https://github.com/domhan-an-fiosracht/shipfall/tree/main/meta).

## Layout

```
<universe-repo>/
  story/
    NN-<story-slug>/         # one folder per story; NN = reading order
      chapter-01.md …        # the chapters themselves
      meta/                  # optional; only what this story needs to narrow
  meta/
    README.md                # index: map of everything + conventions + current-state line
    universe.md              # setting, factions, systems, glossary
    timeline.md              # chapter-by-chapter event spine
    voice.md                 # style guide + known failure modes
    threads.md               # open threads / Chekhov inventory
    <topic>.md               # optional standalone lore specs (e.g. a writing system)
    characters/
      README.md              # full roster, every named character, linked
      <name>.md              # one file per substantial character
      <group>.md             # group pages: short, connective, link members
      supporting.md          # texture cast, one linkable heading per person
    places/
      README.md              # index of places
      <place>.md             # one file per place (or tight cluster)
```

## Routing rules

- **Stories live in `story/NN-<story-slug>/`.** The number prefix sets reading order, so renumbering is a rename. A universe with one story still gets a folder (`story/01-huntress/`).
- **Universe `meta/` is the default; a story's `meta/` narrows it.** Same file names and layout, but a file only exists there when that story needs to say something more specific — its own `voice.md`, `timeline.md`, or `threads.md`. Never copy a universe file down; the one-file rule spans both levels.
- **People live in `characters/`, places in `places/`** — a place file links to its residents, never hosts them. (A settlement can have both: `places/reedsport.md` and `characters/reedsport.md`; folder-scoped routes keep slugs distinct.)
- **Substantial character → own file.** Texture character → a `###` heading in `supporting.md` or a group file, so it's still linkable.
- **Group pages** (a family, a pair) stay short: a line of context and links to the member files. `characters/README.md` lists *every* named character and links through the groups.
- **A fact lives in exactly one file**; everything else links to it. When content outgrows its host (a writing system, a language), promote it to a top-level `<topic>.md` and leave links behind.
- `README.md` files are indexes, not content.

## Frontmatter

Every content page in `characters/`, `places/`, and top-level lore specs opens with:

```yaml
---
name: Muninn            # display name
type: character         # character | place | group | lore
aka: [Alyssa, the quartermaster]
group: ravens           # optional; slug of the group page
---
```

Keep it minimal — the generator themes on `type`, titles on `name`, and builds alias lookups from `aka`. Add keys only when the generator actually consumes them.

## Content conventions

- **(ch N)** after a fact marks where it was established. Facts without citations are suspect.
- **[implied]** / **[unconfirmed]** marks what the text points at but never states — never silently promoted to canon.
- **Short lines.** One fact per bullet; a bullet that needs three em-dashes is three bullets. Long portraits get `##`/`###` sections (Vitals / Voice / History / Arc / Open).
- **Resolved threads** are struck through in `threads.md` (`~~thread~~ — **resolved (ch N):** …`) with a link to where the resolution now lives. The strikethrough is the changelog.
- **Hyperlinks over repetition**: relative links, including `#heading` anchors into group files.
- Quote the manuscript sparingly — short fragments as voice anchors, not paragraphs.
- Spoiler policy: meta is written for the author; it spoils everything it knows. The generator decides what's public.

## Maintenance loop

When a chapter lands:

1. Update touched character/place files; cite the chapter.
2. Move resolved threads out of `threads.md`; add new ones.
3. Extend `timeline.md`; update `README.md`'s current-state line.
4. New named character → roster entry in `characters/README.md`, plus a file or heading.
5. `voice.md` only changes when the book's voice does — drift goes in its failure-modes list instead.
