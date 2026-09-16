const test = require("node:test");
const assert = require("node:assert/strict");

const { fetchJSON } = require("../shared-utils.js");

function stubFetch(responses) {
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url);
    const r = responses.shift();
    return {
      ok: r.status === 200,
      status: r.status,
      headers: { get: (name) => (name === "Retry-After" ? r.retryAfter || null : null) },
      json: async () => r.body,
    };
  };
  return calls;
}

test("fetchJSON retries 429 with backoff and then succeeds", async () => {
  const calls = stubFetch([{ status: 429 }, { status: 429 }, { status: 200, body: { ok: 1 } }]);
  const data = await fetchJSON("https://x/y", { baseDelayMs: 1 });
  assert.deepEqual(data, { ok: 1 });
  assert.equal(calls.length, 3);
});

test("fetchJSON honors Retry-After on 429", async () => {
  stubFetch([
    { status: 429, retryAfter: "0" },
    { status: 200, body: { ok: 2 } },
  ]);
  const started = Date.now();
  const data = await fetchJSON("https://x/y", { baseDelayMs: 1 });
  assert.deepEqual(data, { ok: 2 });
  assert.ok(Date.now() - started < 500);
});

test("fetchJSON gives up after the retry limit with a clear error", async () => {
  const calls = stubFetch([{ status: 429 }, { status: 429 }, { status: 429 }]);
  await assert.rejects(
    fetchJSON("https://x/y", { retries: 2, baseDelayMs: 1 }),
    /HTTP 429.*rate limit/i
  );
  assert.equal(calls.length, 3);
});

test("fetchJSON does not retry client errors other than 429", async () => {
  const calls = stubFetch([{ status: 404 }]);
  await assert.rejects(fetchJSON("https://x/y", { baseDelayMs: 1 }), /HTTP 404/);
  assert.equal(calls.length, 1);
});

test("fetchJSON retries server errors", async () => {
  const calls = stubFetch([{ status: 503 }, { status: 200, body: { ok: 3 } }]);
  assert.deepEqual(await fetchJSON("https://x/y", { baseDelayMs: 1 }), { ok: 3 });
  assert.equal(calls.length, 2);
});
