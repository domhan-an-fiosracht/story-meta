# Stories

Every story repo under [domhan-an-fiosracht](https://github.com/domhan-an-fiosracht).

- **Description** is the GitHub repo description, verbatim.
- **Universe** comes from the repo's own docs until the `universe` custom property is filled in. Right now it reads `HELP!` on every repo.
- **Layout** is measured against [STRUCTURE.md](STRUCTURE.md). *Current* means `story/chapter-NN.md` + `meta/`.

| Story | Repo | Description | Universe | Layout |
|---|---|---|---|---|
| Act Normal | [act-normal](https://github.com/domhan-an-fiosracht/act-normal) | Story: Women save the world, again | — | Legacy: drafts + bible in `emilyellis/` |
| Huntress | [shipfall](https://github.com/domhan-an-fiosracht/shipfall) | The Huntress, the Alien, and the Wolf | Shipfall | Current (reference implementation) |
| Strip Searched the Dog | [strip-searched-the-dog](https://github.com/domhan-an-fiosracht/strip-searched-the-dog) | oh dear god | Cryptid zombie apocalypse (unnamed) | Own: `CONVENTIONS.md`, titled chapter files, `meta/beats.md` + `boxes.md` |
| The Good Neighbors | [the-good-neighbors](https://github.com/domhan-an-fiosracht/the-good-neighbors) | She tripped over a werewolf on the way to first contact | The Good Neighbors | Legacy: chapters + bible in `karamyles/` |
| The Last Boundary Accord | [the-last-boundary-accord](https://github.com/domhan-an-fiosracht/the-last-boundary-accord) | A Recounting of the Final Divide, and the Years It Took to Cross It | — | Day/scene: `story/<year>/` + `meta/` + `story.toml` |
| The Sryth Eight | [the-sryth-eight](https://github.com/domhan-an-fiosracht/the-sryth-eight) | No Man's Sky shows up to Earth | Sryth | Legacy: drafts + universe brief in `the-sryth-eight/` |

## Not stories

| Repo | Description | Role |
|---|---|---|
| [herman](https://github.com/domhan-an-fiosracht/herman) | Your friendly neighborhood story helper | Static-site generator |
| [domhan-an-fiosracht.github.io](https://github.com/domhan-an-fiosracht/domhan-an-fiosracht.github.io) | Base site | Org site |
| [story-meta](https://github.com/domhan-an-fiosracht/story-meta) | Base layout reference for story repos | This repo |

## Refreshing

Descriptions and custom properties for every repo in the org:

```bash
gh api --paginate orgs/domhan-an-fiosracht/repos --jq '.[] | "\(.name)\t\(.description // "-")\t\(.custom_properties // {} | to_entries | map("\(.key)=\(.value)") | join(", "))"'
```
