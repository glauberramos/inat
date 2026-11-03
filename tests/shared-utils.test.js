const test = require("node:test");
const assert = require("node:assert/strict");

const { escapeHtml, sleep } = require("../shared-utils.js");

test("escapeHtml escapes HTML special characters", () => {
  assert.equal(
    escapeHtml('<img src=x onerror="alert(1)">'),
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"
  );
  assert.equal(escapeHtml("Tom & Jerry's"), "Tom &amp; Jerry&#39;s");
});

test("escapeHtml leaves plain text unchanged", () => {
  assert.equal(escapeHtml("Turdus migratorius"), "Turdus migratorius");
  assert.equal(escapeHtml("São Paulo"), "São Paulo");
});

test("escapeHtml handles non-string and empty values", () => {
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml(undefined), "");
  assert.equal(escapeHtml(42), "42");
  assert.equal(escapeHtml(""), "");
});

test("escapeHtml is safe against double-encoding checks", () => {
  // escaping twice must not lose information, only re-encode ampersands
  assert.equal(escapeHtml(escapeHtml("<b>")), "&amp;lt;b&amp;gt;");
});

test("sleep resolves after the given delay", async () => {
  const start = Date.now();
  await sleep(20);
  assert.ok(Date.now() - start >= 15);
});

test("commonNameParams asks for each Portuguese's own country", () => {
  const { commonNameParams } = require("../shared-utils.js");
  assert.equal(commonNameParams("pt-BR"), "&locale=pt-BR&preferred_place_id=6878");
  assert.equal(commonNameParams("pt"), "&locale=pt&preferred_place_id=7122");
});

test("commonNameParams sends no place for languages without one", () => {
  const { commonNameParams } = require("../shared-utils.js");
  // A place's name beats the locale, so a place here would turn these into
  // Portuguese names.
  assert.equal(commonNameParams("es"), "&locale=es");
  assert.equal(commonNameParams("fr"), "&locale=fr");
  assert.equal(commonNameParams("de"), "&locale=de");
});

test("commonNameParams is empty for English, the API default", () => {
  const { commonNameParams } = require("../shared-utils.js");
  assert.equal(commonNameParams("en"), "");
  assert.equal(commonNameParams(""), "");
  assert.equal(commonNameParams(undefined), "");
});

test("hydrateTaxa asks for the language's place-specific names", async () => {
  const { hydrateTaxa } = require("../shared-utils.js");
  const original = global.fetch;
  const urls = [];
  global.fetch = async (url) => {
    urls.push(url);
    return { ok: true, status: 200, json: async () => ({ results: [] }) };
  };
  try {
    await hydrateTaxa([{ taxon: { id: 1 } }], "https://x", { locale: "pt-BR" });
  } finally {
    global.fetch = original;
  }
  assert.match(urls[0], /&locale=pt-BR&preferred_place_id=6878$/);
});
