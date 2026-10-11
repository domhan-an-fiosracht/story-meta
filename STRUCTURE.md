# Story meta structure

The layout every universe repo follows: its stories and its `meta/` folders. The goal is a repo that reads well on GitHub *and* parses mechanically for the static-site generator: predictable paths, frontmatter where a machine reads it, links everywhere.

## Layout

```
<universe-repo>/
  README.md                  # universe name + index of its stories
  story/
    NN-<story-slug>/         # one folder per story; NN = reading order
      README.md              # story name + current-state line
      chapter-NN.md …        # a chapter story, or…
      YYYY/
        YYYY-MM-DD-NN-<pov>.md …  # …a scene story (see Story files)
      meta/                  # optional; only what this story needs to narrow
  meta/
    README.md                # index: map of everything + conventions
    universe.md              # setting, factions, systems, glossary
    timeline.md              # optional event spine
    voice.md                 # style guide + known failure modes
    threads.md               # open threads / Chekhov inventory
    <topic>.md               # optional standalone lore specs (e.g. a writing system)
    characters/
      README.md              # full roster, every named character, linked
      <slug>.md              # one file per substantial character
      <group>.md             # group pages: short, connective, link members
      supporting.md          # texture cast, one linkable heading per person
    places/
      README.md              # index of places
      <place>.md             # one file per place (or tight cluster)
  drafts/                    # optional; never parsed, never canon
```

## Routing rules

- **Stories live in `story/NN-<story-slug>/`.** The number prefix sets reading order, so renumbering is a rename. A universe with one story still gets a folder (`story/01-huntress/`).
- **Universe `meta/` is the default; a story's `meta/` narrows it.** Same file names and layout, but a file only exists there when that story needs to say something more specific — its own `voice.md`, `timeline.md`, or `threads.md`, or a story-only `<topic>.md` like `beats.md`. Never copy a universe file down; the one-file rule spans both levels.
- **People live in `characters/`, places in `places/`** — a place file links to its residents, never hosts them. (A settlement can have both: `places/reedsport.md` and `characters/reedsport.md`; folder-scoped routes keep slugs distinct.)
- **One slug per character.** It's the name the narration uses (`harper`, not `rebecca-reyes`), with a surname only to break a collision. The same slug names their file, fills a scene's `<pov>`, and appears in `characters:` lists. The slug is only a key: the character's `name` is still their real name.
- **Substantial character → own file.** Texture character → a `###` heading in `supporting.md` or a group file, so it's still linkable.
- **Group pages** (a family, a pair) stay short: a line of context and links to the member files. `characters/README.md` lists *every* named character and links through the groups.
- **A fact lives in exactly one file**; everything else links to it. When content outgrows its host (a writing system, a language), promote it to a top-level `<topic>.md` and leave links behind.
- **`timeline.md` is optional.** Add it when chronology isn't already carried by the story files (scene filenames, date lines), or when stories need to agree on when something happened.
- **Drafts are not canon.** Prior drafts, sketches, planning notes, and outtakes go in `drafts/`, organized however is useful. Nothing there is parsed, cited, or checked for consistency.
- `README.md` files are indexes, not content.
- Workflow docs (how a story gets written) may live at a repo's root, but never redefine this layout. Site configuration belongs to the generator, not the repo.

## Story files

A story is chapters or scenes, never both.

**Chapters** — `chapter-NN.md`, in reading order. No heading in the file: the generator renders "Chapter N" and the title. Optional frontmatter:

```yaml
---
title: The Crossing
---
```

**Scenes** — for stories told by date and point of view: `YYYY/YYYY-MM-DD-NN-<pov>.md`. `NN` orders events within a day; the same date and `NN` under a different `<pov>` is the same event retold. `<pov>` is a character slug, or a short label when no one character holds the scene (`montage`). Date and POV come from the filename and nowhere else. Frontmatter:

```yaml
---
characters: [harper, cassie]   # slugs of everyone on page
title: First Day               # optional
until: 2035-03-17              # optional; last day of a scene spanning several
---
```

**Inside either:** `---` is a scene break. An optional `<!-- scene: slug -->` marker directly after a break (or at the top of the file) names the scene, so it can be addressed for rewrites and anchored by the generator. In-world date lines (*Day three. The last evening with power.*) are prose and stay in the text.

## Frontmatter

Every content page in `characters/`, `places/`, and top-level lore specs opens with:

```yaml
---
name: Alyssa            # real name, never a nickname
type: character         # character | place | group | lore | story
aka: [Muninn, the quartermaster]   # every other name; as many as needed
group: ravens           # optional; slug of the group page
---
```

A story's `README.md` carries `name` and `type: story`.

Keep it minimal — the generator themes on `type`, titles on `name`, and builds alias lookups from `aka`. Add keys only when the generator actually consumes them; descriptive facts (species, role, status) belong in the body.

## Content conventions

- **Citations** mark where a fact was established. Facts without them are suspect.
  - `(ch N)` — chapter N of the story the file belongs to. In universe `meta/`, that's story `01`.
  - `(<story-slug> ch N)` — a chapter of any other story (slug without its number, so renumbering doesn't break it).
  - `(YYYY-MM-DD-NN)` — a scene, prefixed with a story slug the same way.
- **[implied]** / **[unconfirmed]** marks what the text points at but never states — never silently promoted to canon.
- **Short lines.** One fact per bullet; a bullet that needs three em-dashes is three bullets. Long portraits get `##`/`###` sections (Vitals / Voice / History / Arc / Open).
- **Resolved threads** are struck through in `threads.md` (`~~thread~~ — **resolved (ch N):** …`) with a link to where the resolution now lives. The strikethrough is the changelog.
- **Hyperlinks over repetition**: relative links, including `#heading` anchors into group files.
- Quote the manuscript sparingly — short fragments as voice anchors, not paragraphs.
- Spoiler policy: meta is written for the author; it spoils everything it knows. The generator decides what's public.

## Maintenance loop

When a chapter or scene lands:

1. Update touched character/place files; cite it.
2. Move resolved threads out of `threads.md`; add new ones.
3. Extend `timeline.md` if the story keeps one; update the story `README.md`'s current-state line.
4. New named character → roster entry in `characters/README.md`, plus a file or heading.
5. `voice.md` only changes when the book's voice does — drift goes in its failure-modes list instead.
