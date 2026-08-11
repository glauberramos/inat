# Ideas backlog

Ideas for new tools and improvements, captured from notes. Nothing here is committed
work — it's a parking lot. See [third-party-tools.md](third-party-tools.md) for what
already exists in each space.

## New tools

### Least-observed species by place or project

List the species with the fewest observations in a given place or project — the
"rare finds" angle rather than the "top 100" angle.

Prior art: [Elias Pschernig's least-observed](https://elias.pschernig.com/wildflower/leastobserved.html)
does this for a *user's own* observations. Doing it per place or project appears to be
unclaimed.

### Discover projects by region

Find projects by region and taxonomic group, with filters and a map. Partly covered by
our existing project search; the map and taxon filter are the missing parts. No strong
competitor found.

### Interactive globe

A globe showing, per place: most common species, top observers, top identifiers.
Closest existing thing is [subject.space's globe](https://subject.space/projects-static/inaturalist/),
which is artistic rather than queryable, and stirfry's `iNat_top_observers_map`.

### "New species in your area" feed

A feed of first occurrences for a region or project — species recorded there for the
first time, or newly arrived within a window.

Prior art: [kildor's new-species](https://kildor.name/inat/new-species) does this for
projects. A subscribable feed (RSS/email) rather than a page would be the differentiator;
compare [Speak for the Trees](https://forum.inaturalist.org/t/speak-for-the-trees-a-weekly-newsletter-about-your-ecosystem-using-inat-15-other-data-sources/83469).

### Identifications list with filters

A filterable view over identifications, e.g. research-grade IDs where the observation
sits at genus but the ID is at species.

Prior art: [stirfry's identifications tool](https://jumear.github.io/stirfry/iNatAPIv1_identifications.html?current_taxon=false&rank=species&observation_rank=genus&current=true&quality_grade=research)
already covers this well. Only worth doing with a materially better UI.

### Single-taxon regional landing pages

The [Owls Near Me](https://www.owlsnearme.com/) pattern: one taxon plus one region on a
memorable URL. Each page targets its own search traffic.

Candidates: birds in Ohio, birds in Georgia, whales near me, monkeys near me, birds near
me, endangered birds in Brazil, and so on. Low effort per page once the template exists;
the value is SEO reach, not new functionality.

## Improvements to existing tools

- **SEO.** Individual, indexable pages per taxon/place instead of one JS app behind a
  form. This is what makes the "near me" sites work.
- **Taxon exclusion list.** Let users exclude taxa they don't care about from results.
- **URL parameters everywhere.** Put every filter in the query string so any view is
  shareable and bookmarkable. The strongest community tools (stirfry, kildor, iNat's own
  pages) all do this; we only do it for place and taxon today.
- **Richer species info.** Pull more from the taxonomy endpoint — conservation status,
  establishment means, ranks, related taxa — rather than just name and photo.

## Infrastructure

### Cache data server-side instead of querying live

Store query results (Firestore, or a JSON file refreshed by a scheduled job) and update
once a day, so pages don't hit the iNat API on every load.

Motivation: avoids rate limits and API load, and makes heavy pages fast.
[iNat Sightings](https://tools.simonwillison.net/inat-sightings) does exactly this — a
scheduled job writes a JSON file to git, and the page just reads it. Wild Achievements
is the counter-example: hundreds of live calls, slow for users with many observations.

This is also a prerequisite for the SEO work above — static, pre-rendered pages need
pre-computed data.
