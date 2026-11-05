const test = require("node:test");
const assert = require("node:assert/strict");

const { creditCountsToRequested, splitByWorldShare } = require("../shared-utils.js");

test("creditCountsToRequested credits exact matches", () => {
  const results = [
    { count: 19, taxon: { id: 7072, ancestor_ids: [1, 3, 7072] } },
    { count: 113, taxon: { id: 204520, ancestor_ids: [1, 3, 204520] } },
  ];
  const counts = creditCountsToRequested([7072, 204520], results);
  assert.equal(counts.get(7072), 19);
  assert.equal(counts.get(204520), 113);
});

test("creditCountsToRequested rolls subspecies up to the requested species and sums", () => {
  const results = [
    { count: 5, taxon: { id: 10, ancestor_ids: [1, 9, 10] } },
    { count: 7, taxon: { id: 11, ancestor_ids: [1, 9, 10, 11] } },
    { count: 2, taxon: { id: 12, ancestor_ids: [1, 9, 10, 12] } },
  ];
  assert.equal(creditCountsToRequested([10], results).get(10), 14);
});

test("creditCountsToRequested prefers the deepest requested taxon", () => {
  // Place had both the species (10) and its subspecies (11).
  const results = [
    { count: 5, taxon: { id: 10, ancestor_ids: [1, 10] } },
    { count: 7, taxon: { id: 11, ancestor_ids: [1, 10, 11] } },
  ];
  const counts = creditCountsToRequested([10, 11], results);
  assert.equal(counts.get(10), 5);
  assert.equal(counts.get(11), 7);
});

test("creditCountsToRequested ignores rows without a requested ancestor and tolerates missing ancestry", () => {
  const results = [
    { count: 9, taxon: { id: 99, ancestor_ids: [1, 98, 99] } },
    { count: 4, taxon: { id: 10 } },
    { count: 3 },
  ];
  const counts = creditCountsToRequested([10], results);
  assert.equal(counts.get(10), 4);
  assert.equal(counts.has(99), false);
});

test("splitByWorldShare groups by share of world observations", () => {
  const rows = [
    { count: 412, taxon: { id: 1 } },
    { count: 10540, taxon: { id: 2 } },
    { count: 50, taxon: { id: 3 } },
    { count: 100, taxon: { id: 4 } },
    { count: 30, taxon: { id: 5 } },
  ];
  const rest = new Map([
    [2, 19],
    [3, 50], // exactly half counts as mostly here
    [4, 900],
  ]);
  const { onlyHere, mostlyHere, mostlyElsewhere } = splitByWorldShare(rows, rest);

  assert.deepEqual(
    onlyHere.map((i) => i.taxon.id),
    [1, 5]
  );
  assert.equal(onlyHere[0].rest, 0);
  assert.equal(onlyHere[0].share, 1);
  assert.deepEqual(
    mostlyHere.map((i) => i.taxon.id),
    [2, 3]
  );
  assert.equal(mostlyHere[1].share, 0.5);
  assert.deepEqual(
    mostlyElsewhere.map((i) => i.taxon.id),
    [4]
  );
  assert.equal(mostlyElsewhere[0].share, 0.1);
});
