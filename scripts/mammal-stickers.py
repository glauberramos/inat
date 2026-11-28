#!/usr/bin/env python3
"""Build mammal-stickers-data.js, the mammal sticker index behind sticker-collage.html.

The stickers are mammal-stickers (https://github.com/glauberramos/mammal-stickers, CC BY 4.0): one
AI-illustrated sticker for each of the mammals with the most research-grade observations on iNaturalist,
about 1,000 px on the long side. This keeps, for each finished sticker, what the collage needs: its file,
order, family, body mass (EltonTraits) and IUCN status. Species still waiting for a sticker are left out.
Taxonomy is iNaturalist's, so the collage matches names without aliases. English family names come from
iNaturalist.

The repository has no release tags yet, so the index pins a commit (REF): jsDelivr caches it for good.

Usage:    python3 scripts/mammal-stickers.py [species.json]
          (without a path, downloads data/species.json at REF)
"""
import json
import pathlib
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPO = "glauberramos/mammal-stickers"
REF = "d22f444d02f0dea94b7d6e2cb814b833a2a184a4"
SOURCE = f"https://raw.githubusercontent.com/{REPO}/{REF}/data/species.json"
FAMILIES = "https://api.inaturalist.org/v1/taxa?taxon_id=40151&rank=family&per_page=200&is_active=true"
IUCN = ["", "LC", "NT", "VU", "EN", "CR", "EW", "EX", "DD"]
# iNaturalist lists a few statuses in words, from regional authorities.
IUCN_WORDS = {"VULNERABLE": "VU", "ENDANGERED": "EN", "CRITICALLY ENDANGERED": "CR"}
# Families iNaturalist has no English name for.
FAMILY_NAMES = {"Chlamyphoridae": "Armadillos", "Euphractidae": "Armadillos", "Tolypeutidae": "Armadillos"}


def fetch_json(url):
    request = urllib.request.Request(url, headers={"User-Agent": "inat-tools sticker index builder"})
    with urllib.request.urlopen(request) as response:
        return json.loads(response.read())


def load(argv):
    if len(argv) > 1:
        return json.loads(pathlib.Path(argv[1]).read_text())
    return fetch_json(SOURCE)


def main(argv):
    data = load(argv)
    species = data["species"] if isinstance(data, dict) else data
    english = {t["name"]: t.get("preferred_common_name") for t in fetch_json(FAMILIES)["results"]}
    families, rows = [], []

    def index_of(items, value):
        if value not in items:
            items.append(value)
        return items.index(value)

    for sp in species:
        sticker = sp.get("sticker") or {}
        if not sticker.get("file") or sticker.get("status") == "pending":
            continue
        tax = sp["taxonomy"]
        family_english = english.get(tax["family"]) or FAMILY_NAMES.get(tax["family"]) or tax["family"]
        family = index_of(families, [tax["order"], tax["family"], family_english])
        mass = round((sp.get("traits") or {}).get("massG") or 0, 1)
        iucn = (sp.get("conservation") or {}).get("iucn") or ""
        iucn = IUCN_WORDS.get(iucn.upper(), iucn)
        stem = sticker["file"].rsplit("/", 1)[1].removesuffix(".webp")
        rows.append(
            "|".join(
                [stem, str(family), ("%g" % mass) if mass else "", str(IUCN.index(iucn)) if iucn in IUCN else "0"]
            )
        )

    out = ROOT / "mammal-stickers-data.js"
    out.write_text(
        "// Mammal sticker index for sticker-collage.html, built by scripts/mammal-stickers.py. Do not edit by hand.\n"
        f"// Stickers: mammal-stickers @{REF[:7]} (https://github.com/{REPO}), CC BY 4.0,\n"
        "// AI-generated illustrations. Body mass from EltonTraits 1.0, status and family names from iNaturalist.\n"
        "// rows: 'file stem|family index|mass in grams|IUCN index'; families: [order, family, English name].\n"
        "const MAMMAL_STICKERS = "
        + json.dumps(
            {"repo": REPO, "tag": REF, "iucn": IUCN, "families": families, "rows": ";".join(rows), "aliases": {}},
            ensure_ascii=False,
            separators=(",", ":"),
        )
        + ";\n"
    )
    print(f"{len(rows)} stickers, {len(families)} families -> {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main(sys.argv)
