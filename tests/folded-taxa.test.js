const test = require("node:test");
const assert = require("node:assert/strict");

const {
  mapSpeciesCountTaxa,
  fetchSpeciesCountPages,
  collectTaxonomyExtras,
  FOLDED_RANKS,
} = require("../shared-utils.js");

test("mapSpeciesCountTaxa keeps only entries with a taxon, in the page shape", () => {
  const results = [
    {
      count: 3,
      taxon: {
        id: 1,
        name: "Chaoborus",
        rank: "genus",
        observations_count: 500,
        preferred_common_name: "Phantom Midges",
        default_photo: { medium_url: "a.jpg" },
        ancestor_ids: [9],
      },
    },
    { count: 1 },
  ];
  assert.deepEqual(mapSpeciesCountTaxa(results), [
    {
      taxon: {
        id: 1,
        name: "Chaoborus",
        rank: "genus",
        observations_count: 500,
        preferred_common_name: "Phantom Midges",
        default_photo: { medium_url: "a.jpg" },
      },
    },
  ]);
});

test("fetchSpeciesCountPages walks every page and reports progress", async () => {
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url);
    const page = Number(new URL(url).searchParams.get("page"));
    const all = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    return {
      ok: true,
      json: async () => ({
        total_results: 5,
        results: all.slice((page - 1) * 2, page * 2),
      }),
    };
  };
  const progress = [];
  const results = await fetchSpeciesCountPages("https://x/species_counts?user_login=a", {
    perPage: 2,
    onPage: (page, totalPages) => progress.push([page, totalPages]),
  });
  assert.deepEqual(
    results.map((r) => r.id),
    [1, 2, 3, 4, 5]
  );
  assert.equal(calls.length, 3);
  assert.match(calls[0], /per_page=2&page=1$/);
  assert.match(calls[2], /page=3$/);
  assert.deepEqual(progress, [
    [1, 3],
    [2, 3],
    [3, 3],
  ]);
});

test("fetchSpeciesCountPages handles an empty result", async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ total_results: 0, results: [] }) });
  assert.deepEqual(await fetchSpeciesCountPages("https://x/species_counts?u=a"), []);
});

test("collectTaxonomyExtras returns taxa up to family with direct observations that species_counts left out", () => {
  const rows = [
    { id: 129899, name: "Chaoborus", rank: "genus", rank_level: 20, count: 2, direct_obs_count: 1 },
    {
      id: 548070,
      name: "Chaoborus",
      rank: "subgenus",
      rank_level: 15,
      count: 1,
      direct_obs_count: 1,
    },
    { id: 47822, name: "Diptera", rank: "order", rank_level: 40, count: 2, direct_obs_count: 1 },
    {
      id: 48460,
      name: "Life",
      rank: "stateofmatter",
      rank_level: 100,
      count: 9,
      direct_obs_count: 1,
    },
    { id: 51, name: "Chaoboridae", rank: "family", rank_level: 30, count: 2, direct_obs_count: 0 },
    {
      id: 7,
      name: "Vulpes vulpes crucigera",
      rank: "subspecies",
      rank_level: 5,
      count: 1,
      direct_obs_count: 1,
    },
  ];
  const extras = collectTaxonomyExtras(rows, [548070]);
  assert.deepEqual(extras, [
    {
      taxon: {
        id: 129899,
        name: "Chaoborus",
        rank: "genus",
        observations_count: 0,
        preferred_common_name: undefined,
        default_photo: undefined,
        needsHydration: true,
      },
    },
    {
      taxon: {
        id: 7,
        name: "Vulpes vulpes crucigera",
        rank: "subspecies",
        observations_count: 0,
        preferred_common_name: undefined,
        default_photo: undefined,
        needsHydration: true,
      },
    },
  ]);
});

test("FOLDED_RANKS lists ranks above species, one per call, finest first", () => {
  assert.deepEqual(FOLDED_RANKS, ["subgenus", "genus", "complex", "tribe", "subfamily", "family"]);
});
