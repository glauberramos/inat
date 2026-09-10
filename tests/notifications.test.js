const test = require("node:test");
const assert = require("node:assert/strict");

const {
  classifyIdentification,
  classifyUpdate,
  findMyCurrentIdTaxon,
  topCategory,
  groupUpdatesByObservation,
  summarizeCategories,
  decodeJwtExpiry,
} = require("../notifications.js");

// Taxon fixtures mirroring iNat ancestry: Aves > Turdus > Turdus migratorius
const aves = { id: 3, ancestor_ids: [48460, 1, 2] };
const turdus = { id: 12705, ancestor_ids: [48460, 1, 2, 3] };
const migratorius = { id: 12727, ancestor_ids: [48460, 1, 2, 3, 12705] };
const quercus = { id: 47851, ancestor_ids: [48460, 47126] };

test("classifyIdentification: same taxon is an agreement", () => {
  assert.equal(classifyIdentification(turdus, turdus, false), "agreement");
});

test("classifyIdentification: descendant of my ID is a refinement", () => {
  assert.equal(classifyIdentification(migratorius, turdus, false), "refinement");
});

test("classifyIdentification: ancestor without disagreement is coarser", () => {
  assert.equal(classifyIdentification(aves, turdus, false), "coarser");
});

test("classifyIdentification: explicit disagreement to ancestor is a disagreement", () => {
  assert.equal(classifyIdentification(aves, turdus, true), "disagreement");
});

test("classifyIdentification: disjoint branch is a disagreement", () => {
  assert.equal(classifyIdentification(quercus, turdus, false), "disagreement");
});

test("classifyIdentification: no ID of mine means new_id", () => {
  assert.equal(classifyIdentification(turdus, null, false), "new_id");
});

test("classifyIdentification: equality wins even when ancestor_ids includes self", () => {
  const selfIncluded = { id: 12705, ancestor_ids: [48460, 1, 2, 3, 12705] };
  assert.equal(classifyIdentification(selfIncluded, selfIncluded, false), "agreement");
});

test("classifyUpdate: comment mentioning my login is a mention", () => {
  const update = { comment: { body: "Hey @Glauber, can you check this?" } };
  assert.equal(classifyUpdate(update, null, "glauber"), "mention");
  assert.equal(classifyUpdate(update, null, "someoneelse"), "comment");
});

test("classifyUpdate: identification updates use taxon comparison", () => {
  const update = {
    identification: { taxon: migratorius, disagreement: false },
  };
  assert.equal(classifyUpdate(update, turdus, "me"), "refinement");
});

test("classifyUpdate: unknown update shape is other", () => {
  assert.equal(classifyUpdate({}, turdus, "me"), "other");
});

test("findMyCurrentIdTaxon: returns only my current ID's taxon", () => {
  const obs = {
    identifications: [
      { current: false, user: { id: 7 }, taxon: aves },
      { current: true, user: { id: 7 }, taxon: turdus },
      { current: true, user: { id: 8 }, taxon: migratorius },
    ],
  };
  assert.equal(findMyCurrentIdTaxon(obs, 7), turdus);
  assert.equal(findMyCurrentIdTaxon(obs, 99), null);
  assert.equal(findMyCurrentIdTaxon(null, 7), null);
});

test("topCategory: picks the most attention-worthy category", () => {
  assert.equal(topCategory(["agreement", "disagreement", "comment"]), "disagreement");
  assert.equal(topCategory(["refinement", "agreement"]), "refinement");
  assert.equal(topCategory([]), "other");
});

test("groupUpdatesByObservation: groups, sorts and flags unread", () => {
  const updates = [
    {
      resource_id: 1,
      created_at: "2026-08-01T10:00:00Z",
      viewed: true,
      triageCategory: "agreement",
    },
    {
      resource_id: 2,
      created_at: "2026-08-03T10:00:00Z",
      viewed: false,
      triageCategory: "disagreement",
    },
    {
      resource_id: 1,
      created_at: "2026-08-02T10:00:00Z",
      viewed: false,
      triageCategory: "comment",
    },
  ];
  const groups = groupUpdatesByObservation(updates);
  assert.equal(groups.length, 2);
  // newest activity first: obs 2 (Aug 3) before obs 1 (Aug 2)
  assert.equal(groups[0].obsId, 2);
  assert.equal(groups[1].obsId, 1);
  // events inside a card are newest first
  assert.equal(groups[1].events[0].created_at, "2026-08-02T10:00:00Z");
  // card category is the highest-priority event category
  assert.equal(groups[1].category, "comment");
  assert.equal(groups[1].unread, true);
  assert.equal(groups[0].unread, true);
});

test("summarizeCategories: counts events across groups", () => {
  const groups = groupUpdatesByObservation([
    {
      resource_id: 1,
      created_at: "2026-08-01T10:00:00Z",
      viewed: true,
      triageCategory: "agreement",
    },
    {
      resource_id: 1,
      created_at: "2026-08-02T10:00:00Z",
      viewed: true,
      triageCategory: "agreement",
    },
    {
      resource_id: 2,
      created_at: "2026-08-02T10:00:00Z",
      viewed: false,
      triageCategory: "mention",
    },
  ]);
  const counts = summarizeCategories(groups);
  assert.equal(counts.agreement, 2);
  assert.equal(counts.mention, 1);
  assert.equal(counts.disagreement, 0);
});

test("decodeJwtExpiry: reads exp from a JWT payload", () => {
  const payload = Buffer.from(JSON.stringify({ exp: 1767225600 })).toString("base64url");
  const token = `header.${payload}.signature`;
  assert.equal(decodeJwtExpiry(token), 1767225600000);
});

test("decodeJwtExpiry: returns null for garbage input", () => {
  assert.equal(decodeJwtExpiry("not-a-jwt"), null);
  assert.equal(decodeJwtExpiry(""), null);
  assert.equal(decodeJwtExpiry(null), null);
});
