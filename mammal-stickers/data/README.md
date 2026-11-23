# Data

`species.json` is the complete dataset, one record per species, in order of research-grade observations on iNaturalist (most first). Every file here except `field-marks.json` and `review.json` is written by `scripts/build.py`; edit those two and rebuild.

| File | Contents | Edited by |
|---|---|---|
| `species.json` | Everything below | build.py |
| `species.csv` | Taxonomy, main IDs, mass, status, pose, sticker and reference columns, flattened for spreadsheets (a board's pages, authors and licenses are joined with `\|`) | build.py |
| `names.csv` | Common names in every language iNaturalist has, one column per locale | build.py |
| `stickers.json` | Small index for web pages: names, iNat ID, mass, sticker path and status | build.py |
| `field-marks.json` | The field-mark card for each species: pose, what to draw, key marks, the look-alike and how it differs. **Draft, unreviewed** | by hand |
| `review.json` | Review results of finished stickers | scripts/finish.py |

## Fields in `species.json`

| Field | What it is | Source |
|---|---|---|
| `id` | `Genus_species`, used for file names | iNaturalist name |
| `rank` | Position by research-grade observations | iNaturalist |
| `scientificName` | | iNaturalist |
| `taxonomy` | Order, family, genus | iNaturalist |
| `names` | Common names keyed by iNaturalist locale; `en` is iNaturalist's preferred English name | iNaturalist |
| `ids` | iNaturalist taxon ID, Wikidata QID, GBIF key | iNaturalist; Wikidata |
| `inaturalist` | Research-grade observation count when built; English Wikipedia link | iNaturalist |
| `traits.massG` | Adult body mass in grams; `source.name` is the EltonTraits name it was taken from | EltonTraits 1.0 |
| `conservation.iucn` | Global IUCN Red List category as listed on iNaturalist; `null` for domestic animals and for taxa IUCN assesses under another name (e.g. *Giraffa giraffa*) | iNaturalist |
| `fieldMarks` | The card from `field-marks.json` | this project |
| `sticker` | Planned file path, status (`pending` → `draft` → `approved`), review score and quality-bar flag, license, and the reference board it is drawn from | this project |

## Notes

- Domestic cat, dog and horse are in the list because their feral and free-roaming observations reach research grade on iNaturalist.
- Taxonomy is iNaturalist's, so names match what the collage gets from the iNaturalist API without aliases. Where EltonTraits uses an older name, the mapping is in `ELTON_ALIASES` in `scripts/build.py`.
- `rank` and observation counts change as iNaturalist grows. Re-running `build.py --refresh` may change the top 100; finished stickers keep their files, and a species that drops out keeps its record in `review.json`.
