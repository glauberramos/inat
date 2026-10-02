const test = require("node:test");
const assert = require("node:assert/strict");

const {
  JEV_CHANCE_LEVELS,
  JEV_AFFINITY_LEVELS,
  deriveUserProfile,
  buildCandidates,
  buildJevItem,
  scoreLevelValue,
  combineJevAnswers,
  heuristicScore,
  rankCandidates,
} = require("../lifelist-curator.js");

function speciesRow(id, group, count = 1, extra = {}) {
  return {
    count,
    taxon: {
      id,
      name: `Species ${id}`,
      iconic_taxon_name: group,
      preferred_common_name: "",
      default_photo: null,
      ...extra,
    },
  };
}

test("deriveUserProfile counts species and ranks groups", () => {
  const profile = deriveUserProfile([
    speciesRow(1, "Aves"),
    speciesRow(2, "Aves"),
    speciesRow(3, "Insecta"),
    { count: 1 }, // row without taxon is ignored
  ]);
  assert.equal(profile.totalSpecies, 3);
  assert.deepEqual(profile.topGroups[0], { group: "Aves", count: 2 });
  assert.deepEqual(profile.topGroups[1], { group: "Insecta", count: 1 });
});

test("deriveUserProfile keeps at most five groups", () => {
  const rows = ["Aves", "Insecta", "Plantae", "Fungi", "Mammalia", "Reptilia"].map((group, i) =>
    speciesRow(i, group)
  );
  const profile = deriveUserProfile(rows);
  assert.equal(profile.topGroups.length, 5);
});

test("buildCandidates drops observed species and caps the list", () => {
  const placeRows = [
    speciesRow(1, "Aves", 50),
    speciesRow(2, "Aves", 40),
    speciesRow(3, "Insecta", 30),
  ];
  const candidates = buildCandidates(placeRows, new Set([2]), 10);
  assert.deepEqual(
    candidates.map((c) => c.taxonId),
    [1, 3]
  );
  const capped = buildCandidates(placeRows, new Set(), 1);
  assert.equal(capped.length, 1);
});

test("buildJevItem packs profile and candidate into a JSON state with three questions", () => {
  const profile = deriveUserProfile([speciesRow(1, "Aves")]);
  const candidate = buildCandidates([speciesRow(9, "Insecta", 123)], new Set())[0];
  const item = buildJevItem(profile, candidate, { placeName: "Campinas", monthName: "September" });
  assert.equal(item.id, "9");
  const state = JSON.parse(item.state);
  assert.equal(state.species.observations_in_place, 123);
  assert.equal(state.context.current_month, "September");
  assert.equal(state.user.lifelist_species_total, 1);
  assert.deepEqual(Object.keys(item.questions), ["chance", "affinity", "ease"]);
  assert.equal(item.questions.chance.type, "score");
  assert.equal(item.questions.ease.type, "noul");
});

test("scoreLevelValue maps ordered levels onto 0..1", () => {
  assert.equal(scoreLevelValue("very low", JEV_CHANCE_LEVELS), 0);
  assert.equal(scoreLevelValue("very high", JEV_CHANCE_LEVELS), 1);
  assert.equal(scoreLevelValue("medium", JEV_CHANCE_LEVELS), 0.5);
  assert.equal(scoreLevelValue("bogus", JEV_CHANCE_LEVELS), null);
});

test("combineJevAnswers weights all three factors", () => {
  const rank = combineJevAnswers({
    chance: { level: "very high" },
    affinity: { level: JEV_AFFINITY_LEVELS[JEV_AFFINITY_LEVELS.length - 1] },
    ease: { value: 1 },
  });
  assert.equal(rank, 1);
  const zero = combineJevAnswers({
    chance: { level: "very low" },
    affinity: { level: "none" },
    ease: { value: 0 },
  });
  assert.equal(zero, 0);
});

test("combineJevAnswers renormalizes when a factor is missing or invalid", () => {
  // Only chance is usable: rank must equal its value, not be diluted.
  const rank = combineJevAnswers({
    chance: { level: "high" },
    affinity: { level: "unexpected-level" },
    ease: { value: 7 },
  });
  assert.equal(rank, 0.75);
  assert.equal(combineJevAnswers(null), null);
  assert.equal(combineJevAnswers({}), null);
});

test("heuristicScore favors frequent species and matching groups", () => {
  const profile = deriveUserProfile([speciesRow(1, "Aves"), speciesRow(2, "Aves")]);
  const common = { taxonId: 10, group: "Aves", localCount: 100 };
  const rare = { taxonId: 11, group: "Aves", localCount: 1 };
  const otherGroup = { taxonId: 12, group: "Fungi", localCount: 100 };
  assert.ok(heuristicScore(common, profile, 100) > heuristicScore(rare, profile, 100));
  assert.ok(heuristicScore(common, profile, 100) > heuristicScore(otherGroup, profile, 100));
});

test("heuristicScore handles empty profiles and zero counts", () => {
  const emptyProfile = deriveUserProfile([]);
  assert.equal(heuristicScore({ group: "Aves", localCount: 0 }, emptyProfile, 0), 0);
});

test("rankCandidates sorts best first and sinks unscored candidates", () => {
  const candidates = [
    { taxonId: 1, localCount: 1 },
    { taxonId: 2, localCount: 1 },
    { taxonId: 3, localCount: 1 },
  ];
  const ranked = rankCandidates(candidates, { 1: 0.2, 2: 0.9, 3: null });
  assert.deepEqual(
    ranked.map((c) => c.taxonId),
    [2, 1, 3]
  );
  assert.equal(ranked[2].score, null);
});
