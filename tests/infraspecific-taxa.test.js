const test = require("node:test");
const assert = require("node:assert/strict");

const { fetchAllRecords, collectInfraspecificTaxa } = require("../shared-utils.js");

function stubFetch(pages) {
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url);
    const idAbove = Number(new URL(url).searchParams.get("id_above"));
    const results = pages[idAbove] || [];
    return {
      ok: true,
      // the API shrinks total_results as id_above advances
      json: async () => ({ results, total_results: 5 - idAbove / 10 }),
    };
  };
  return calls;
}

test("fetchAllRecords pages with id_above until a short page", async () => {
  const calls = stubFetch({
    0: [{ id: 10 }, { id: 20 }],
    20: [{ id: 30 }, { id: 40 }],
    40: [{ id: 50 }],
  });
  const progress = [];
  const records = await fetchAllRecords("https://x/observations?user_login=a", {
    perPage: 2,
    onPage: (fetched, total) => progress.push([fetched, total]),
  });
  assert.deepEqual(progress, [
    [2, 5],
    [4, 5],
    [5, 5],
  ]);
  assert.deepEqual(
    records.map((r) => r.id),
    [10, 20, 30, 40, 50]
  );
  assert.equal(calls.length, 3);
  assert.match(calls[0], /id_above=0/);
  assert.match(calls[0], /per_page=2/);
  assert.match(calls[0], /order_by=id&order=asc/);
  assert.match(calls[1], /id_above=20/);
  assert.match(calls[2], /id_above=40/);
});

test("fetchAllRecords stops on an empty first page", async () => {
  const calls = stubFetch({});
  const records = await fetchAllRecords("https://x/observations?user_login=a");
  assert.deepEqual(records, []);
  assert.equal(calls.length, 1);
});

test("collectInfraspecificTaxa dedupes taxa and keeps the species_counts shape", () => {
  const taxon = {
    id: 7,
    name: "Aegithalos concinnus concinnus",
    rank: "subspecies",
    observations_count: 12,
    preferred_common_name: "Black-throated Bushtit",
    default_photo: { medium_url: "p.jpg" },
    ancestor_ids: [1, 2, 3],
  };
  const records = [
    { id: 1, taxon },
    { id: 2, taxon: { ...taxon } },
    { id: 3, taxon: { id: 8, name: "Vulpes vulpes crucigera", rank: "subspecies" } },
    { id: 4 },
    { id: 5, taxon: null },
  ];
  const result = collectInfraspecificTaxa(records);
  assert.deepEqual(result, [
    {
      taxon: {
        id: 7,
        name: "Aegithalos concinnus concinnus",
        rank: "subspecies",
        observations_count: 12,
        preferred_common_name: "Black-throated Bushtit",
        default_photo: { medium_url: "p.jpg" },
      },
    },
    {
      taxon: {
        id: 8,
        name: "Vulpes vulpes crucigera",
        rank: "subspecies",
        observations_count: 0,
        preferred_common_name: undefined,
        default_photo: undefined,
      },
    },
  ]);
});

test("hydrateTaxa fills in names and photos from /taxa in chunks", async () => {
  const { hydrateTaxa } = require("../shared-utils.js");
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url);
    const ids = new URL(url).pathname.split("/").pop().split(",").map(Number);
    return {
      ok: true,
      json: async () => ({
        results: ids.map((id) => ({
          id,
          name: `Taxon ${id}`,
          rank: "subspecies",
          preferred_common_name: id === 2 ? "Two" : undefined,
          observations_count: id * 10,
          default_photo: { medium_url: `${id}.jpg` },
        })),
      }),
    };
  };
  const taxa = [1, 2, 3].map((id) => ({
    taxon: { id, rank: "subspecies", observations_count: 0 },
  }));
  const result = await hydrateTaxa(taxa, "https://x", { chunkSize: 2, locale: "fr" });
  assert.equal(calls.length, 2);
  assert.match(calls[0], /\/taxa\/1,2\?/);
  assert.match(calls[0], /locale=fr/);
  assert.match(calls[1], /\/taxa\/3\?/);
  assert.deepEqual(result[1].taxon, {
    id: 2,
    name: "Taxon 2",
    rank: "subspecies",
    observations_count: 20,
    preferred_common_name: "Two",
    default_photo: { medium_url: "2.jpg" },
  });
  assert.equal(result[2].taxon.name, "Taxon 3");
});

test("hydrateTaxa keeps entries the API does not return", async () => {
  const { hydrateTaxa } = require("../shared-utils.js");
  global.fetch = async () => ({ ok: true, json: async () => ({ results: [] }) });
  const result = await hydrateTaxa([{ taxon: { id: 9, rank: "subspecies" } }], "https://x");
  assert.deepEqual(result, [{ taxon: { id: 9, rank: "subspecies" } }]);
});
