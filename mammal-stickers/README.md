# Mammal stickers (draft)

One white-bordered sticker for each of the **100 mammal species with the most research-grade observations on iNaturalist**, with structured data: taxonomy, names in up to ~60 languages, Wikidata and GBIF IDs, body mass, IUCN status, and the reference photos each sticker is drawn from.

It follows the model of [huashu-bird-sticker](https://github.com/alchaincyf/huashu-bird-sticker), whose bird stickers power the [Bird Collage](../bird-collage.html), so the same collage can work for mammals.

> **Status: draft.** The species list, data, field-mark cards, reference boards and prompts are ready. **1 of 100 stickers is done:** the Common Raccoon (`stickers/Carnivora/Procyonidae/Procyon_lotor.webp`). The field-mark cards were written from general knowledge and have not been checked by anyone who knows these animals.

## Why these 100

On iNaturalist, mammal observations are concentrated in few species: the top 100 cover about 73% of research-grade mammal observations, and the top 500 about 94% (for birds, the top 500 cover 74%). So 100 stickers already fill most of a typical user's mammal collage, and the list can grow in order from there (`build.py --count 200`).

## What's inside

| | |
|---|---|
| `prompts/<Order>/<Family>/<Genus_species>.md` | The ready-to-use prompt for each species, with its reference photos and the review rubric |
| `stickers/<Order>/<Family>/<Genus_species>.webp` | The finished stickers (empty until they are generated): transparent WebP, white outline, 1,000 px on the long side, tagged as AI-generated in XMP metadata |
| `references/<Genus_species>/` | Hand-picked reference boards: the photos, `board.jpg` (all four in one image), `references.json` (credits and licenses) and `task.txt` (the full generation request). When a folder exists, `build.py` uses it instead of picking photos automatically |
| `data/species.json` | One record per species, the complete dataset. Fields: [data/README.md](data/README.md) |
| `data/species.csv`, `data/names.csv`, `data/stickers.json` | Flattened and index versions of the same |
| `data/field-marks.json` | The hand-written field-mark cards the prompts are built from |
| `data/review.json` | Review results of finished stickers |
| `scripts/build.py` | Fetches the list and data and writes everything in `data/` and `prompts/` |
| `scripts/finish.py` | Turns a generated image into a finished sticker and records its review |
| `docs/how-the-stickers-are-made.md` | The method: loop, poses, review rubric, what to watch for |

## Making a sticker

1. Open the species' prompt, e.g. [`prompts/Carnivora/Procyonidae/Procyon_lotor.md`](prompts/Carnivora/Procyonidae/Procyon_lotor.md).
2. Attach its reference photos and send the prompt to an image model that takes reference images.
3. Review the result with the rubric at the bottom of the prompt; if it fails, add the reviewer's corrections and generate again.
4. Finish it:

   ```bash
   python3 mammal-stickers/scripts/finish.py ~/Downloads/raccoon.png Procyon_lotor --score 90 --pass
   python3 mammal-stickers/scripts/build.py
   ```

Details in [docs/how-the-stickers-are-made.md](docs/how-the-stickers-are-made.md).

## Rebuilding the data

```bash
python3 mammal-stickers/scripts/build.py            # uses the cache in mammal-stickers/.cache
python3 mammal-stickers/scripts/build.py --refresh  # fetch everything again
python3 mammal-stickers/scripts/build.py --count 200
```

Species without a card in `data/field-marks.json` get data but no prompt; the script lists them.

## License and credits

Stickers CC BY 4.0, data and scripts MIT; see [LICENSE.md](LICENSE.md). Taxonomy and names from iNaturalist, IDs from Wikidata (CC0), body mass from EltonTraits 1.0 (CC0), reference photos by the iNaturalist photographers credited per species, method adapted from huashu-bird-sticker; see [NOTICE.md](NOTICE.md).
