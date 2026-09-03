const test = require("node:test");
const assert = require("node:assert/strict");

const { buildLocationSuggestions } = require("../location-autocomplete.js");

const brazil = { id: 6878, display_name: "Brazil", place_type: 12 };
const rio = { id: 7563, name: "Rio de Janeiro", place_type: 8, location: "-22.9,-43.2" };
const project = { id: 1234, title: "Biodiversity of Rio" };

test("buildLocationSuggestions lists places before projects with type labels", () => {
  const items = buildLocationSuggestions([brazil, rio], [project]);
  assert.deepEqual(
    items.map((i) => [i.type, i.id, i.name, i.label]),
    [
      ["place", 6878, "Brazil", "Country"],
      ["place", 7563, "Rio de Janeiro", "State"],
      ["project", 1234, "Biodiversity of Rio", "Project"],
    ]
  );
  assert.equal(items[1].location, "-22.9,-43.2");
});

test("buildLocationSuggestions tolerates missing lists and unknown place types", () => {
  assert.deepEqual(buildLocationSuggestions(null, null), []);
  const [item] = buildLocationSuggestions([{ id: 1, name: "Somewhere", place_type: 999 }]);
  assert.equal(item.label, "");
  assert.equal(item.type, "place");
});

test("buildLocationSuggestions prefers the API place_type_name when present", () => {
  const [item] = buildLocationSuggestions([{ id: 1, name: "X", place_type_name: "Reserve" }], []);
  assert.equal(item.label, "Reserve");
});
