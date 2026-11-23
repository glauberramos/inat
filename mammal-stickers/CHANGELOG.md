# Changelog

## 0.1.0-draft (2026-11-22)

- First draft: the 100 mammal species with the most research-grade iNaturalist observations.
- Data: taxonomy and names (iNaturalist), Wikidata and GBIF IDs, body mass (EltonTraits 1.0), IUCN status.
- Field-mark cards for all 100 species (unreviewed), reference boards of up to four CC0 / CC BY / CC BY-SA photos each, and one prompt per species.
- Scripts: `build.py` (data and prompts) and `finish.py` (cut-out, outline, metadata, review record).
- First sticker: Common Raccoon, from a hand-picked reference board (`references/Procyon_lotor/`), review score 95.
- `build.py` uses hand-picked boards in `references/<Genus_species>/` when they exist.
