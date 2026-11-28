#!/usr/bin/env python3
"""Build bird-stickers-data.js, the bird sticker index behind sticker-collage.html.

The stickers are huashu-bird-sticker (https://github.com/alchaincyf/huashu-bird-sticker, CC BY 4.0):
one AI-illustrated sticker per species in AviList v2026, about 1,000 px on the long side. This keeps,
for each sticker, what the collage needs: its file, order, family, body mass (AVONET) and IUCN status.
iNaturalist names birds differently from AviList now and then, so every older name the dataset lists
(IOC 15.2, lumps, former species now subspecies) is kept as an alias; a former species that has its own
sticker (Anas carolinensis) points to that sticker.

Usage:    python3 scripts/bird-stickers.py [species.json]
          (without a path, downloads data/species.json at TAG)
"""
import json
import pathlib
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPO = "alchaincyf/huashu-bird-sticker"
TAG = "v2.3.1"
SOURCE = f"https://raw.githubusercontent.com/{REPO}/{TAG}/data/species.json"
IUCN = ["", "LC", "NT", "VU", "EN", "CR", "EW", "EX", "DD"]


def load(argv):
    if len(argv) > 1:
        return json.loads(pathlib.Path(argv[1]).read_text())
    with urllib.request.urlopen(SOURCE) as response:
        return json.loads(response.read())


def stem(sticker_file):
    return sticker_file.rsplit("/", 1)[1].removesuffix(".webp")


def main(argv):
    data = load(argv)
    species = data["species"] if isinstance(data, dict) else data
    orders, families, rows, aliases = [], [], [], {}

    def index_of(items, value):
        if value not in items:
            items.append(value)
        return items.index(value)

    def add(name, row):
        if name and name not in aliases:
            aliases[name] = row

    def add_row(sp, sticker_file):
        tax = sp["taxonomy"]
        family = index_of(families, [tax["order"], tax["family"], tax.get("familyEnglish") or tax["family"]])
        mass = round((sp.get("traits") or {}).get("massG") or 0, 1)
        iucn = (sp.get("conservation") or {}).get("iucn") or ""
        rows.append(
            "|".join(
                [
                    stem(sticker_file),
                    str(family),
                    ("%g" % mass) if mass else "",
                    str(IUCN.index(iucn)) if iucn in IUCN else "0",
                ]
            )
        )
        return len(rows) - 1

    for sp in species:
        if not (sp.get("sticker") or {}).get("file"):
            continue
        index_of(orders, sp["taxonomy"]["order"])
        main_row = add_row(sp, sp["sticker"]["file"])
        # Names whose sticker is not the species' own: former species with a sticker of their own.
        for form in sp.get("forms") or []:
            if not (form.get("sticker") or {}).get("file"):
                continue
            form_row = add_row(sp, form["sticker"]["file"])
            add(form.get("taxon"), form_row)
            add((form.get("formerSpecies") or {}).get("scientificName"), form_row)
        add(sp["scientificName"], main_row)
        for prev in sp.get("previous") or []:
            add(prev.get("scientificName"), main_row)

    # The page derives the scientific name from the file stem; only list the names it can't derive.
    derived = {rows[i].split("|", 1)[0].replace("_", " ").replace(".", " "): i for i in range(len(rows))}
    extra = {name: row for name, row in aliases.items() if derived.get(name) != row}

    out = ROOT / "bird-stickers-data.js"
    out.write_text(
        "// Bird sticker index for sticker-collage.html, built by scripts/bird-stickers.py. Do not edit by hand.\n"
        f"// Stickers: huashu-bird-sticker {TAG} (https://github.com/alchaincyf/huashu-bird-sticker), CC BY 4.0,\n"
        "// AI-generated illustrations. Body mass from AVONET, status from AviList v2026 (BirdLife).\n"
        "// rows: 'file stem|family index|mass in grams|IUCN index'; families: [order, family, English name].\n"
        "// aliases: scientific names (older or iNaturalist ones) that don't follow from a row's file stem.\n"
        "const BIRD_STICKERS = "
        + json.dumps(
            {
                "repo": REPO,
                "tag": TAG,
                "iucn": IUCN,
                "families": families,
                "rows": ";".join(rows),
                "aliases": extra,
            },
            ensure_ascii=False,
            separators=(",", ":"),
        )
        + ";\n"
    )
    print(f"{len(rows)} stickers, {len(families)} families, {len(extra)} aliases -> {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main(sys.argv)
