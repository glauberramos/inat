# Third-party iNaturalist tools

A survey of tools built by the iNaturalist community on top of the public API, plus
built-in iNat pages that are useful but hard to find. Collected as competitive
research and inspiration for the tools in this repo — it is a map of what already
exists, what it does well, and where the gaps are.

Last researched: August 2026. Links rot; the hubs in the first section are the
places to re-check.

## Contents

- [Where the community keeps its lists](#where-the-community-keeps-its-lists)
- [Multi-tool suites](#multi-tool-suites)
- [Missing / target species](#missing--target-species)
- [Achievements and gamification](#achievements-and-gamification)
- [Stats and visualisation](#stats-and-visualisation)
- [Discovery and "near me" sites](#discovery-and-near-me-sites)
- [Identification practice and quizzes](#identification-practice-and-quizzes)
- [Browser extensions and add-ons](#browser-extensions-and-add-ons)
- [Libraries and developer tools](#libraries-and-developer-tools)
- [Built-in iNaturalist pages worth knowing](#built-in-inaturalist-pages-worth-knowing)
- [Overlap with this repo](#overlap-with-this-repo)

---

## Where the community keeps its lists

These are the canonical hubs. Anything new usually shows up in one of them first.

| Resource | What it is |
| --- | --- |
| [Third-party Tools and Apps using iNat API](https://forum.inaturalist.org/c/tools-and-apps-using-the-inaturalist-api/36) | Dedicated forum category where authors announce new tools. The most current source. |
| [External code, tools etc for working with iNat (wiki)](https://forum.inaturalist.org/t/external-code-tools-etc-for-working-with-inat-wiki/15906) | Community-editable wiki post: libraries, scripts, sites. |
| [Web Resources, extensions and add-ons (wiki)](https://forum.inaturalist.org/t/web-resources-for-inaturalist-wiki/52020) | Community-editable wiki post focused on browser extensions and alternative pages. This repo is already listed here. |
| [3rd party iNaturalist tools](https://forum.inaturalist.org/t/3rd-party-inaturalist-tools/25971) | Older but long discussion thread with many one-off links. |
| [iNat developer guide](https://www.inaturalist.org/pages/developers) · [API v1](https://api.inaturalist.org/v1/docs/) · [API v2](https://api.inaturalist.org/v2/docs/) · [recommended practices](https://www.inaturalist.org/pages/api+recommended+practices) | Official API docs. Worth re-reading the rate-limit guidance. |

---

## Multi-tool suites

The direct "many small tools on one site" competitors.

### stirfry — https://github.com/jumear/stirfry

By **@pisum**. By far the largest collection — around 40 single-page tools, each a
thin, URL-driven wrapper over one API endpoint. Ugly on purpose, extremely powerful.
There is no index page; the repo README is the directory, and each tool is served
individually from `https://jumear.github.io/stirfry/<name>`. Highlights:

- [`iNat_observations_taxonomy`](https://jumear.github.io/stirfry/iNat_observations_taxonomy) — observations arranged in the taxonomic tree, filterable by user and place.
- [`iNat_observations_updates`](https://jumear.github.io/stirfry/iNat_observations_updates.html) — permanent notifications; shows updates even after iNat drops them from the UI.
- [`iNatAPIv1_identifications`](https://jumear.github.io/stirfry/iNatAPIv1_identifications.html) — identification search with filters iNat itself doesn't expose (current taxon, rank vs observation rank, etc.).
- [`iNatAPIv1_identifications_species_counts`](https://jumear.github.io/stirfry/iNatAPIv1_identifications_species_counts.html) — full species lists for projects, past the 500-item cap.
- `iNat_calendar_heatmap`, `iNat_observation_histogram`, `iNat_obs_species_counts_packed_circles`, `iNat_top_observers_map` — visualisations.
- `iNat_taxa_conservation_status`, `iNat_taxon_est_means`, `iNat_ungrafted_taxa`, `iNat_taxon_counts_by_rank` — taxonomy utilities.
- `iNat_UTFGrid_*` — density maps built from iNat's own map tiles rather than the observation API. Clever trick for heavy queries.

**Worth stealing:** everything is driven by URL query params, so any view is
shareable and bookmarkable. That is the single biggest usability gap in most other
tools, including ours.

### kildor's iNat tools — https://kildor.name/inat/

By **@kildor** (birder + programmer, Russian-language UI in places). Focused on
project and regional analysis:

- [`/species`](https://kildor.name/inat/species) — full species list for a project, place or user, with sorting by first observation date, quality grade, and contribution.
- [`/missed-species`](https://kildor.name/inat/missed-species) — species recorded in a region that you have not seen. Direct overlap with SpeciesDex.
- [`/new-species`](https://kildor.name/inat/new-species) — species newly appearing in a project within a time window.

### Elias Pschernig's wildflower tools — https://elias.pschernig.com/wildflower/

- [`leastobserved.html`](https://elias.pschernig.com/wildflower/leastobserved.html?user=glauberramos) — **your own observations ranked by how rarely the species is observed on iNat overall.** Filters: user, place, project, year, wild only, native only, research grade only. Great "what rare thing have I found" angle.
- Sibling pages: project top rankings, picture gallery.

### iNat Explorer — https://inat-explorer.dataexplorers.info/

An alternative Explore / media page where every filter is clickable instead of
requiring hand-edited URLs. Supports annotation terms (`term_id` / `term_value_id`),
grid and observation views. Example:
[flowering plants, grid view](https://inat-explorer.dataexplorers.info/?taxon_id=980204,12978&verifiable=true&spam=false&per_page=24&term_id=1&term_value_id=8&view=observations_observations&subview=grid).

### mickley's iNat-Tools — https://mickley.github.io/iNat-Tools/

Tooling aimed at running ID-a-thons: bulk identification workflows and progress
tracking. [Source](https://github.com/mickley/iNat-Tools).

### agoranomos' prototype tools — https://seanclifford.github.io/inat-prototype-site/

Small experimental pages. [Source](https://github.com/seanclifford/inat-prototype-site).

---

## Missing / target species

The category SpeciesDex sits in — the closest competitors.

| Tool | Angle |
| --- | --- |
| [iNat lifelist, unobserved view](https://www.inaturalist.org/lifelists/glauberramos?details_view=unobservedSpecies&taxon_id=3&place_id=207283) | **Built into iNat.** Species in a taxon + place you haven't observed. Set `details_view=unobservedSpecies` with `taxon_id` and `place_id`. This is the baseline every "missing species" tool competes with. |
| [kildor missed-species](https://kildor.name/inat/missed-species) | Same idea, project-oriented, with a plain sortable table. |
| [Elias Pschernig least-observed](https://elias.pschernig.com/wildflower/leastobserved.html) | Inverts it: not what you're missing, but which of your finds are globally rare. |
| [Local Biodiversity Trainer](https://forum.inaturalist.org/t/local-biodiversity-trainer-by-arthurdd/83231) by @arthurdd | Turns the local species list into an ID drill, weighted by real observation frequency. |

**Gap:** the built-in lifelist view is taxon + place only. It has no date range, no
"top N most observed" ranking, no project support, no map-drawn area, and no export.
That is roughly the space this repo's SpeciesDex occupies.

---

## Achievements and gamification

| Tool | Notes |
| --- | --- |
| [Wild Achievements](https://wild-achievements.mywild.co.za/) | Analyses your observations against a list of achievements/badges. Pure client-side API calls, so it is slow for accounts with thousands of observations. [Forum thread](https://forum.inaturalist.org/t/wild-achievements/38903). |
| [iNat Streak](https://mapsandapps.github.io/inat-streak/) | Finds your longest run of consecutive observation days. |
| [iNat Counter](https://simonrolph.github.io/inatcounter/) | Live ticker of observations being added to iNat worldwide. |

---

## Stats and visualisation

| Tool | Notes |
| --- | --- |
| [iNat year stats](https://www.inaturalist.org/stats/2024/glauberramos) | **Built in.** Per-year wrapped-style summary: `/stats/<year>/<username>`. |
| [Species observation map](https://tools.simonwillison.net/species-observation-map) | Search a species, map sightings within the last N days. |
| [iNat Sightings](https://tools.simonwillison.net/inat-sightings) | Aggregates observations across accounts into a time-ordered photo feed. Interesting architecture: a Python CLI clusters observations within 2h/5km, git-scraping keeps a JSON file fresh, and the page just reads the JSON — **no live API calls**. |
| [Citizen science psychogeography globe](https://subject.space/projects-static/inaturalist/) | Artistic globe visualisation of observation patterns worldwide. |
| [Species bar chart race](https://observablehq.com/@robin-song/inaturalist-species-bar-chart-race) | Animated top-species-over-time by location. |
| [Edges of all Life](https://storymaps.arcgis.com/stories/29c6ac1c2f4e4f93beabba73a42ac7b1) | Species at the extreme north/south edges of their range. |
| [iNat_patterns](https://forum.inaturalist.org/t/inat-patterns-open-shiny-app-r-by-andreferrari/83535) by @andreferrari | R/Shiny: when a species is observed, by hour of day and month. |
| [Observer–Identifier Network](https://forum.inaturalist.org/t/observer-identifier-network-open-shiny-app-r-by-andreferrari/83261) by @andreferrari | R/Shiny: the collaboration graph behind a project or place. |

---

## Discovery and "near me" sites

Single-taxon, consumer-facing, SEO-friendly sites — the "Owls Near Me" pattern.

| Tool | Notes |
| --- | --- |
| [Owls Near Me](https://www.owlsnearme.com/) | By Simon Willison and Natalie Downe. Single-page React app, all data from the iNat API. Also supports a `?place=` param. The canonical example of this genre. |
| Rocky Beaches — `rockybeaches.com` | Tidepooling guide combining iNat observations with tide data for a specific location. Also by Simon Willison. *Returning HTTP 500 as of August 2026 — may be down for good.* |
| [Speak for the Trees](https://forum.inaturalist.org/t/speak-for-the-trees-a-weekly-newsletter-about-your-ecosystem-using-inat-15-other-data-sources/83469) | Weekly newsletter about your local ecosystem, iNat plus 15 other data sources. |
| [Vespa-Watch](https://vespawatch.be/) · [iSeahorse](https://www.iseahorse.org/) | Domain-specific surveillance sites built on iNat data. (Find-A-Pest NZ, listed in the forum wiki, no longer resolves.) |

**The pattern:** one taxon + one region + a memorable domain. Cheap to build on the
API, and each one gets its own search traffic ("birds in Ohio", "whales near me",
"pássaros ameaçados no Brasil"). See [ideas.md](ideas.md).

---

## Identification practice and quizzes

| Tool | Notes |
| --- | --- |
| [Local Biodiversity Trainer](https://forum.inaturalist.org/t/local-biodiversity-trainer-by-arthurdd/83231) | Local-species ID drill weighted by real observation frequency. Announced 2026, the most active tool in this space. |
| [Flashcards](https://forum.inaturalist.org/t/how-well-do-you-know-your-local-wildlife-now-you-can-test-yourself/10711) | Flashcard test of local wildlife. |
| Taxa Challenge — `1clickquiz.com/taxa-challenge` | Quiz on plants and animals drawn from iNat photos. Listed in the forum wiki, but the domain no longer resolves. |
| [Dronefly](https://github.com/synrg/dronefly) | Discord bot exposing iNat search and taxon info in chat. |

---

## Browser extensions and add-ons

| Extension | What it adds |
| --- | --- |
| [iNaturalist Enhancement Suite](https://chrome.google.com/webstore/detail/inaturalist-enhancement-s/hdnjehcihcpjphgbkagjobenejgldnah) | Colour-coded CV suggestion scores, identifier stats, coordinate copying. The most widely used one. |
| [iNaturalist Metadata Tool](https://forum.inaturalist.org/t/official-release-of-the-inaturalist-metadata-tool-by-megachile/79300) by @megachile | Observation fields and annotations in bulk; Firefox + Chrome, released 2026. |
| [Add Fields add-on](https://github.com/Megachile/Phenology/tree/main/inathelperJS) | User-defined observation-field presets on the Identify screen. |
| [Tools for iNaturalist](https://chromewebstore.google.com/detail/tools-for-inaturalist/pmlhnjpkaojokgpabkfbembpklhjobkj) | Batch-set observation locations by matching timestamps against a GPX track. |
| [iNat Spectro](https://chromewebstore.google.com/detail/inatspectro/dkcpffpppiggohlejjcoafbhhdcmnapc) | Adds spectrogram + waveform to audio observations. |
| [DQA add-on](https://forum.inaturalist.org/t/new-chrome-extension-to-select-that-the-community-taxon-cannot-be-improved/47239) | One-click "community taxon cannot be improved". |
| [iNaturalist to Wikimedia](https://chromewebstore.google.com/detail/inaturalist-to-wikimedia/bmcedhfhglnnfcjgbkgaaabcndkcnjnp) · [iNat2Wiki](https://inat2wiki.toolforge.org/) · [iNaturalist2Commons](https://commons.wikimedia.org/wiki/User:Kaldari/iNaturalist2Commons) | Push openly-licensed observation photos to Wikimedia Commons. |
| [Expandable Taxa](https://jwidness.github.io/iNat_expandable_taxa.html) | Shows child-taxon counts within each rank. Not an extension, but used the same way. |

---

## Libraries and developer tools

| Library | Notes |
| --- | --- |
| [pyinaturalist](https://pyinaturalist.readthedocs.io/) | Maintained Python API client. The best-documented client for any language. |
| [rinat](https://cran.r-project.org/package=rinat) | R package. No longer maintained. |
| [Naturtag](https://github.com/pyinat/naturtag) | Tags local photo collections with iNat metadata so they're searchable offline. |
| [iNaturalist QGIS plugins](https://plugins.qgis.org/plugins/?search=inaturalist) | Pull observations into QGIS for GIS work. |
| [taxonname-wpstubmaker](https://github.com/wikiproject-biodiversity/taxonname-wpstubmaker) | Generates Wikipedia stubs from iNat + other biodiversity data. |

---

## Built-in iNaturalist pages worth knowing

Half the "tools" people share are really just iNat URLs with the right query params.
Worth knowing before building a replacement.

Replace `USERNAME`, `TAXON_ID`, `PLACE_ID` as needed.

| What | URL |
| --- | --- |
| Species in a taxon + place you have **not** observed | `https://www.inaturalist.org/lifelists/USERNAME?details_view=unobservedSpecies&taxon_id=TAXON_ID&place_id=PLACE_ID` |
| Threatened species you **have** observed | `https://www.inaturalist.org/observations?threatened&user_id=USERNAME&verifiable=any&view=species` |
| Your year in review | `https://www.inaturalist.org/stats/2024/USERNAME` |
| Your comments | `https://www.inaturalist.org/comments?mine=true` |
| A place's check list | `https://www.inaturalist.org/check_lists/4429483-Queen-Sirikit-Park-Check-List` |
| Observation search, species view | `https://www.inaturalist.org/observations?place_id=PLACE_ID&taxon_id=TAXON_ID&view=species` |

Worked examples:

- [Birds still to see in Porto Alegre](https://www.inaturalist.org/lifelists/glauberramos?details_view=unobservedSpecies&taxon_id=3&place_id=207283)
- [Mammals still to see in Rio Grande do Sul](https://www.inaturalist.org/lifelists/glauberramos?details_view=unobservedSpecies&taxon_id=40151&place_id=9470)
- [Threatened species observed](https://www.inaturalist.org/observations?threatened&user_id=glauberramos&verifiable=any&view=species)

---

## Overlap with this repo

Where [our tools](https://glauberramos.github.io/inat/) sit against the above:

| Our tool | Closest existing tool | How we differ |
| --- | --- | --- |
| SpeciesDex | iNat lifelist `unobservedSpecies`, kildor missed-species | We rank by *most observed* in the place and show a completion percentage; we support projects, map-drawn areas, month and date-range filters, and export. |
| Lifelist timeline | stirfry `iNat_calendar_heatmap` | Ours is a species-first timeline rather than an activity heatmap. |
| Achievements | Wild Achievements | Same genre; different badge set. |
| First observer / first identifier | stirfry `iNat_identifier_stats` (partial) | No direct equivalent for "species you were first to observe". |
| Project search by location | — | No real competitor found. Genuinely under-served. |
| Taxonomy completion | jwidness Expandable Taxa, stirfry `iNat_taxon_counts_by_rank` | Ours frames it as personal completion rather than raw counts. |
| Species / user compare | — | No direct equivalent found. |
| Embeddable widget | — | Rare; most tools are destinations, not embeds. |

Two recurring themes across the strongest tools, worth adopting:

1. **URL-addressable state.** stirfry, kildor and iNat's own pages put every filter in
   the query string. Shareable links are the main distribution channel for tools like
   these.
2. **Pre-computed data.** [iNat Sightings](https://tools.simonwillison.net/inat-sightings)
   scrapes to a JSON file on a schedule and serves that, instead of hammering the API
   on every page load. Wild Achievements is the counter-example — it makes hundreds of
   live calls and is slow for heavy users.
