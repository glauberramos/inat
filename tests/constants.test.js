const test = require("node:test");
const assert = require("node:assert/strict");

const { API_BASE, getConservationStatus, getIconicTaxonIcon } = require("../constants.js");

test("API_BASE points at the iNaturalist v1 API", () => {
  assert.equal(API_BASE, "https://api.inaturalist.org/v1");
});

test("getConservationStatus maps codes and long names, case-insensitively", () => {
  assert.equal(getConservationStatus("CR").badge, "CR");
  assert.equal(getConservationStatus("critically_endangered").badge, "CR");
  assert.equal(getConservationStatus("Vulnerable").badge, "VU");
  assert.equal(getConservationStatus("lc").class, "status-lc");
});

test("getConservationStatus returns null for unknown or missing status", () => {
  assert.equal(getConservationStatus("extinct_in_the_wild"), null);
  assert.equal(getConservationStatus(""), null);
  assert.equal(getConservationStatus(null), null);
  assert.equal(getConservationStatus(undefined), null);
});

test("getIconicTaxonIcon returns the taxon emoji with a fallback", () => {
  assert.equal(getIconicTaxonIcon("Aves"), "🐦");
  assert.equal(getIconicTaxonIcon("Fungi"), "🍄");
  assert.equal(getIconicTaxonIcon("NotATaxon"), "🔍");
});
