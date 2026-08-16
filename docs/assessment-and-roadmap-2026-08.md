# iNaturalist Tools: Assessment & Roadmap

*From a collection of pages to a companion made with craft — where the suite stands, what's holding it back, and a prioritized path to being the best iNat companion tool out there.*

Prepared August 2026 · Based on a full code audit of 19 pages, a per-tool UX walkthrough, and research across the iNaturalist community and third-party tool landscape.

---

**The short version:** you're closer than you think, and the gap is not features. This is an unusually complete analytics suite — 16 tools, some genuinely unmatched — that's already known and liked on the iNaturalist forum. What separates it from "one of the best" is three things: **the tools must never give wrong answers under load** (today they can), **the 16 pages must become one product** (today they're cul-de-sacs with a loose family resemblance), and **the forward-looking data already computed must be put in front of users** (today the suite is ~85% retrospective, while three tools calculate "what you're missing" and then hide it).

---

## Part I — Where you stand

The suite's position in the landscape is stronger than most builders realize about their own work. The achievements tool's forum thread has 169+ posts; SpeciesDex was praised specifically for its "clean presentation and interface." That matters because the landscape splits cleanly into two camps: powerful-but-unpolished (jumear's stirfry — ~40 pages of raw utility, the forum's default answer to "is there a tool for X") and loved-but-fragile (Wild Achievements — adored concept, but it stalls at the API's 10,000-observation cap and takes hours for power users). **Nobody currently occupies "powerful and crafted." That's the open seat.**

Two structural facts make this a durable opportunity rather than a race:

- **iNaturalist staff have formally declined to build gamification and personal-stats features**, and the forum no longer accepts achievement/badge feature requests. Year-in-review pages, achievements, target lists, goal tracking — all permanently third-party territory.
- **The community has a clear taste line**: personal, quality-oriented, coverage-oriented framing is welcomed; public quantity leaderboards and head-to-head competition draw backlash (the City Nature Challenge officially pivoted to "collaboration over competition" for 2026 after data-quality problems). This suite is already on the right side of the line — keep it there deliberately.

### The demand nobody is serving

| Community ask | Status | Position |
|---|---|---|
| All-time / custom-range "Year in Review" | **Wide open** | No incumbent at all; the loved official version is annual-only. Pure data-viz craft. |
| "What should I go look for next?" | **Wide open** | Users hand-assemble target lists via URL hacks today. SpeciesDex's Missing filter + month checkboxes are already 90% of the answer. |
| Better lifelist / taxonomy visualization | Underserved | A 2019 feature request still open; official Lists are "old and buggy." Lifelist + taxonomy-completion are the closest tools in existence. |
| Shareable / printable artifacts | Underserved | Card and poster generators get warm receptions; nobody makes shareable profile cards or achievement images. |
| Identifier recognition (private, quality-framed) | **Wide open** | A five-page forum mega-thread of demand, zero tools. The species-identified page is a foundation. |
| First-observation recognition | Underserved | Six years of threads; the firsts checkers are nearly unopposed. Extend to place-scoped firsts (county/state/country). |

One more pattern from the research: the best-loved tools share traits that have nothing to do with feature count — they produce *a number or moment people want to post* ("91 out of 100," "your rarest find"), they survive power users with 20k+ observations, and their authors respond fast in forum threads. Frozen tools visibly decay in reputation.

## Part II — What's holding it back

### 1. Trust — the tools can quietly lie *(fix first)*

This is the most serious finding in the audit, and it's invisible in normal use. Only 11 of 106 `fetch()` calls check `response.ok`, and there is no rate-limit handling anywhere — on an API that hard-limits at 100 requests/minute. Several pages fire unbounded parallel bursts (species-observed launches four unbounded `Promise.all` fan-outs; a 20,000-species user triggers ~40 concurrent requests, four times). When a request gets throttled:

- **First Observer / First Identifier silently drop species from the results.** A failed batch returns an empty list that's indistinguishable from "you weren't first." The tool's entire output is a claim of fact, and under load it degrades to a confident wrong answer.
- **Profile renders confident zeros.** A 429 flows into `.json()` and comes out as "0 threatened species observed" instead of an error.
- **Ten pages resolve usernames by fuzzy search** (`/users/autocomplete`, take first result) — type a name that's a prefix of a more popular one and you get someone else's data. Four pages already have the exact-match fix; it just wasn't propagated. *(✅ Fixed 2026-08-14 — propagated everywhere; see Tier 0.)*

This is also the chance to beat the incumbent on its known weakness: Wild Achievements' reputation is capped by exactly this — stalling at the API's 10,000-result window. Handling that window gracefully (`id_above` pagination) plus polite backoff is a genuine differentiator, not plumbing.

### 2. Cohesion — 17 pages wearing a family resemblance *(highest leverage)*

The craft audit found no design system underneath the visual polish: zero CSS custom properties, **129 distinct hex colors, 18 border-radius values, 18 breakpoints**, four different "hover greens," and — most telling — every primary Search button is *blue* (`#3498db`) while the entire brand is iNat green. The homepage doesn't even load the shared stylesheet; it's a measurably different shade and width than every tool it links to. Roughly 7,100 lines of inline CSS re-implement what `styles.css` should own, including a byte-identical 22-line back-button block pasted into 15 pages.

The shared modules exist but are dead: `initUsername()`, `initPlace()`, `getSavedUsername()` and the entire `autocomplete.js` file have **zero call sites** — each page re-implements them inline (the username autocomplete is hand-rolled 13 times). Worse, SpeciesDex and Lifelist store the selected project under *different localStorage keys* (`inatProject` vs `inatProjectName`), so picking a project in one silently corrupts the location label in the other.

And structurally, the suite has no connective tissue:

- **15 of 16 tools are dead ends** — the only cross-tool links in the entire suite are three on the profile page. Going from Profile to Achievements (two tools about the same user) means going back to a 16-card grid.
- **Deep links prefill but don't run** — 12 tools read `?user=` and prefill the box; the visitor still clicks Search. *(Decision 2026-08-14: keeping it this way on purpose — auto-running would fire a burst of API calls for every page open, wanted or not. Deep links stay prefill-only.)*
- **No share affordance anywhere**, despite output that is inherently braggable.
- **brazil-states.html is orphaned** — fully built, in the sitemap, not on the homepage.

### 3. Engagement — the forward-looking answer is computed, then hidden *(the stated goal)*

The vision is "engage them to go out more and look for things they're not really looking into." The audit's most striking finding is that three tools *already compute exactly that* and then don't show it:

- **species-compare** knows which species in Place B you've never seen (it marks your seen ones with a ✓) — but offers no "show me only what I'm missing" filter. That filter is a trip-planning target list.
- **us-states / brazil-states** know your blank states — and render them as grey nothing. The blank states *are* the call to action, and nothing says so.
- **taxonomy-completion** labels taxa "Not Yet" — and links them to a bare taxon page instead of "find one near you." It also has no place filter, so "not yet observed" conflates *never seen* with *doesn't live here*.

Meanwhile SpeciesDex — whose Missing filter plus month checkboxes plus place selection is the strongest "go find this" mechanic in the entire third-party landscape — is described on the homepage as "Build your personal field guide," which says nothing about what makes it special. Nothing in the suite knows it's August or where you are. "Species observed near you this month that you've never seen" is the highest-value query the iNat API supports, and no tool asks it.

### 4. Craft details that undercut the "made with love" feel

- **Keyboard users can't select a username on 14 of 15 tools** — the autocompletes are click-only divs. (SpeciesDex's map search has full arrow-key support, so the pattern exists in the codebase.)
- **Contrast failures on meaningful UI**: white-on-brand-green measures 2.75:1 (needs 4.5), and the conservation-status badges — which encode threat level — bottom out at 1.66:1.
- **New users with zero observations get a red error box** instead of a welcome. The only real empty state in the suite is on the widget builder. *(✅ Fixed 2026-08-14 on the five user-search pages; see Tier 1.)*
- **Dark mode flashes white on every page load** (the toggle script loads at the end of body) *(✅ fixed 2026-08-14 — pre-paint bootstrap in `<head>`)*, the widget builder has no dark mode at all, and the 404 page uses a different dark-mode mechanism entirely.
- **The PWA doesn't deliver**: the service worker precaches 8 of ~40 files, returns a raw network error for uncached pages offline, and the manifest lacks the icon sizes Chrome requires for install — plus it locks orientation to portrait, hostile to the state maps.
- **No response caching**: navigating Profile → Achievements → Lifelist re-resolves the same username three times and refetches everything; Profile's ~8-second load (23 requests padded with hard-coded 500ms sleeps) repeats in full on every visit.

### 5. Product shape — too many cards, differentiation invisible

Five tools show species grids, and the homepage copy hides what distinguishes them while species-observed gets two cards ("My Rarest Species" is a saved view, not a tool). Four near-identical labels — First Observer, First Identifier, Species Observed, Species Identified — sit in one grid. Recommended consolidations:

| Change | Rationale |
|---|---|
| Merge species-observed + species-identified behind an Observed \| Identified toggle | Near-clones; the identified variant is strictly poorer (no date range, no summary strip, no export) |
| Merge us-states + brazil-states into one "Regions" tool with a country picker | Literal clones; hardcoding one extra country invites "where's my country?" from everyone else |
| Fold "My Rarest Species" into species-observed as a labeled view | It's a sort order with a homepage card |
| ✅ *Done 2026-08-14* — Renamed "Taxonomy Completion" → "Tree of Life" (card, page title, meta, JSON-LD; URL unchanged) | Current name sounds like data-quality tooling; it's the second-best engagement mechanic |
| ✅ *Done 2026-08-14* — SpeciesDex card now reads "Find the species you're missing nearby" | The differentiated idea, previously described generically |
| Decide draft.html's identity: separate product or flagship tool | 4,870 lines, OAuth, a photo editor — a different mental model wearing a tool card. Note: it keeps OAuth tokens in localStorage with 158 `innerHTML` sinks on the same origin; worth hardening regardless |

## Part III — The roadmap

Ordered so that every tier makes the next one more valuable: correctness makes the tools trustworthy, cohesion makes them feel like one product, the engagement layer gives people a reason to come back and go outside, and the flagship gives them a reason to tell others.

### Tier 0 — Never give a wrong answer

*Small, unglamorous, and the foundation of everything — a beautiful tool that lies under load can't be "the best."*

- One shared fetch layer in `shared-utils.js`: `response.ok` checks, 429/`Retry-After` backoff, a concurrency limiter (token bucket, ≤60 req/min). Route all 106 fetches through it; replace Profile's guesswork sleeps.
- Make batch failures loud: First Observer / First Identifier must surface "3 batches failed — results incomplete, retry?" instead of silently shrinking the list.
- ✅ *Done 2026-08-14* — Exact username resolution everywhere: the exact-match filter was propagated to the five remaining search-time call sites (species-observed, species-identified, achievements, taxonomy-completion, species-compare). Lifelist and first-observer were confirmed safe (they pass `user_login=` directly); draft's `/users/me` and achievements' project-slug lookups are exact by design.
- Unify the `inatProject` / `inatProjectName` localStorage keys with a migration.
- Handle the 10,000-result window with `id_above` pagination — the exact cliff the best-known competitor falls off.
- Add a short-TTL `sessionStorage` cache keyed on request URL — removes the majority of API traffic and makes tool-to-tool navigation feel instant.

### Tier 1 — One product, not seventeen pages

*The craft-and-cohesion core. Everything here is structural leverage: build once, every page improves.*

- **A Share button on every result.** Copy-link / `navigator.share` once a search has run. *(Auto-running `?user=` deep links was considered and rejected 2026-08-14: too many unwanted API calls when someone opens a page without meaning to search. Links prefill only; the visitor clicks Search.)*
- **A shared header on every page**: logo → home, a tool switcher that carries `?user=` (and place) forward, dark-mode toggle and back link in fixed positions. Kills the 15 pasted back-button blocks and ends the cul-de-sacs.
- **A contextual footer**: 2–3 next steps per tool ("You've seen 412 species → which were you first to find?" / "Missing 31 orders → find one near you"). Cross-tool synergy and an engagement nudge in one component.
- **`tokens.css` design system**: one green (resolve the blue-button contradiction), an elevation scale, a radius scale, 3–4 breakpoints. Fold index, lifelist, first-observer/identifier, and widget onto the shared stylesheet. Fix the failing contrast pairs while defining the tokens (conservation badges first).
- **Actually use the shared modules**: one real autocomplete component (keyboard-accessible — arrows, Enter, Escape, proper combobox semantics) replacing 13 hand-rolled copies; `initUsername`/`initPlace`/`initLanguage` called from every page; delete the dead files.
- **States that respect the user**: welcoming empty states instead of red errors *(✅ done 2026-08-14 — `showWelcome()` in shared-utils, wired into lifelist, first-observer, first-identifier, species-observed, species-identified for the zero-observations case)*, skeletons or progress with a time hint on long loads, a retry button, dark-mode bootstrap in `<head>` to kill the white flash *(✅ done 2026-08-14 — pre-paint script on all 17 dark-mode pages; the `.dark-mode` class now lives on `<html>` with `<body>` kept in sync)*, dark mode on the widget builder.
- **Homepage re-shape**: apply the Part II consolidations, rescue brazil-states, rewrite card copy around the question each tool answers.

### Tier 2 — The "go outside" layer

*The stated mission — and mostly re-framing data the suite already computes rather than new pipelines.*

- **"Go Find This" — the flagship engagement feature.** Given your username + a place + the current month: species commonly observed there, in season now, that you've never seen — each linking to where and when people find them. SpeciesDex's Missing filter, month checkboxes, and place selection are 90% of the build; this makes that the default framing instead of an option buried under Advanced. Persistent target lists (checked off automatically as you observe) close the loop with achievements.
- **Surface the hidden forward data**: an "only species I haven't seen" filter in species-compare (instant trip planner); missing-states list + "3 states from completing the Midwest" framing on the maps; a place filter and "find one near you" links on taxonomy-completion's Not Yet taxa.
- **Achievements as quests**: a "closest to unlocking" summary at the top; locked achievements link to *where to find the missing species nearby*, not to your own observations. Add filter/sort.
- **Streak continuity**: profile already computes streaks — say "you're 2 days from your longest streak" instead of just displaying the number.
- **Identifier-side action**: species-identified knows your specialty; add "40 observations in Fungi near you need an ID right now." Private, quality-framed — squarely inside the community's taste line, and a wide-open niche.
- **Personalize project-search**: it's the only tool touching real-world community and the only one with zero personalization. "Active projects near you that you haven't joined" is the highest-value real-world CTA on iNat.

### Tier 3 — The flagship & the artifacts

*The features that make people post about the suite — built on the trust and cohesion above.*

- **All-time / custom-range "Year in Review."** The single biggest open niche: beautiful, shareable review pages for any period — new-to-me species, rarest finds, biggest day, taxonomic breadth, multi-year comparison. The loved official version is annual-only and calendar-locked; no third-party incumbent exists. A pure data-viz-craft feature.
- **Share cards everywhere**: one-click image export (profile card, achievement unlock, review page, lifelist milestone). The research is unambiguous — a stat that can leave the site is what makes tools travel. Also: per-user OG images so shared links preview richly.
- **Firsts, expanded**: place-scoped firsts (first in your county/state/country) — six years of forum demand, and the mechanic already exists here.
- **PWA done right**: precache all pages + offline fallback, proper manifest icons, drop the portrait lock, app shortcuts to the top three tools.
- **API v2 migration** with `fields=` minimal payloads — v1 sunsets in about a year; v2's field selection also makes every tool faster.

### Working rhythm

- **Post each meaningful release** in the forum's new "Third-party Tools and Apps using iNat API" category (created July 2026) — these threads already perform well, and fast author response is the strongest predictor of sustained tool love in the research.
- **Hold the taste line**: personal progress, diversity, quality, coverage — never public quantity leaderboards or head-to-head competition. Users-compare is fine (mutual, opt-in); a ranked leaderboard would not be.
- **Respect the data culture**: visible attribution, license awareness, no bulk scraping — the community is sensitive post-Google-grant, and signaling care here is part of the craft.
- **Housekeeping as you go**: README describes only SpeciesDex (stale by 15 tools) *(✅ done 2026-08-14 — rewritten to cover the full suite)*; tests cover two functions; Prettier ignores all HTML — where 90% of the code lives. Bring these along with Tier 1's restructuring rather than as a separate project.

---

## Progress log

**2026-08-14**
- **Species counts now match iNaturalist's Explore pages.** All `species_counts` calls on Profile and Field Card pass `verifiable=true`, so the threatened/endemic/introduced/native/total counts agree with the pages their stat cards link to (previously e.g. 110 vs 104 threatened for the same user). The taxon chart already used it; the suite is now internally consistent. Known remainder: Profile's total-observations card still shows `user.observations_count`, which includes casual records.
- **Exact username resolution propagated** to the five remaining fuzzy call sites (see Tier 0 above).
- **Dark-mode white flash fixed** via a pre-paint `<head>` bootstrap on all 17 pages; ~350 `body.dark-mode` selectors across six CSS files became `html.dark-mode body`. Cache-busting versions bumped on `shared-utils.js`, `dark-mode.js`, `dark-mode.css`.
- **Welcome empty states** replace the red error box for zero-observation users on five pages (`showWelcome()` in shared-utils, light + dark variants). Filtered searches keep the informative error.
- **Tree of Life rename**, **SpeciesDex card re-copy**, and **README rewrite** — see annotations above.

---

*Sources: full-suite code audit (19 HTML pages, 5 CSS, 11 JS — 11 high / 17 medium / 12 low severity findings), per-tool UX walkthrough of all 16 tools, and community research across forum.inaturalist.org tool threads, the third-party tools wiki, and the iNaturalist API documentation.*
