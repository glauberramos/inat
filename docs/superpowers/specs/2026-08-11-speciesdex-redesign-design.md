# SpeciesDex Visual Redesign — Design Spec

**Date:** 2026-08-11
**Scope:** Visual redesign of `speciesdex.html` only. Zero feature changes — every control, input, filter, and behavior keeps its current functionality and its `id`/`class` JS hooks. `script.js`/`search.js` logic is untouched except `createSpeciesCard`, which gains presentational markup (entry number, observed badge).

## Direction

**Collector's Pokédex.** Lean into the collection fantasy the product is named for: numbered dex entries, grayscale "undiscovered" cards that bloom to color on hover, vivid observed cards with a collected badge, and a scoreboard-style progress banner.

## Implementation approach

New page-specific stylesheet **`speciesdex.css`**, loaded in `speciesdex.html` after `styles.css` and `dark-mode.css`. Shared stylesheets stay loaded so autocomplete widgets, the map modal plumbing, and dark-mode infrastructure keep working; the new file overrides their look on this page only. No other page loads it, so the other ~15 pages are unaffected.

- Design tokens as CSS custom properties on a page root (e.g. `body.speciesdex-page` class added to the `<body>` tag).
- Dark mode handled inside `speciesdex.css` via `body.dark-mode` overrides of the tokens (the existing `dark-mode.js` toggle keeps working unchanged).
- Plain CSS + regular script tags only — the site is opened via `file://`; no modules, no build step. Google Fonts loaded via `<link>` (the page already uses CDNs for Leaflet/Plausible); system-font fallbacks make offline degrade gracefully.

## Design language

### Type
- **Display:** Bricolage Grotesque (Google Fonts) — wordmark, headings, species common names, section labels.
- **Numeric/mono:** Space Mono — entry numbers, observation counts, progress percentage, filter counts. Tabular feel, instrument-readout vibe.
- **Body/forms:** existing system sans stack (shared widgets already use it).

### Color tokens
Light mode:
- Background: warm off-white `#f6f7f2` with a very subtle CSS-only dot-grid/topographic tint.
- Ink: `#1d2617`; muted text: desaturated gray-green.
- **Primary: iNat green `#74ac00`** — the only primary. All blue (`#3498db`) buttons/focus rings on this page become green.
- Semantic states: observed = green; missing = neutral slate; **gold accent reserved exclusively for 100% completion**.
- Status pills keep their hues (threatened red, introduced orange, endemic green) restyled as rounded pills.

Dark mode (`body.dark-mode`):
- Deep green-black surfaces (~`#141a10` family), brightened green accent for contrast, grayscale-missing treatment tuned to stay readable.

### Shape & texture
- Cards: 14px radius, soft layered shadows.
- Form controls: one cohesive family — same height, same radius, green focus rings.
- Signature motif: monospace **entry number chip** on every card.

## Page sections

### Header / hero
- Logo + "SpeciesDex" wordmark on one line, tagline beneath; tighter than the current stacked block.
- Search row keeps the exact same controls (taxon, place + map button, limit select, username, Search, Advanced Options), restyled as one control family. Search button = solid green primary.

### Status bar → collection banner
- Wide card acting as the page scoreboard: percentage huge in mono (e.g. `47%`), "Observed 47 / 100 species · 53 still missing" beside it.
- Chunky segmented progress bar (tick per 10%), green fill, smooth width animation with a slight shimmer while moving.
- **100% state:** flips to gold with a "Complete!" flourish.
- Same DOM counters (`observedCount`, `totalCount`, `percentObserved`, `missingCount`) — presentation only.

### Species cards
- **Entry number chip** top-left of photo, mono, `#001…` numbered by rank order of the results (card index; presentational only).
- **Observed:** full-color photo, green "✓ Observed" ribbon badge (replaces the 3px border + floating circle), subtle green edge glow.
- **Missing:** photo grayscale at ~60% brightness ("Undiscovered" feel), name fully readable; on hover the photo transitions (~0.3s) to full color and the card lifts.
- **Body:** common name in Bricolage semibold; scientific name italic muted; observation count bottom-right in small mono.
- Status pills (Threatened/Introduced/Endemic) sit along the photo's bottom edge instead of the top-left corner.
- Photo: fixed aspect ratio, `object-fit: cover`, gentle zoom-on-hover inside the frame.
- Grid: same 5/4/3/2 responsive columns, 16px gaps; cards fade-and-rise in with a small stagger (CSS animation driven by a per-card `--index` custom property, no JS timing).

### Filters & advanced options
- "All / Missing / Observed" toggle and date-range presets: segmented controls with sliding-pill green active state. Filter toggle buttons additionally show counts in mono (data the status bar already computes).
- Advanced options becomes a proper card panel that slides open. Checkboxes become pill-style toggle chips (same `<input type="checkbox">` elements, visually upgraded); months = compact 12-chip row; language select and date inputs match the form family.

### Map modal, loading, feedback button
- Restyled to tokens (fonts, radii, green).
- Loading state: skeleton shimmer cards plus a small leaf/paw pulse, replacing the bare "Loading..." text. (The `#loading` element remains; skeletons are CSS on a container the existing show/hide logic already drives.)

### Mobile
- Same breakpoints as today (1200/992/768/480). Hero shrinks; banner stacks percentage above the bar; chips wrap. All current mobile layout fixes are preserved or re-implemented in the new stylesheet.

## Explicitly out of scope
- Any change to search behavior, filters, URL params, localStorage keys, download/report, map selection logic, service worker, analytics, SEO/meta tags.
- Any change to other pages or to shared `styles.css` / `dark-mode.css` contents.

## Error handling
No new failure modes: fonts fall back to system stack offline; all states (loading, empty, results) keep their existing JS triggers.

## Testing
- Existing test suite (`tests/`) must pass unchanged.
- Manual visual verification via browser: light + dark mode, observed/missing/hover card states, 0%/partial/100% banner states, mobile widths (480/768/992/1200), advanced options open/closed, map modal.
