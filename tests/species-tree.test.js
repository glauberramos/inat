const test = require("node:test");
const assert = require("node:assert/strict");

const {
  LIFE_TAXON_ID,
  buildSpeciesTree,
  countByRank,
  partitionTree,
  sunburstView,
  arcGeometry,
  visibleArcs,
  layoutTree,
  representativeSpecies,
  pickObservationPhotos,
  photoSize,
  easeInOutCubic,
  pathToRoot,
  findNode,
  searchTree,
} = require("../species-tree.js");

const row = (id, name, rank, rank_level, parent_id, extra = {}) => ({
  id,
  name,
  rank,
  rank_level,
  parent_id,
  ...extra,
});

// Life > Animalia > Chordata > Aves > Passeriformes > Turdidae > (Turdinae) > Turdus > 2 species,
// one with a subspecies; plus a Fungi branch only identified to genus.
const ROWS = [
  row(LIFE_TAXON_ID, "Life", "stateofmatter", 100, undefined),
  row(1, "Animalia", "kingdom", 70, LIFE_TAXON_ID, { iconic_taxon_name: "Animalia" }),
  row(2, "Chordata", "phylum", 60, 1),
  row(3, "Aves", "class", 50, 2, { iconic_taxon_name: "Aves" }),
  row(4, "Passeriformes", "order", 40, 3),
  row(5, "Turdidae", "family", 30, 4),
  row(6, "Turdinae", "subfamily", 27, 5),
  row(7, "Turdus", "genus", 20, 6),
  row(8, "Turdus rufiventris", "species", 10, 7),
  row(9, "Turdus amaurochalinus", "species", 10, 7),
  row(10, "Turdus amaurochalinus x", "subspecies", 5, 9),
  row(20, "Fungi", "kingdom", 70, LIFE_TAXON_ID, { iconic_taxon_name: "Fungi" }),
  row(21, "Amanita", "genus", 20, 20),
];

test("buildSpeciesTree skips intermediate ranks in main-ranks mode", () => {
  const tree = buildSpeciesTree(ROWS);
  const turdus = findNode(tree, 7);
  assert.equal(turdus.parent.id, 5);
  assert.equal(findNode(tree, 6), null);
  assert.equal(findNode(tree, 10), null);
  assert.deepEqual(
    pathToRoot(turdus).map((n) => n.name),
    ["Life", "Animalia", "Chordata", "Aves", "Passeriformes", "Turdidae", "Turdus"]
  );
});

test("buildSpeciesTree keeps every rank down to species in all-ranks mode", () => {
  const tree = buildSpeciesTree(ROWS, { majorOnly: false });
  assert.equal(findNode(tree, 7).parent.id, 6);
  assert.equal(findNode(tree, 10), null);
});

test("species counts and weights", () => {
  const tree = buildSpeciesTree(ROWS);
  assert.equal(tree.species, 2);
  assert.equal(findNode(tree, 1).species, 2);
  // The genus-only fungus has no species but still takes up room
  assert.equal(findNode(tree, 20).species, 0);
  assert.equal(findNode(tree, 20).weight, 1);
  assert.equal(tree.weight, 3);
  // Heaviest branch first
  assert.deepEqual(
    tree.children.map((n) => n.name),
    ["Animalia", "Fungi"]
  );
});

test("buildSpeciesTree creates Life when the rows lack it", () => {
  const tree = buildSpeciesTree(ROWS.filter((r) => r.id !== LIFE_TAXON_ID));
  assert.equal(tree.id, LIFE_TAXON_ID);
  assert.equal(tree.children.length, 2);
});

test("countByRank counts the main ranks", () => {
  const counts = countByRank(buildSpeciesTree(ROWS));
  assert.deepEqual(counts, {
    kingdom: 2,
    phylum: 1,
    class: 1,
    order: 1,
    family: 1,
    genus: 2,
    species: 2,
  });
});

test("partitionTree splits the circle by weight", () => {
  const tree = partitionTree(buildSpeciesTree(ROWS));
  const [animalia, fungi] = tree.children;
  assert.equal(animalia.x0, 0);
  assert.ok(Math.abs(animalia.x1 - 2 / 3) < 1e-9);
  assert.ok(Math.abs(fungi.x1 - 1) < 1e-9);
  assert.equal(findNode(tree, 8).depth, 7);
});

test("arcGeometry places nodes relative to the zoomed view", () => {
  const tree = partitionTree(buildSpeciesTree(ROWS));
  const animalia = findNode(tree, 1);
  const view = sunburstView(animalia);
  // Zoomed into Animalia, Chordata fills the whole first ring
  const chordata = arcGeometry(findNode(tree, 2), view);
  assert.equal(chordata.ring, 1);
  assert.equal(chordata.start, 0);
  assert.ok(Math.abs(chordata.end - Math.PI * 2) < 1e-9);
  // Fungi falls outside the window and collapses to nothing
  const fungi = arcGeometry(findNode(tree, 20), view);
  assert.equal(fungi.start, fungi.end);
});

test("visibleArcs keeps rings up to maxDepth and drops slivers", () => {
  const tree = partitionTree(buildSpeciesTree(ROWS));
  assert.deepEqual(
    visibleArcs(tree, { maxDepth: 1 })
      .map((n) => n.name)
      .sort(),
    ["Animalia", "Fungi"]
  );
  assert.deepEqual(
    visibleArcs(tree, { maxDepth: 4, minAngle: 3 })
      .map((n) => n.name)
      .sort(),
    ["Animalia", "Aves", "Chordata", "Passeriformes"]
  );
});

test("layoutTree gives collapsed nodes and leaves a row, parents sit between children", () => {
  const tree = buildSpeciesTree(ROWS);
  const open = new Set([LIFE_TAXON_ID]);
  const collapsed = layoutTree(tree, (n) => open.has(n.id), { rowHeight: 10, columnWidth: 100 });
  assert.deepEqual(
    [...collapsed.keys()].sort((a, b) => a - b),
    [1, 20, LIFE_TAXON_ID]
  );
  assert.deepEqual(
    [collapsed.get(1).y, collapsed.get(20).y, collapsed.get(LIFE_TAXON_ID).y],
    [0, 10, 5]
  );
  assert.equal(collapsed.get(1).x, 100);

  const all = layoutTree(tree, () => true, { rowHeight: 10, columnWidth: 100 });
  assert.equal(all.get(8).x, 700);
  assert.equal(all.get(7).y, (all.get(8).y + all.get(9).y) / 2);
  assert.equal(all.get(LIFE_TAXON_ID).top, 0);
  assert.equal(all.get(LIFE_TAXON_ID).bottom, 20);
});

test("representativeSpecies follows the biggest branch down", () => {
  const tree = buildSpeciesTree(ROWS);
  assert.equal(representativeSpecies(tree).rank, "species");
  assert.equal(representativeSpecies(findNode(tree, 20)), null);
});

test("pickObservationPhotos takes the first photographed observation per species", () => {
  const observations = [
    { id: 1, taxon: { id: 8, ancestor_ids: [7] }, photos: [] },
    {
      id: 2,
      taxon: { id: 10, ancestor_ids: [7, 9] },
      photos: [{ url: "https://x/photos/2/square.jpg" }],
      observed_on: "2024-01-02",
      place_guess: "Porto Alegre",
    },
    {
      id: 3,
      taxon: { id: 8, ancestor_ids: [7] },
      photos: [{ url: "https://x/photos/3/square.jpg" }],
    },
    {
      id: 4,
      taxon: { id: 8, ancestor_ids: [7] },
      photos: [{ url: "https://x/photos/4/square.jpg" }],
    },
  ];
  const picked = pickObservationPhotos(observations, [8, 9]);
  assert.equal(picked.get(8).observationId, 3);
  assert.deepEqual(picked.get(9), {
    observationId: 2,
    photo: "https://x/photos/2/square.jpg",
    observedOn: "2024-01-02",
    place: "Porto Alegre",
  });
});

test("photoSize and easeInOutCubic", () => {
  assert.equal(photoSize("https://x/photos/2/square.jpg", "large"), "https://x/photos/2/large.jpg");
  assert.equal(photoSize(null, "large"), null);
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(0.5), 0.5);
  assert.equal(easeInOutCubic(1), 1);
});

test("searchTree matches scientific and common names, coarse ranks first", () => {
  const tree = buildSpeciesTree(ROWS);
  assert.deepEqual(
    searchTree(tree, "turd").map((n) => n.name),
    ["Turdidae", "Turdus", "Turdus rufiventris", "Turdus amaurochalinus"]
  );
  assert.deepEqual(
    searchTree(tree, "thrush", new Map([[8, "Rufous-bellied Thrush"]])).map((n) => n.id),
    [8]
  );
  assert.deepEqual(searchTree(tree, "  "), []);
});
