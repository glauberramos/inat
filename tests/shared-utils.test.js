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
