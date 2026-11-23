# How the stickers are made

The method is adapted from [huashu-bird-sticker's notes](https://github.com/alchaincyf/huashu-bird-sticker/blob/main/docs/how-the-stickers-are-made.md), which drew more than 11,000 birds this way. The pose rules, the review rubric and the reference rules below are our mammal version of theirs.

The stickers are AI-generated and the review also uses AI, which is not the same as an expert check.

## The loop

1. **Write a short field-mark card** for the species (`data/field-marks.json`): what to draw (sex, age, coat), the key marks, and how to tell it from the look-alike the model is most likely to draw instead. Be specific about the obvious parts too: "tail about a third of the body length, held low" works better than "long tail", and parts left out come out generic.
2. **Collect reference photos.** `scripts/build.py` picks up to four photos per species, by different photographers, all under CC0, CC BY or CC BY-SA, so the board itself can be reused. The curated photos on the species' iNaturalist page come first, then the most-faved research-grade observations. It skips anything annotated as dead, juvenile, tracks, scat or bones, skips GIFs and near-greyscale night camera shots, and, where the card draws a male, puts annotated males first and skips annotated females.
3. **Generate.** Open the species' prompt in `prompts/<Order>/<Family>/<Genus_species>.md`, attach its reference photos (as separate images or pasted into one board), and send it to an image model that accepts reference images (the bird project used OpenAI GPT Image). The prompt sets a standard pose on a flat #D9D9D9 grey background; the photos are only for checking what the animal looks like.
4. **Review.** In a new chat, or with a different model, show the image and the field-mark card and ask for scores from 0 to 4 on: identification, coat and markings, head (eyes, ears, muzzle, horns or antlers), legs, feet and tail, and proportions. It passes only if every score is at least 3, identification is 4, and the reviewer would accept it as the species' plate in a field guide. Convert to the 0–100 `reviewScore` as the sum of the five scores × 5.
5. **If it fails**, ask the reviewer for one to three corrections written as sentences that can go straight into the prompt, add them at the end under "Corrections (these win over anything above):", and generate again.
6. **Finish.** `python3 scripts/finish.py <image> <Genus_species> --score 90 --pass` cuts the animal out, adds the white outline, saves the WebP with AI-generated metadata, and records the review in `data/review.json`. Then re-run `scripts/build.py` to update the data files.

## Poses

Defined in `POSES` in `scripts/build.py`. Every pose: one whole animal, head to the left, camera at eye level, body turned about 15° toward the viewer, mouth closed, flat grey background, nothing else drawn.

| Pose | Used for | Rule in short |
|---|---|---|
| `standing` | most mammals | side view, all four feet flat on an invisible ground line |
| `upright-kangaroo` | kangaroos, wallabies | upright on the hind feet, tail on the ground line as the third leg |
| `walking-primate` | monkeys | on all fours on an invisible ground line |
| `swimming` | whales, dolphins | exact side view, body horizontal, no water drawn |
| `hauled-out-seal` | true seals | lying on the belly, chest raised on the front flippers |
| `upright-sea-lion` | sea lions | propped up on the front flippers |
| `floating-back` | sea otter | floating on its back, no water drawn |
| `hanging` | sloths | hanging under one short bare branch, the only prop allowed |
| `clinging-trunk` | koala | clinging to a short section of trunk, the only prop allowed |

The bird project found that leaving the pose to the photo made the model copy backs, flight shots and hidden field marks, and that "gripping an invisible branch" produced dangling claws. That is why feet go flat on an invisible ground line, and why the two tree-bound species get one plain prop instead.

## What to watch for with mammals

- **Antlers and horns** are where models go wrong most often: the number of points, which way they curve, whether tines rise from one beam or fork. The cards spell these out; check them first in review.
- **Tails** get shortened to fit the frame. The prompt starts with a TAIL rule for that reason, and tall species (giraffe, kangaroos, koala) get a portrait canvas.
- **Look-alike pairs** in this list: white-tailed and mule deer, red deer and wapiti, the three tree squirrels, the two hedgehogs, the two grey kangaroos, harbor and grey seal, the two rats. Review these against each other.
- **Domestic animals** (cat, dog, horse) have no single "right" look. The cards pick one plain, typical type.
- **Dasypus mexicanus** was split from the nine-banded armadillo in 2023 and looks almost the same; the card says not to invent differences.

## Limits

The images and the review are both AI. Some mistakes will only be found by people who know the animals; record them in the species' prompt as corrections and regenerate.
