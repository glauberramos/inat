#!/usr/bin/env python3
"""Turn a generated image into a finished sticker and record its review.

Takes the image the model produced (one animal on flat #D9D9D9 grey, as the prompts ask), and:
  1. cuts the animal out: removes the grey that touches the image edge, so grey fur inside the
     animal is kept;
  2. adds a white sticker outline, trims, and scales to 1,000 px on the long side;
  3. saves stickers/<Order>/<Family>/<Genus_species>.webp with XMP metadata saying it is an
     AI-generated illustration (IPTC Digital Source Type trainedAlgorithmicMedia);
  4. records the review in data/review.json, which build.py merges into the data files.

Requires: numpy, Pillow.
Usage:    python3 mammal-stickers/scripts/finish.py <generated.png> <Genus_species> --score 88 --pass \
              [--model "gpt-image-1"] [--note "passed on round 2"]
          Leave out --pass for a sticker that has not met the quality bar yet.
"""
import argparse
import datetime
import json
import pathlib

import numpy as np
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
BACKGROUND = np.array([0xD9, 0xD9, 0xD9], float)
TOLERANCE = 18  # max RGB distance from the background grey that still counts as background
LONG_SIDE = 1000
OUTLINE = 0.018  # white outline width, as a share of the long side
REPO = "https://github.com/glauberramos/inat/tree/main/mammal-stickers"

XMP = """<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
 xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
<Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia</Iptc4xmpExt:DigitalSourceType>
<dc:title><rdf:Alt><rdf:li xml:lang="x-default">{title}</rdf:li></rdf:Alt></dc:title>
<dc:description><rdf:Alt><rdf:li xml:lang="x-default">AI-generated illustration of {title}, not a photograph. Made with {model}. Not verified by experts; may contain errors.</rdf:li></rdf:Alt></dc:description>
<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">CC BY 4.0, mammal-stickers, {repo}</rdf:li></rdf:Alt></dc:rights>
<xmpRights:WebStatement>{repo}</xmpRights:WebStatement>
</rdf:Description></rdf:RDF></x:xmpmeta>"""


def cut_out(img):
    """Alpha mask: background is the grey region connected to the image border."""
    rgb = np.asarray(img.convert("RGB"), float)
    near = np.linalg.norm(rgb - BACKGROUND, axis=2) < TOLERANCE
    bg = np.zeros_like(near)
    bg[0, :], bg[-1, :], bg[:, 0], bg[:, -1] = near[0, :], near[-1, :], near[:, 0], near[:, -1]
    while True:  # grow the border region through near-grey pixels until it stops changing
        grown = bg.copy()
        grown[1:, :] |= bg[:-1, :]
        grown[:-1, :] |= bg[1:, :]
        grown[:, 1:] |= bg[:, :-1]
        grown[:, :-1] |= bg[:, 1:]
        grown &= near
        if (grown == bg).all():
            break
        bg = grown
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    # Pull the edge in by a pixel and soften it, so no grey fringe is left around the fur.
    return alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))


def sticker(img):
    alpha = cut_out(img)
    animal = img.convert("RGBA")
    animal.putalpha(alpha)
    box = alpha.point(lambda a: 255 if a > 8 else 0).getbbox()
    if not box:
        raise SystemExit("Nothing left after removing the background: is it flat #D9D9D9 grey?")
    animal = animal.crop(box)
    pad = round(LONG_SIDE * OUTLINE) + 4
    # Work at the final scale so the outline width is the same on every sticker.
    inner = LONG_SIDE - 2 * pad
    scale = inner / max(animal.size)
    animal = animal.resize((max(1, round(animal.width * scale)), max(1, round(animal.height * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (animal.width + 2 * pad, animal.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(animal, (pad, pad), animal)
    a = canvas.getchannel("A").point(lambda v: 255 if v > 40 else 0)
    width = round(LONG_SIDE * OUTLINE)
    for _ in range(width):  # grow the silhouette one pixel at a time: a round outline
        a = a.filter(ImageFilter.MaxFilter(3))
    # Blur and re-threshold, so the outline rounds over stray hairs instead of tracing each one.
    a = a.filter(ImageFilter.GaussianBlur(width * 0.6)).point(lambda v: 255 if v > 100 else 0)
    outline = Image.new("RGBA", canvas.size, (255, 255, 255, 0))
    outline.putalpha(a.filter(ImageFilter.GaussianBlur(0.7)))
    return Image.alpha_composite(outline, canvas)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image")
    ap.add_argument("id", help="Genus_species, as in data/species.json")
    ap.add_argument("--score", type=int, required=True, help="review score, 0-100")
    ap.add_argument("--pass", dest="passed", action="store_true", help="meets the quality bar")
    ap.add_argument("--model", default="gpt-image-1")
    ap.add_argument("--note", default="")
    args = ap.parse_args()

    species = {s["id"]: s for s in json.loads((ROOT / "data/species.json").read_text())["species"]}
    rec = species.get(args.id)
    if not rec:
        raise SystemExit(f"{args.id} is not in data/species.json")
    out = ROOT / rec["sticker"]["file"]
    out.parent.mkdir(parents=True, exist_ok=True)
    title = f"{rec['names'].get('en')} ({rec['scientificName']})"
    sticker(Image.open(args.image)).save(
        out, "WEBP", quality=88, method=6, xmp=XMP.format(title=title, model=args.model, repo=REPO).encode()
    )

    review_path = ROOT / "data/review.json"
    review = json.loads(review_path.read_text()) if review_path.exists() else {}
    review[args.id] = {
        "status": "approved" if args.passed else "draft",
        "reviewScore": args.score,
        "meetsQualityBar": args.passed,
        "model": args.model,
        "generated": datetime.date.today().isoformat(),
        **({"note": args.note} if args.note else {}),
    }
    review_path.write_text(json.dumps(dict(sorted(review.items())), indent=1) + "\n")
    print(f"wrote {out.relative_to(ROOT)} and data/review.json; run scripts/build.py to update the data files")


if __name__ == "__main__":
    main()
