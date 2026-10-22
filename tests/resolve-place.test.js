const test = require("node:test");
const assert = require("node:assert/strict");

const { resolvePlaceIdByName } = require("../shared-utils.js");

function stubPlaces(results) {
  const calls = [];
  global.API_BASE = "https://api.test/v1";
  global.fetch = async (url) => {
    calls.push(url);
    return { ok: true, status: 200, json: async () => ({ results }) };
  };
  return calls;
}

const outlying = { id: 10316, display_name: "United States Minor Outlying Islands" };
const unitedStates = { id: 1, display_name: "United States", name: "United States" };

test("resolvePlaceIdByName returns the place whose name matches the typed text exactly", async () => {
  const calls = stubPlaces([outlying, unitedStates]);
  assert.equal(await resolvePlaceIdByName(" united states "), 1);
  assert.match(calls[0], /\/places\/autocomplete\?q=united%20states/);
});

test("resolvePlaceIdByName returns null rather than guessing on a partial name", async () => {
  stubPlaces([outlying, unitedStates]);
  assert.equal(await resolvePlaceIdByName("United State"), null);
});

test("resolvePlaceIdByName returns null when the API has no results", async () => {
  stubPlaces(undefined);
  assert.equal(await resolvePlaceIdByName("Atlantis"), null);
});
