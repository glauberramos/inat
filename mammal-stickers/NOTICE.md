# Notice

The AI-illustrated stickers are licensed under CC BY 4.0 and the data compiled by this project under MIT, to the extent that we hold rights in them (see [LICENSE.md](LICENSE.md)). The items below come from third parties and keep their own terms.

## Species list, taxonomy and names

The species list (the mammals with the most research-grade observations), taxonomy, common names in every language, Wikipedia links and IUCN categories come from the [iNaturalist](https://www.inaturalist.org/) API. iNaturalist's taxonomy largely follows the [Mammal Diversity Database](https://www.mammaldiversity.org/). **The license of iNaturalist's common names has not been confirmed for redistribution;** check iNaturalist's terms before publishing `data/names.csv` or the `names` field on their own.

Wikidata and GBIF identifiers come from [Wikidata](https://www.wikidata.org/) (CC0), matched on the iNaturalist taxon ID (property P3151).

## Body mass

`traits.massG` comes from **EltonTraits 1.0**: Wilman, H., Belmaker, J., Simpson, J., de la Rosa, C., Rivadeneira, M. M. & Jetz, W. (2014). EltonTraits 1.0: Species-level foraging attributes of the world's birds and mammals. *Ecology* 95: 2027. Data: <https://doi.org/10.6084/m9.figshare.3559887.v1>, [CC0](https://creativecommons.org/publicdomain/zero/1.0/). EltonTraits follows *Mammal Species of the World* 3 (2005). Where the iNaturalist name differs, `traits.source.name` gives the name the mass was taken from; species split since 2005 carry the mass of the species they were split from, and the domestic dog carries the wolf's.

## Reference photos

Each sticker is drawn with a board of up to four iNaturalist photos, each under CC0, CC BY or CC BY-SA. The page, photographer and license of each are listed per species in `data/species.json` (`sticker.reference`) and in its prompt file. Rights in the photographs remain with their photographers.

Boards picked by hand are kept in `references/<Genus_species>/`: the photos, resized to 1,200 px, and `board.jpg`, the four combined in one image. They are shared under each photo's own license (CC0, CC BY or CC BY-SA), not under this project's licenses; the photographer and license of each file are in that folder's `references.json`. For the other species the photos are only linked, not included.

If one of your photos was used as a reference for a sticker and you would rather it weren't, open an issue and we will replace the sticker.

## Method

The pipeline, pose rules, prompt layout and review rubric are adapted from [huashu-bird-sticker](https://github.com/alchaincyf/huashu-bird-sticker) by Huashu (CC BY 4.0 for its stickers; its method notes are in its `docs/`). This project does not reuse any of its artwork or data, and no affiliation or endorsement is implied.
