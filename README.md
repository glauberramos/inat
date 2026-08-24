# iNaturalist Tools

A suite of companion tools for [iNaturalist](https://www.inaturalist.org) — explore your observations, track your progress, and find what to go look for next. Built with vanilla HTML, CSS, and JavaScript, no build step, no external dependencies.

**Live site:** https://glauberramos.github.io/inat/

## The tools

### Your stats & progress

- **User Profile** — detailed stats: observation quality grades, identification categories, threatened/endemic/introduced/native species, streaks, and a world coverage map
- **Achievements** — milestones and badges earned from your observations
- **Lifelist Timeline** — your species sorted by first observation date
- **Tree of Life** — how much of the tree of life have you seen? Progress across any taxonomic rank
- **Country States** — track observations across the states of the US, Brazil, Canada, Australia, and France on interactive maps
- **Field Card** — turn your stats into a shareable card you can download

### Explore your species

- **SpeciesDex** — find the species you're missing nearby, Pokédex-style: the most observed species in a place, marked with the ones you've already seen
- **Species Observed** — browse and filter all species you've observed (includes a "My Rarest Species" view — your species with the fewest observations worldwide)
- **Species Identified** — browse species you've identified for others
- **First Observer** / **First Identifier** — species you were the first to record or identify on iNaturalist

### Compare & discover

- **Location Species Compare** — compare species between two places
- **Users Species Compare** — compare species between two users
- **Project Search** — find iNaturalist projects by name and location
- **iNaturalist Observers** — top observers in any place or project, ranked by observations or species, with your own position highlighted

### Create & embed

- **Widget Builder** — create embeddable observation widgets for any website
- **Draft Observations** — create drafts, edit images, and submit (beta)

## Running locally

No server or build required. Clone the repo and open `index.html` in your browser — the pages work over `file://`. An internet connection is needed, since everything is fetched live from the iNaturalist API.

## Technical details

- Vanilla HTML/CSS/JS, no external dependencies
- Data comes from the [iNaturalist API](https://api.inaturalist.org/v1/docs/) (observations, species counts, identifications, users, places, projects)
- Species counts use `verifiable=true` to match what iNaturalist's own Explore pages show
- Responsive design with dark mode

## Docs

- [Assessment & roadmap (Aug 2026)](docs/assessment-and-roadmap-2026-08.md) — where the suite stands and where it's headed
- [SEO research (Aug 2026)](docs/seo-research-2026-08.md) — which pages to optimize, which to create, ranked by demand and beatability
