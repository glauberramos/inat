const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildStickerIndex,
  matchSticker,
  stickerUrls,
  stickerWeight,
  monthsLabel,
  centerText,
  collageQueryParams,
  layoutCollage,
} = require("../bird-collage.js");

const source = fs.readFileSync(path.join(__dirname, "..", "bird-stickers-data.js"), "utf8");
const index = buildStickerIndex(
  JSON.parse(source.slice(source.indexOf("{"), source.lastIndexOf("}") + 1))
);

test("matchSticker finds species by their current name", () => {
  const sticker = matchSticker(index, "Turdus rufiventris");
  assert.equal(sticker.stem, "Turdus_rufiventris");
  assert.equal(sticker.order, "Passeriformes");
  assert.equal(sticker.family, "Turdidae");
  assert.ok(sticker.massG > 0);
});

test("matchSticker uses a former species' own sticker", () => {
  assert.equal(matchSticker(index, "Anas carolinensis").stem, "Anas_crecca.carolinensis");
  assert.equal(matchSticker(index, "Anas crecca carolinensis").stem, "Anas_crecca.carolinensis");
});

test("matchSticker falls back to a spelling variant in the same genus", () => {
  assert.equal(matchSticker(index, "Pica nuttalli").stem, "Pica_nuttallii");
  assert.equal(matchSticker(index, "Ramphocelus bresilius").stem, "Ramphocelus_bresilia");
  assert.equal(matchSticker(index, "Icterus bullockii").stem, "Icterus_bullockiorum");
  assert.equal(matchSticker(index, "Cyanocorax caeruleus").stem, "Cyanocorax_coeruleus");
});

test("matchSticker returns null for unknown names", () => {
  assert.equal(matchSticker(index, "Foo bar"), null);
  assert.equal(matchSticker(index, "Turdus"), null);
});

test("every sticker has a mass, estimated from its family when AVONET has none", () => {
  assert.ok(index.stickers.every((sticker) => sticker.massG > 0));
});

test("stickerUrls points at the pinned original files", () => {
  const [primary, fallback] = stickerUrls(matchSticker(index, "Turdus rufiventris"), index.tag);
  assert.equal(
    primary,
    `https://cdn.jsdelivr.net/gh/alchaincyf/huashu-bird-sticker@${index.tag}/stickers/Passeriformes/Turdidae/Turdus_rufiventris.webp`
  );
  assert.match(fallback, /^https:\/\/raw\.githubusercontent\.com\//);
});

test("stickerWeight: true size grows faster with mass than the evened-out size", () => {
  const even = stickerWeight(1000, false) / stickerWeight(10, false);
  const real = stickerWeight(1000, true) / stickerWeight(10, true);
  assert.ok(real > even);
});

function ellipseMask() {
  const width = 30;
  const height = 40;
  const data = new Uint8Array(width * height);
  let covered = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (((x - 15) / 14) ** 2 + ((y - 20) / 19) ** 2 < 1) {
        data[y * width + x] = 1;
        covered++;
      }
    }
  }
  return { mask: { width, height, data }, opaque: covered / data.length };
}

function sampleBirds(count) {
  return Array.from({ length: count }, (_, i) => {
    const { mask, opaque } = ellipseMask();
    return { key: `bird${i}`, massG: 5 + ((i * 37) % 400) * 3, aspect: 0.75, opaque, mask };
  });
}

function overlaps(a, b) {
  // Shrink to the ellipse inside each box: boxes may touch at the corners.
  const ax = a.x + a.w / 2;
  const ay = a.y + a.h / 2;
  const bx = b.x + b.w / 2;
  const by = b.y + b.h / 2;
  return Math.abs(ax - bx) < ((a.w + b.w) / 2) * 0.7 && Math.abs(ay - by) < ((a.h + b.h) / 2) * 0.7;
}

test("layoutCollage places every bird inside the page without overlaps", () => {
  const birds = sampleBirds(60);
  const hole = { shape: "ellipse", x: 650, y: 350, w: 300, h: 200 };
  const { placements } = layoutCollage(birds, { width: 1600, height: 900, reserve: [hole] });
  assert.equal(placements.length, birds.length);
  for (const p of placements) {
    assert.ok(
      p.x >= 0 && p.y >= 0 && p.x + p.w <= 1600 && p.y + p.h <= 900,
      `${p.key} is off the page`
    );
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2;
    assert.ok(((cx - 800) / 150) ** 2 + ((cy - 450) / 100) ** 2 > 1, `${p.key} sits on the count`);
  }
  for (let i = 0; i < placements.length; i++) {
    for (let j = i + 1; j < placements.length; j++) {
      assert.ok(
        !overlaps(placements[i], placements[j]),
        `${placements[i].key} overlaps ${placements[j].key}`
      );
    }
  }
});

test("layoutCollage puts the heaviest birds nearest the middle", () => {
  const birds = sampleBirds(80);
  const { placements } = layoutCollage(birds, {
    width: 1600,
    height: 900,
    reserve: [{ shape: "ellipse", x: 650, y: 350, w: 300, h: 200 }],
  });
  const mass = new Map(birds.map((bird) => [bird.key, bird.massG]));
  const distance = (p) => Math.hypot((p.x + p.w / 2 - 800) / 1600, (p.y + p.h / 2 - 450) / 900);
  const byMass = placements.slice().sort((a, b) => mass.get(b.key) - mass.get(a.key));
  const mean = (list) => list.reduce((sum, p) => sum + distance(p), 0) / list.length;
  assert.ok(mean(byMass.slice(0, 10)) < mean(byMass.slice(-10)));
});

test("layoutCollage is deterministic", () => {
  const options = { width: 1600, height: 900, reserve: [{ x: 700, y: 400, w: 200, h: 100 }] };
  const a = layoutCollage(sampleBirds(30), options);
  const b = layoutCollage(sampleBirds(30), options);
  assert.deepEqual(a, b);
});

test("monthsLabel names runs, lists the rest, and drops none or all", () => {
  assert.equal(monthsLabel([]), "");
  assert.equal(monthsLabel([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), "");
  assert.equal(monthsLabel([7]), "Jul");
  assert.equal(monthsLabel([6, 7, 8]), "Jun–Aug");
  assert.equal(monthsLabel([12, 1, 2]), "Dec–Feb");
  assert.equal(monthsLabel([1, 3]), "Jan, Mar");
});

test("collageQueryParams builds the species_counts filters", () => {
  const params = new URLSearchParams(
    collageQueryParams({
      username: "pampasorro",
      placeId: "6878",
      d1: "2025-01-01",
      d2: "2025-12-31",
      months: [12, 1, 2],
      evidence: "sounds",
      quality: "research",
      establishment: "endemic",
      wild: true,
    })
  );
  assert.equal(params.get("user_login"), "pampasorro");
  assert.equal(params.get("taxon_id"), "3");
  assert.equal(params.get("hrank"), "species");
  assert.equal(params.get("place_id"), "6878");
  assert.equal(params.get("d1"), "2025-01-01");
  assert.equal(params.get("d2"), "2025-12-31");
  assert.equal(params.get("month"), "1,2,12");
  assert.equal(params.get("sounds"), "true");
  assert.equal(params.get("quality_grade"), "research");
  assert.equal(params.get("endemic"), "true");
  assert.equal(params.get("captive"), "false");
});

test("collageQueryParams leaves out unset filters and all-twelve months", () => {
  const params = new URLSearchParams(
    collageQueryParams({
      username: "a b",
      taxonId: 7823,
      projectId: "123",
      year: "2024",
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    })
  );
  assert.equal(params.get("user_login"), "a b");
  assert.equal(params.get("taxon_id"), "7823");
  assert.equal(params.get("project_id"), "123");
  assert.equal(params.get("year"), "2024");
  for (const key of [
    "month",
    "place_id",
    "photos",
    "sounds",
    "verifiable",
    "quality_grade",
    "native",
    "captive",
    "d1",
  ]) {
    assert.equal(params.has(key), false, key);
  }
});

test("layoutCollage keeps birds out of a superellipse hole", () => {
  const hole = { shape: "ellipse", power: 3, x: 600, y: 330, w: 400, h: 240 };
  const { placements } = layoutCollage(sampleBirds(50), {
    width: 1600,
    height: 900,
    reserve: [hole],
  });
  assert.equal(placements.length, 50);
  for (const p of placements) {
    const u = Math.abs((p.x + p.w / 2 - 800) / 200);
    const v = Math.abs((p.y + p.h / 2 - 450) / 120);
    assert.ok(u ** 3 + v ** 3 > 1, `${p.key} sits in the hole`);
  }
});

test("layoutCollage keeps true-size proportions when the biggest birds hit the size cap", () => {
  // A few birds with a wide mass range: the big ones would overflow the cap.
  const masses = [8000, 3000, 900, 250, 40];
  const birds = masses.map((massG, i) => {
    const { mask, opaque } = ellipseMask();
    return { key: `bird${i}`, massG, aspect: 0.75, opaque, mask };
  });
  const { placements } = layoutCollage(birds, { width: 1600, height: 900, trueSize: true });
  assert.equal(placements.length, masses.length);
  const height = new Map(placements.map((p) => [p.key, p.h]));
  for (let i = 1; i < masses.length; i++) {
    const expected = Math.cbrt(masses[0] / masses[i]);
    const actual = height.get("bird0") / height.get(`bird${i}`);
    assert.ok(Math.abs(actual - expected) < 1e-9, `bird0 / bird${i}: ${actual} vs ${expected}`);
  }
  assert.ok(Math.max(...placements.map((p) => p.h)) <= 900 * 0.36 + 1e-9);
});

test("centerText swaps in the typed lines and keeps the automatic ones for blanks", () => {
  const auto = {
    who: "@pampasorro",
    count: "63",
    what: "bird species",
    where: "Encruzilhada do Sul",
  };
  assert.deepEqual(centerText(auto, { who: " Glauber ", what: "", where: "Parque Podocarpus" }), {
    who: "Glauber",
    count: "63",
    what: "bird species",
    where: "Parque Podocarpus",
  });
  assert.deepEqual(centerText(auto, { what: "Lifers", where: "   " }), { ...auto, what: "Lifers" });
  assert.deepEqual(centerText(auto, null), auto);
  // The count can't be typed over.
  assert.equal(centerText(auto, { count: "999" }).count, "63");
});
