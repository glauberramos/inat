const test = require("node:test");
const assert = require("node:assert/strict");

const {
  isDateRangePreset,
  formatDateParam,
  subtractMonths,
  resolveDateRange,
  buildDateRangeParams,
} = require("../shared-utils.js");

// Local-time constructor so the tests don't depend on the machine timezone
const day = (y, m, d) => new Date(y, m - 1, d);

test("formatDateParam uses local calendar fields", () => {
  assert.equal(formatDateParam(day(2026, 8, 10)), "2026-08-10");
  assert.equal(formatDateParam(day(2026, 1, 5)), "2026-01-05");
});

test("subtractMonths clamps to the last day of the target month", () => {
  assert.equal(formatDateParam(subtractMonths(day(2026, 5, 31), 3)), "2026-02-28");
  assert.equal(formatDateParam(subtractMonths(day(2024, 5, 31), 3)), "2024-02-29");
  assert.equal(formatDateParam(subtractMonths(day(2026, 3, 15), 3)), "2025-12-15");
});

test("resolveDateRange returns no bounds for 'all' or unknown presets", () => {
  assert.deepEqual(resolveDateRange("all", "", "", day(2026, 8, 10)), { d1: null, d2: null });
  assert.deepEqual(resolveDateRange("nonsense", "", "", day(2026, 8, 10)), { d1: null, d2: null });
});

test("resolveDateRange computes the preset ranges relative to today", () => {
  const today = day(2026, 8, 10);
  assert.deepEqual(resolveDateRange("30d", "", "", today), {
    d1: "2026-07-11",
    d2: "2026-08-10",
  });
  assert.deepEqual(resolveDateRange("3m", "", "", today), {
    d1: "2026-05-10",
    d2: "2026-08-10",
  });
  assert.deepEqual(resolveDateRange("12m", "", "", today), {
    d1: "2025-08-10",
    d2: "2026-08-10",
  });
});

test("resolveDateRange handles month and year boundaries", () => {
  assert.deepEqual(resolveDateRange("30d", "", "", day(2026, 1, 15)), {
    d1: "2025-12-16",
    d2: "2026-01-15",
  });
  assert.deepEqual(resolveDateRange("12m", "", "", day(2024, 2, 29)), {
    d1: "2023-02-28",
    d2: "2024-02-29",
  });
});

test("resolveDateRange passes through the custom range, allowing open ends", () => {
  assert.deepEqual(resolveDateRange("custom", "2026-01-01", "2026-03-31"), {
    d1: "2026-01-01",
    d2: "2026-03-31",
  });
  assert.deepEqual(resolveDateRange("custom", "2026-01-01", ""), {
    d1: "2026-01-01",
    d2: null,
  });
  assert.deepEqual(resolveDateRange("custom", "", ""), { d1: null, d2: null });
});

test("buildDateRangeParams builds only the bounds that are set", () => {
  assert.equal(
    buildDateRangeParams({ d1: "2026-01-01", d2: "2026-03-31" }),
    "&d1=2026-01-01&d2=2026-03-31"
  );
  assert.equal(buildDateRangeParams({ d1: null, d2: "2026-03-31" }), "&d2=2026-03-31");
  assert.equal(buildDateRangeParams({ d1: null, d2: null }), "");
  assert.equal(buildDateRangeParams(null), "");
});

test("isDateRangePreset recognizes only the known presets", () => {
  ["all", "30d", "3m", "12m", "custom"].forEach((preset) => {
    assert.ok(isDateRangePreset(preset));
  });
  assert.equal(isDateRangePreset("42d"), false);
  assert.equal(isDateRangePreset("toString"), false);
});
