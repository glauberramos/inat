#!/usr/bin/env python3
"""Build the mammal sticker draft: species list, data files and one image prompt per species.

Picks the N mammal species with the most research-grade observations on iNaturalist, then for each:
  - taxonomy, names in every language iNat has, IUCN status        (iNaturalist API)
  - Wikidata and GBIF IDs                                            (Wikidata, CC0)
  - body mass                                                        (EltonTraits 1.0, CC0)
  - a reference board of up to 4 photos, each CC0 / CC BY / CC BY-SA, from different observers (iNat)
and joins them with the hand-written cards in data/field-marks.json to write:
  data/species.json, data/species.csv, data/names.csv, data/stickers.json,
  prompts/<Order>/<Family>/<Genus_species>.md

API responses are cached in .cache/ so a re-run is cheap; pass --refresh to fetch again.
Requires: Python 3.9+, no packages.
Usage:    python3 mammal-stickers/scripts/build.py [--count 100] [--refresh]
"""
import argparse
import csv
import hashlib
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
PROMPTS = ROOT / "prompts"
CACHE = ROOT / ".cache"
REFERENCES = ROOT / "references"  # hand-picked boards, one folder per species
INAT = "https://api.inaturalist.org/v1"
MAMMALIA = 40151
ELTON_URL = "https://ndownloader.figshare.com/files/5631084"  # EltonTraits 1.0 MamFuncDat.txt, CC0
UA = "inat-tools mammal-stickers build script"
VERSION = "0.1.0-draft"
REF_LICENSES = "cc0,cc-by,cc-by-sa"  # photo licenses that allow reuse and adaptation, including commercial
REF_PHOTOS = 4

# EltonTraits follows Mammal Species of the World 3 (2005). Where iNat's current name differs, the
# MSW3 name it maps to. Species split since 2005 take the mass of the species they were split from.
ELTON_ALIASES = {
    "Otospermophilus beecheyi": "Spermophilus beecheyi",
    "Otospermophilus variegatus": "Spermophilus variegatus",
    "Callospermophilus lateralis": "Spermophilus lateralis",
    "Cervus canadensis": "Cervus elaphus",  # MSW3 lumped wapiti into red deer
    "Dasypus mexicanus": "Dasypus novemcinctus",  # split 2023
    "Neogale vison": "Neovison vison",
    "Bos bison": "Bison bison",
    "Giraffa giraffa": "Giraffa camelopardalis",  # split 2016
    "Notamacropus rufogriseus": "Macropus rufogriseus",
    "Cebus imitator": "Cebus capucinus",  # split 2013
    "Canis familiaris": "Canis lupus",
    "Equus caballus": "Equus caballus",
    "Erinaceus roumanicus": "Erinaceus concolor",  # split from E. concolor
    "Macaca fascicularis": "Macaca fascicularis",
}

# Pose rules, the mammal version of the bird repo's standard poses. canvas: width x height.
POSES = {
    "standing": {
        "canvas": "1536x1024 landscape",
        "text": "standing, side view: all four legs visible, near and far legs slightly apart; all four feet "
        "flat on an invisible horizontal ground line, soles at the same height; head held at its natural "
        "height; tail in its natural relaxed carry for this species; no ground, grass, rock or snow drawn.",
    },
    "upright-kangaroo": {
        "canvas": "1024x1536 portrait",
        "text": "resting upright on its long hind feet, side view: hind feet flat on an invisible horizontal "
        "ground line, the tail lying along that line behind it so feet and tail form a tripod; forearms held "
        "loosely in front of the chest; no ground drawn.",
    },
    "walking-primate": {
        "canvas": "1536x1024 landscape",
        "text": "walking on all fours, side view: both hands and both feet flat on an invisible horizontal "
        "ground line; tail in its natural carry for this species; no branch or ground drawn.",
    },
    "swimming": {
        "canvas": "1536x1024 landscape",
        "text": "swimming, seen exactly from the side: body horizontal and straight, mouth closed, flippers "
        "relaxed, tail flukes horizontal and seen edge-on; no water, splash, bubbles or light rays drawn.",
    },
    "hauled-out-seal": {
        "canvas": "1536x1024 landscape",
        "text": "lying on its belly, side view, on an invisible horizontal ground line; head and chest raised "
        "on the front flippers; hind flippers together behind; no rock, sand or water drawn.",
    },
    "upright-sea-lion": {
        "canvas": "1536x1024 landscape",
        "text": "propped upright on its front flippers, side view, on an invisible horizontal ground line; "
        "head raised; hind flippers turned forward under the body; no rock or water drawn.",
    },
    "floating-back": {
        "canvas": "1536x1024 landscape",
        "text": "floating on its back, seen from the side: head raised and turned toward the viewer, front "
        "paws resting on the chest, hind feet raised at the far end; no water drawn.",
    },
    "hanging": {
        "canvas": "1536x1024 landscape",
        "text": "hanging below one short, straight, horizontal branch by all four limbs, back toward the "
        "ground, head turned toward the viewer; draw only that plain bare branch, cut off cleanly at both "
        "ends just beyond the hands and feet; no leaves.",
    },
    "clinging-trunk": {
        "canvas": "1024x1536 portrait",
        "text": "clinging to a short upright section of a smooth tree trunk, side view, head turned toward "
        "the viewer; draw only that plain trunk section, cut off flat at the top and bottom; no leaves.",
    },
}
TALL = {"Giraffa giraffa"}  # standing, but needs a portrait canvas


def fetch(url, refresh=False, binary=False):
    CACHE.mkdir(exist_ok=True)
    path = CACHE / hashlib.sha1(url.encode()).hexdigest()
    if path.exists() and not refresh:
        data = path.read_bytes()
    else:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    data = r.read()
                break
            except Exception:  # noqa: BLE001 - retry any network error, then give up
                if attempt == 3:
                    raise
                time.sleep(5 * (attempt + 1))
        path.write_bytes(data)
        if "api.inaturalist.org" in url or "wikidata.org" in url:
            time.sleep(1.1)  # iNat asks for about one API request a second; photo files are static
    return data if binary else json.loads(data)


def top_species(count, refresh):
    q = urllib.parse.urlencode({"taxon_id": MAMMALIA, "quality_grade": "research", "per_page": count})
    rows = fetch(f"{INAT}/observations/species_counts?{q}", refresh)["results"]
    return [(r["taxon"]["id"], r["count"]) for r in rows if r["taxon"]["rank"] == "species"][:count]


def taxa_details(ids, refresh):
    out = {}
    for i in range(0, len(ids), 30):
        batch = ",".join(str(x) for x in ids[i : i + 30])
        for t in fetch(f"{INAT}/taxa/{batch}?all_names=true", refresh)["results"]:
            out[t["id"]] = t
    return out


def names_by_locale(taxon):
    names = {}
    for n in sorted(taxon.get("names") or [], key=lambda n: n.get("position", 0)):
        loc = n.get("locale")
        if not n.get("is_valid") or loc in (None, "sci", "und") or loc in names:
            continue
        names[loc] = n["name"]
    if taxon.get("preferred_common_name"):
        names["en"] = taxon["preferred_common_name"]
    return dict(sorted(names.items(), key=lambda kv: (kv[0] != "en", kv[0])))


def iucn_status(taxon):
    for s in taxon.get("conservation_statuses") or []:
        if s.get("place") is None and "iucn" in (s.get("authority") or "").lower():
            return s.get("status", "").upper()
    s = taxon.get("conservation_status")
    if s and s.get("place") is None:
        return (s.get("status") or "").upper()
    return None


def wikidata_ids(inat_ids, refresh):
    values = " ".join(f'"{i}"' for i in inat_ids)
    query = (
        "SELECT ?inat ?item ?gbif WHERE { VALUES ?inat {" + values + "} ?item wdt:P3151 ?inat. "
        "OPTIONAL { ?item wdt:P846 ?gbif } }"
    )
    url = "https://query.wikidata.org/sparql?" + urllib.parse.urlencode({"format": "json", "query": query})
    out = {}
    for b in fetch(url, refresh)["results"]["bindings"]:
        inat = int(b["inat"]["value"])
        out.setdefault(inat, {"wikidata": b["item"]["value"].rsplit("/", 1)[1], "gbif": b.get("gbif", {}).get("value")})
    return out


def elton_masses(refresh):
    text = fetch(ELTON_URL, refresh, binary=True).decode("latin-1")
    rows = list(csv.DictReader(text.splitlines(), delimiter="\t"))
    return {r["Scientific"]: float(r["BodyMass-Value"]) for r in rows if r.get("BodyMass-Value")}


# iNat annotation value IDs (GET /v1/controlled_terms). A reference must show a live animal, not
# tracks, scat or bones, and not a juvenile; where the card draws a male, annotated females are
# skipped and annotated males come first.
SKIP_VALUES = {19, 25, 26, 27, 28, 31, 35, 8}  # dead, scat, track, bone, molt, hair, construction, juvenile
MALE, FEMALE = 11, 10


def looks_like_colour_photo(photo, refresh):
    """Reject GIFs and near-greyscale images (mostly night trail-camera shots). Needs Pillow; without
    it every JPEG/PNG passes."""
    url = photo["url"]
    if not url.lower().split("?")[0].endswith((".jpg", ".jpeg", ".png")):
        return False
    try:
        import io

        from PIL import Image
    except ImportError:
        return True
    im = Image.open(io.BytesIO(fetch(url.replace("/square.", "/small."), refresh, binary=True)))
    sat = im.convert("RGB").resize((64, 64)).convert("HSV").getchannel("S")
    return sum(sat.tobytes()) / (64 * 64 * 255) > 0.08


def author_of(photo, fallback):
    name = (photo.get("attribution_name") or "").strip()
    if name:
        return name
    m = re.match(r"\(c\)\s*(.+?)\s*, (some|all|no) rights", photo.get("attribution") or "", re.S)
    return m.group(1) if m else fallback or "unknown"


def reference_board(taxon, wants_male, refresh):
    """Up to REF_PHOTOS reusable photos by different people: the curated photos on the taxon's iNat page
    first, then the most-faved research-grade observations."""
    allowed = set(REF_LICENSES.split(","))
    candidates = [
        (tp["photo"], f"https://www.inaturalist.org/photos/{tp['photo']['id']}", author_of(tp["photo"], None))
        for tp in taxon.get("taxon_photos") or []
    ]
    base = {
        "taxon_id": taxon["id"],
        "quality_grade": "research",
        "photo_license": REF_LICENSES,
        "order_by": "votes",
        "per_page": 50,
    }
    # Observations annotated "Life Stage: Adult" first (term 1, value 2): votes alone let in fawns,
    # pups and nests of babies. Unannotated ones only fill the board if the adults run out.
    results = fetch(f"{INAT}/observations?{urllib.parse.urlencode({**base, 'term_id': 1, 'term_value_id': 2})}", refresh)
    results = results["results"] + fetch(f"{INAT}/observations?{urllib.parse.urlencode(base)}", refresh)["results"]
    observations = []
    for obs in results:
        values = {a.get("controlled_value_id") for a in obs.get("annotations") or []}
        if values & SKIP_VALUES or (wants_male and FEMALE in values):
            continue
        observations.append(((MALE not in values) if wants_male else False, obs))
    observations.sort(key=lambda pair: pair[0])  # stable: annotated males first, then adults, then the rest
    for _, obs in observations:
        page = f"https://www.inaturalist.org/observations/{obs['id']}"
        name = obs["user"].get("name") or obs["user"]["login"]
        candidates += [(p, page, author_of(p, name)) for p in obs.get("photos", [])[:1]]

    items, authors, seen = [], set(), set()
    for photo, page, author in candidates:
        if photo.get("license_code") not in allowed or photo["id"] in seen or author in authors:
            continue
        seen.add(photo["id"])
        if not looks_like_colour_photo(photo, refresh):
            continue
        authors.add(author)
        items.append(
            {
                "page": page,
                "image": re.sub(r"/(square|medium|small|original)\.", "/large.", photo["url"]),
                "author": author,
                "license": photo["license_code"].upper().replace("CC-", "CC "),
                "attribution": photo.get("attribution"),
            }
        )
        if len(items) == REF_PHOTOS:
            break
    if not items:
        return None
    return {"type": "board", "items": items} if len(items) > 1 else {"type": "photo", **items[0]}


def ancestor(taxon, rank):
    return next((a["name"] for a in taxon.get("ancestors", []) if a["rank"] == rank), None)


def render_prompt(rec, card, similar_name):
    pose = POSES[card["pose"]]
    canvas = "1024x1536 portrait" if rec["scientificName"] in TALL else pose["canvas"]
    sim = f"{similar_name}, {card['similar']}" if similar_name else card["similar"]
    return f"""# {rec['names']['en']} · *{rec['scientificName']}*

`{rec['taxonomy']['order']} / {rec['taxonomy']['family']}` · sticker: `{rec['sticker']['file']}`

Attach the reference photos listed below as image 1 (one image, or a board of several).

```
TAIL: draw the whole tail at its true length and shape for this species. The canvas
has room on purpose: never shorten, curl or crop the tail, ears, horns or antlers to
make them fit.

Image 1: reference photos of this species (several may be combined). Use them only
to check coat colour, markings, head, ears, horns or antlers, legs, feet, tail and
proportions; pose and angle follow the written rules, don't copy the photos; don't
draw watermarks, text, collars, tags or people from the photos.

{canvas} canvas. Draw only one animal, complete and centred, with space all around;
nose, ears, feet and tail tip inside the frame. The whole background flat light grey
#D9D9D9, no shadow; no white outline or sticker border around the animal. Realistic
photographic look, crisp fur, like a standard image in an authoritative field guide;
not an illustration, not a cartoon. Rules: head toward the left of the frame, camera
at the animal's eye level, body turned slightly toward the viewer, about 15 degrees;
head in profile or three-quarter view, with the eye, ears and muzzle fully visible;
mouth closed. Fur lies naturally and follows the body; don't add grid, scale or
ring textures the species doesn't have; spots and stripes vary naturally in size and spacing like on a real
animal, never in neat dot grids or a checkerboard.

This animal: {rec['names']['en']}, {rec['scientificName']}. Draw the {card['draw']}.
Pose: {pose['text']}
Key points: {card['marks']}.
Difference from the most similar species (must be shown): {card['difference']}
(most similar: {sim}).
```

## References

{reference_lines(rec['sticker']['reference'])}

## Review

Score 0–4 on each: identification, coat and markings, head (eyes, ears, muzzle,
horns or antlers), legs, feet and tail, proportions. Passes only if every score is
at least 3, identification is 4, and it would work as this species' plate in a field
guide. If it fails, write 1–3 corrections as sentences that can go straight into the
prompt (e.g. "tail about a third of the body length, held low"), add them under
"Corrections (these win over anything above):" and generate again.
"""


def curated_board(stem):
    """A board picked by hand, in references/<Genus_species>/references.json, wins over the automatic one."""
    path = REFERENCES / stem / "references.json"
    if not path.exists():
        return None
    meta = json.loads(path.read_text())
    items = [{**i, "file": f"references/{stem}/{i['file']}"} for i in meta["items"]]
    board = REFERENCES / stem / "board.jpg"
    return {
        "type": "board",
        "curated": True,
        **({"board": f"references/{stem}/board.jpg"} if board.exists() else {}),
        "items": items,
    }


def reference_lines(ref):
    if not ref:
        return "None found with a reusable license. Generate from the description alone, or pick a photo by hand."
    items = ref["items"] if ref["type"] == "board" else [ref]
    lines = []
    if ref.get("curated"):
        where = f"`{ref['board']}` (all four in one image)" if ref.get("board") else "the files below"
        lines.append(f"Picked by hand; attach {where}.\n")
    lines += [f"- [{i['author']}]({i['page']}), {i['license']} · [image]({i['image']})" for i in items]
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--count", type=int, default=100)
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()

    cards = json.loads((DATA / "field-marks.json").read_text())
    top = top_species(args.count, args.refresh)
    ids = [tid for tid, _ in top]
    taxa = taxa_details(ids, args.refresh)
    wd = wikidata_ids(ids, args.refresh)
    masses = elton_masses(args.refresh)
    review_path = DATA / "review.json"  # written by scripts/finish.py
    reviews = json.loads(review_path.read_text()) if review_path.exists() else {}
    english = {}

    records, missing_cards, missing_mass = [], [], []
    for rank, (tid, obs_count) in enumerate(top, 1):
        t = taxa[tid]
        name = t["name"]
        english[name] = t.get("preferred_common_name")
        order, family, genus = ancestor(t, "order"), ancestor(t, "family"), ancestor(t, "genus")
        stem = name.replace(" ", "_")
        elton_name = ELTON_ALIASES.get(name, name)
        mass = masses.get(elton_name)
        if mass is None:
            missing_mass.append(name)
        card = cards.get(name)
        if card is None:
            missing_cards.append(name)
        print(f"{rank:3} {name}: references…", flush=True)
        records.append(
            {
                "id": stem,
                "rank": rank,
                "scientificName": name,
                "taxonomy": {"system": "iNaturalist", "order": order, "family": family, "genus": genus},
                "names": names_by_locale(t),
                "ids": {"inaturalist": tid, **wd.get(tid, {})},
                "inaturalist": {"researchGradeObservations": obs_count, "wikipedia": t.get("wikipedia_url")},
                "traits": {
                    "massG": mass,
                    "source": {"dataset": "EltonTraits 1.0", "name": elton_name} if mass is not None else None,
                },
                "conservation": {"iucn": iucn_status(t)},
                "fieldMarks": card,
                "sticker": {
                    "file": f"stickers/{order}/{family}/{stem}.webp",
                    "status": "pending",
                    "kind": "ai-illustration",
                    "reviewScore": None,
                    "meetsQualityBar": False,
                    "license": "CC-BY-4.0",
                    **reviews.get(stem, {}),
                    "reference": curated_board(stem)
                    or reference_board(t, bool(re.search(r"\bmale\b", (card or {}).get("draw", ""))), args.refresh),
                },
            }
        )

    for rec in records:
        card = rec["fieldMarks"]
        if not card:
            continue
        path = PROMPTS / rec["taxonomy"]["order"] / rec["taxonomy"]["family"] / f"{rec['id']}.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(render_prompt(rec, card, english.get(card["similar"])))

    meta = {"version": VERSION, "taxonomy": "iNaturalist", "count": len(records), "built": time.strftime("%Y-%m-%d")}
    (DATA / "species.json").write_text(json.dumps({**meta, "species": records}, ensure_ascii=False, indent=1) + "\n")

    index = [
        {
            "id": r["id"],
            "scientificName": r["scientificName"],
            "en": r["names"].get("en"),
            "inaturalist": r["ids"]["inaturalist"],
            "massG": r["traits"]["massG"],
            "file": r["sticker"]["file"],
            "status": r["sticker"]["status"],
        }
        for r in records
    ]
    (DATA / "stickers.json").write_text(json.dumps({**meta, "stickers": index}, ensure_ascii=False) + "\n")

    with open(DATA / "species.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(
            ["rank", "id", "order", "family", "scientific_name", "name_en", "inaturalist", "wikidata", "gbif",
             "rg_observations", "mass_g", "iucn", "pose", "sticker_file", "sticker_status", "reference_type",
             "reference_pages", "reference_authors", "reference_licenses"]
        )
        for r in records:
            ref = r["sticker"]["reference"]
            items = (ref["items"] if ref["type"] == "board" else [ref]) if ref else []
            w.writerow(
                [r["rank"], r["id"], r["taxonomy"]["order"], r["taxonomy"]["family"], r["scientificName"],
                 r["names"].get("en"), r["ids"]["inaturalist"], r["ids"].get("wikidata"), r["ids"].get("gbif"),
                 r["inaturalist"]["researchGradeObservations"], r["traits"]["massG"], r["conservation"]["iucn"],
                 (r["fieldMarks"] or {}).get("pose"), r["sticker"]["file"], r["sticker"]["status"],
                 ref["type"] if ref else "", "|".join(i["page"] for i in items),
                 "|".join(i["author"] for i in items), "|".join(i["license"] for i in items)]
            )

    locales = sorted({loc for r in records for loc in r["names"]}, key=lambda x: (x != "en", x))
    with open(DATA / "names.csv", "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["id", "scientific_name", *locales])
        for r in records:
            w.writerow([r["id"], r["scientificName"], *[r["names"].get(loc, "") for loc in locales]])

    print(f"\n{len(records)} species, {len(locales)} name locales")
    print("no field-mark card:", missing_cards or "none")
    print("no EltonTraits mass:", missing_mass or "none")
    print("no reusable reference photo:", [r["scientificName"] for r in records if not r["sticker"]["reference"]] or "none")


if __name__ == "__main__":
    main()
