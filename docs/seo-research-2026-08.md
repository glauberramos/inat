# SEO Research — August 2026

Which existing pages are worth optimizing, which new pages are worth creating, and why. Based on a local audit of all 20 pages, SERP checks on every head term, and a sweep of the iNaturalist community forum for unmet demand. Rankings observed August 16, 2026 via web search — verify in Search Console where possible.

Artifact version: https://claude.ai/code/artifact/c5ee9589-1ba5-4f44-b5be-9ece2840c367

## Headline findings

1. **The site already ranks #1 for four query themes** — achievements, first observer, SpeciesDex ("pokédex" phrasing), and place-vs-place compare. Google will rank this domain when a page targets an unanswered query.
2. **The niche has essentially two competitors.** Only jumear's stirfry tools (jumear.github.io) rank anywhere, with zero-content JS pages. Every other contested SERP is forum threads — beatable with modest on-page content.
3. **The biggest lever isn't technical.** Head tags are already solid. The gaps: 30–200 words of crawlable text per page, zero internal links between tools, and missing entries in the two forum wikis that power this niche's backlinks.

## Where the site stands

The technical baseline is better than typical for a JS tool suite: every indexable page has a unique title, meta description, canonical, Open Graph tags, JSON-LD (`WebApplication` + breadcrumbs), and exactly one H1. The site is indexed and already winning queries. Three structural problems remain:

1. **Thin content everywhere.** Visible text ranges from 30 words (achievements) to 199 (homepage). Competitors rank with literally zero content, so this is survivable — but it caps the site on every contested query and starves AI-search citation.
2. **Every tool page is a dead end.** The homepage links out to all 16 tools; not one tool links back or sideways. Link equity flows one hop and stops, and there's no contextual anchor text between related tools.
3. **Backlink profile is thinner than it should be.** Several forum threads and one journal post link in, but the site isn't listed in the two oldest, most-linked tool wikis — both publicly editable:
   - https://forum.inaturalist.org/t/3rd-party-inaturalist-tools/25971
   - https://forum.inaturalist.org/t/wiki-external-code-tools-etc-for-working-with-inat/15906

   Getting added is the single cheapest win in this report.

Housekeeping: `year-in-review.html` is still `noindex`, missing from the sitemap, and lacks canonical/OG/JSON-LD — fine while it's a draft, but it's also the biggest opportunity below. `sitemap.xml` has no `lastmod` dates.

## Existing pages worth optimizing

Ranked by demand × beatability. "What to do" is mostly the same recipe: retitle toward the phrasing people actually search, then add a real content section under the tool — what it shows, how numbers are computed, and answers to the exact questions asked on the forum.

### 1. year-in-review — open gap (biggest opportunity)

- "inaturalist year in review" autocompletes with year variants (2024/2025/2026). The official version is seasonal and login-only, and staff explicitly declined a project version: https://forum.inaturalist.org/t/create-a-version-of-the-year-in-review-for-a-project/46428
- Zero third-party tools rank for any variant.
- **Do:** de-draft before December — remove `noindex`, add canonical/OG/JSON-LD, add to sitemap. Target "year in review for a project", "past years", "any user", and add "iNaturalist Wrapped" phrasing (nobody targets it). Announce in the forum's Third-party Tools category ahead of the official mid-December release.

### 2. profile — beatable

- "inaturalist user stats" autocompletes; #1 is a bare jumear JS page; official iNat has no user-stats page and forum threads rank in its place (https://forum.inaturalist.org/t/viewing-your-own-user-stats/10328).
- **Do:** retitle toward "iNaturalist User Stats"; add an explainer section (what each stat means, how streaks and ID categories are computed). A user already asked exactly this on the forum — ready-made FAQ content: https://forum.inaturalist.org/t/types-of-ids-what-is-other-on-the-user-profile-section-of-glauber735s-inaturalist-tools-website/82822

### 3. lifelist — beatable

- Official life list is taxonomy-only; recurring forum demand for chronological views (https://forum.inaturalist.org/t/displaying-a-chronologically-sorted-life-list/65042) and "life-list firsts for [year]" (https://forum.inaturalist.org/t/is-there-a-way-to-see-a-list-of-life-list-firsts-for-all-of-2024/50197). Searches currently land on complaint threads.
- **Do:** work "chronological life list" and "life list firsts by year" into title/H1/copy — exact forum phrasing with no ranking answer.

### 4. widget — beatable

- The official widget is broken and unmaintained (https://forum.inaturalist.org/t/observations-widget-is-not-working-anymore/7892). The ranking asset for our tool is the forum announcement thread, not the page itself.
- **Do:** add a genuine "How to embed iNaturalist observations on your website" guide on-page; explicitly cover the official widget's documented gaps (project widgets, single-observation embeds, styling).

### 5. achievements — won, extend

- Already #1. Wild Achievements has no crawlable text; official iNat has no badges (only Seek does) and demand threads keep recurring (https://forum.inaturalist.org/t/badges-and-achievements-like-seek/65815).
- **Do:** add a full badge list with names + how to earn each — locks in long-tail ("badges like Seek", per-badge queries) and takes the page past its current 30 words.

### 6. species-identified — beatable

- "inaturalist identifier stats" autocompletes; jumear holds #1 with a no-content page; steady forum demand for "species I've ID'd" (https://forum.inaturalist.org/t/is-it-possible-to-see-a-list-of-species-youve-idd/9130).
- **Do:** target "identifier stats" in title/copy; explain the identification categories shown.

### 7. speciesdex — won, extend

- #1 for pokédex phrasing, but absent for "species I haven't observed in [place]" — the phrasing used in demand threads (https://forum.inaturalist.org/t/how-to-i-search-for-species-i-havent-observed/41601). "Missing species finder" belongs to Easily Missed (simonrolph.github.io/easily_missed/).
- **Do:** add "find species you haven't observed yet in a place" / "target species" phrasing; keep the Pokédex identity as the hook.

### 8. first-observer, species-compare — won, defend

- Both #1 for their core phrasings.
- **Do:** light touch — add forum-phrasing variants ("first observation on iNat of a species", "compare checklists between places") and a short explainer each.

### Site-wide, before any single page

- **Shared footer / related-tools links on every page.** Fixes the 16 dead ends and doubles as the Tier-1 "cohesion" roadmap item. Contextual links ("Compare your lifelist with a friend →") beat a bare nav list.
- **Get listed in forum wikis 25971 and 15906**, and give each major tool its own announcement thread in the Third-party Tools category. Forum threads both rank in Google themselves and are the backlink engine of this entire niche.
- **Sitemap:** add year-in-review (once indexable) and `lastmod` dates.

## New pages worth creating

1. **Target Species** (or a SpeciesDex mode with its own landing copy). "Species you haven't observed yet in [place]" is a top-3 recurring forum need whose current best answer is a URL hack buried in reply threads. The SpeciesDex Missing filter is ~90% of the build — mostly a landing-page and framing exercise. Pairs with the roadmap's "Go Find This" Tier-2 item.
2. **Top Observers by Place.** The single most-requested unmet need found (https://forum.inaturalist.org/t/city-or-location-leaderboards/42921, https://forum.inaturalist.org/t/how-to-view-top-observers-and-identifiers-by-state-or-country/7359), with zero rankers. **Caveat:** public rankings draw backlash on the forum and iNat staff deliberately avoid gamification. If built, frame it as a viewer of data iNat already shows (Explore-page leaderboards made filterable by place/taxon/year) with personal framing — "see where you stand" — not a competitive ranking product. Or skip it and let the content cluster answer those queries with a guide to iNat's own leaderboards.
3. **Small informational content cluster (4–5 pages).** "What does research grade mean" / "casual vs needs ID", "how to export iNaturalist data", "how to cite iNaturalist", "iNaturalist vs Seek". Each has real search volume (several autocomplete), weak SERPs of help docs and PDFs, and they feed internal links into the tools ("or skip the export — view it here"). Also the best surface for AI-search citation, where thin JS pages are invisible.
4. **iNaturalist Tools Directory.** A curated page listing third-party tools, including competitors'. The forum wikis prove the demand; a well-maintained directory becomes the page others link to instead of the wikis — a durable link magnet.
5. **Seasonal event landings (later).** "City Nature Challenge [year] [city] results" and Great Southern Bioblitz stats pages, powered by the project Year in Review. Long-tail, spiky, near-zero competition; only worth building once project YIR is live. Prep CNC in March–April, GSB in November.

## Suggested sequence

1. **Now (hours):** wiki listings + sitemap fixes + shared footer links.
2. **Next (a weekend):** content sections + retitles on profile, lifelist, widget, achievements, species-identified.
3. **By early December:** year-in-review de-drafted, "Wrapped"/project/past-years phrasing, forum announcement before the official YIR ships.
4. **Ongoing:** the 4–5 content-cluster pages, one at a time; then the Target Species landing; leaderboards only with the reframed design.

## Method notes

Local audit of all 20 HTML pages (titles, metas, canonicals, OG, JSON-LD, H1s, word counts, internal links, sitemap, robots.txt) plus two parallel web-research passes: ~28 query themes SERP-checked, competitor tools enumerated from the forum wikis, and demand mined from forum.inaturalist.org threads (linked inline). Market context: iNaturalist has ~4.3M registered users, ~400K monthly active.

Competitors verified: jumear stirfry (only real ranker), Wild Achievements (no crawlable text), kildor's tools, Easily Missed, iNaturalist Enhancement Suite, official iNat widget (broken). Discovery in this niche runs almost entirely through iNat forum threads/wikis and journal posts, secondarily GitHub; Reddit showed no ranking presence for tool queries.
