// Sticker Collage: sticker matching and collage layout for sticker-collage.html.
// No DOM here, so the node tests can load it.

// What a collage can show: its iNaturalist taxa and how the page names it.
const ANIMALS = {
  birds: {
    taxa: [3],
    noun: "bird species",
    unit: ["bird", "birds"],
    all: "All birds",
    slug: "bird",
  },
  mammals: {
    taxa: [40151],
    noun: "mammal species",
    unit: ["mammal", "mammals"],
    all: "All mammals",
    slug: "mammal",
  },
  both: {
    taxa: [3, 40151],
    noun: "bird & mammal species",
    unit: ["animal", "animals"],
    all: "All birds & mammals",
    slug: "sticker",
  },
};

function animalsConfig(kind) {
  return ANIMALS[kind] || ANIMALS.birds;
}

// Friendly names for the bird orders, used on the filter chips.
const BIRD_ORDER_NAMES = {
  Struthioniformes: "Ostriches",
  Rheiformes: "Rheas",
  Casuariiformes: "Cassowaries & emu",
  Apterygiformes: "Kiwis",
  Tinamiformes: "Tinamous",
  Anseriformes: "Waterfowl",
  Galliformes: "Gamebirds",
  Phoenicopteriformes: "Flamingos",
  Podicipediformes: "Grebes",
  Columbiformes: "Pigeons & doves",
  Mesitornithiformes: "Mesites",
  Pterocliformes: "Sandgrouse",
  Otidiformes: "Bustards",
  Musophagiformes: "Turacos",
  Cuculiformes: "Cuckoos",
  Caprimulgiformes: "Nightjars & allies",
  Nyctibiiformes: "Potoos",
  Steatornithiformes: "Oilbird",
  Podargiformes: "Frogmouths",
  Aegotheliformes: "Owlet-nightjars",
  Apodiformes: "Swifts & hummingbirds",
  Opisthocomiformes: "Hoatzin",
  Gruiformes: "Rails & cranes",
  Charadriiformes: "Shorebirds & gulls",
  Eurypygiformes: "Sunbittern & kagu",
  Phaethontiformes: "Tropicbirds",
  Gaviiformes: "Loons",
  Sphenisciformes: "Penguins",
  Procellariiformes: "Albatrosses & petrels",
  Ciconiiformes: "Storks",
  Suliformes: "Cormorants & boobies",
  Pelecaniformes: "Herons & pelicans",
  Cathartiformes: "New World vultures",
  Accipitriformes: "Hawks & eagles",
  Strigiformes: "Owls",
  Coliiformes: "Mousebirds",
  Leptosomiformes: "Cuckoo-roller",
  Trogoniformes: "Trogons",
  Bucerotiformes: "Hornbills & hoopoes",
  Coraciiformes: "Kingfishers & allies",
  Galbuliformes: "Jacamars & puffbirds",
  Piciformes: "Woodpeckers & toucans",
  Cariamiformes: "Seriemas",
  Falconiformes: "Falcons",
  Psittaciformes: "Parrots",
  Passeriformes: "Perching birds",
};

// The same for the mammal orders (iNaturalist's: whales are in Artiodactyla).
const MAMMAL_ORDER_NAMES = {
  Monotremata: "Monotremes",
  Didelphimorphia: "Opossums",
  Paucituberculata: "Shrew opossums",
  Microbiotheria: "Monito del monte",
  Dasyuromorphia: "Marsupial carnivores",
  Peramelemorphia: "Bandicoots & bilbies",
  Notoryctemorphia: "Marsupial moles",
  Diprotodontia: "Kangaroos, koalas & allies",
  Afrosoricida: "Tenrecs & golden moles",
  Macroscelidea: "Elephant shrews",
  Tubulidentata: "Aardvark",
  Hyracoidea: "Hyraxes",
  Proboscidea: "Elephants",
  Sirenia: "Manatees & dugongs",
  Cingulata: "Armadillos",
  Pilosa: "Sloths & anteaters",
  Scandentia: "Treeshrews",
  Dermoptera: "Colugos",
  Primates: "Primates",
  Rodentia: "Rodents",
  Lagomorpha: "Rabbits & pikas",
  Eulipotyphla: "Shrews, moles & hedgehogs",
  Chiroptera: "Bats",
  Pholidota: "Pangolins",
  Carnivora: "Carnivores",
  Perissodactyla: "Odd-toed ungulates",
  Artiodactyla: "Hoofed mammals & whales",
  Cetacea: "Whales & dolphins",
};

function orderName(order) {
  return BIRD_ORDER_NAMES[order] || MAMMAL_ORDER_NAMES[order] || order;
}

const THREATENED_IUCN = ["VU", "EN", "CR", "EW"];

// Sticker files: pinned to the index's tag (or commit) on jsDelivr (CORS-open,
// cached for good), with raw GitHub as the fallback. Originals, about 1,000 px tall.
function stickerUrls(sticker) {
  const path = `stickers/${sticker.order}/${sticker.family}/${sticker.stem}.webp`;
  return [
    `https://cdn.jsdelivr.net/gh/${sticker.repo}@${sticker.tag}/${path}`,
    `https://raw.githubusercontent.com/${sticker.repo}/${sticker.tag}/${path}`,
  ];
}

// Unpack a sticker index (BIRD_STICKERS in bird-stickers-data.js,
// MAMMAL_STICKERS in mammal-stickers-data.js) into lookups by scientific name.
// kind ("bird", "mammal") prefixes each sticker's key, unique across indexes.
function buildStickerIndex(data, kind = "bird") {
  const repo = data.repo || "alchaincyf/huashu-bird-sticker";
  const stickers = data.rows.split(";").map((row, index) => {
    const [stem, family, mass, iucn] = row.split("|");
    const [orderName, familyName, familyEnglish] = data.families[Number(family)];
    return {
      index,
      key: `${kind}/${stem}`,
      kind,
      repo,
      tag: data.tag,
      stem,
      name: stem.replace(/[_.]/g, " "),
      order: orderName,
      family: familyName,
      familyEnglish,
      massG: mass ? Number(mass) : 0,
      iucn: data.iucn[Number(iucn)] || "",
    };
  });
  // AVONET and EltonTraits have no mass for some species; give them their family's median.
  const familyMasses = new Map();
  for (const sticker of stickers) {
    if (!sticker.massG) continue;
    if (!familyMasses.has(sticker.family)) familyMasses.set(sticker.family, []);
    familyMasses.get(sticker.family).push(sticker.massG);
  }
  for (const sticker of stickers) {
    if (sticker.massG) continue;
    const masses = (familyMasses.get(sticker.family) || [30]).slice().sort((a, b) => a - b);
    sticker.massG = masses[Math.floor(masses.length / 2)];
    sticker.massEstimated = true;
  }
  const byName = new Map();
  for (const sticker of stickers) {
    if (!byName.has(sticker.name)) byName.set(sticker.name, sticker);
  }
  for (const [name, index] of Object.entries(data.aliases || {})) {
    if (!byName.has(name)) byName.set(name, stickers[index]);
  }
  const byGenus = new Map();
  for (const sticker of stickers) {
    if (sticker.stem.includes(".")) continue; // subspecies stickers
    const genus = sticker.name.split(" ")[0];
    if (!byGenus.has(genus)) byGenus.set(genus, []);
    byGenus.get(genus).push(sticker);
  }
  return { kind, tag: data.tag, stickers, byName, byGenus };
}

// The sticker for an iNaturalist taxon from whichever index covers its class
// ({ Aves: birdIndex, Mammalia: mammalIndex }, only the ones in the collage).
function matchTaxonSticker(indexes, taxon) {
  if (!taxon) return null;
  const own = indexes[taxon.iconic_taxon_name];
  if (own) return matchSticker(own, taxon.name);
  if (taxon.iconic_taxon_name) return null;
  for (const index of Object.values(indexes)) {
    const sticker = matchSticker(index, taxon.name);
    if (sticker) return sticker;
  }
  return null;
}

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length];
}

function commonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

// The sticker for an iNaturalist species name. Exact names and the dataset's
// older names first; then a spelling variant within the same genus
// (Pica nuttalli / nuttallii, Ramphocelus bresilius / bresilia,
// Icterus bullockii / bullockiorum), only when exactly one sticker is closest.
function matchSticker(index, scientificName) {
  const name = (scientificName || "").trim();
  if (index.byName.has(name)) return index.byName.get(name);
  const parts = name.split(" ");
  if (parts.length > 2) {
    const species = parts.slice(0, 2).join(" ");
    if (index.byName.has(species)) return index.byName.get(species);
  }
  if (parts.length < 2) return null;
  const [genus, epithet] = parts;
  let best = null;
  let bestScore = Infinity;
  let tie = false;
  for (const sticker of index.byGenus.get(genus) || []) {
    const other = sticker.name.split(" ")[1];
    const distance = editDistance(epithet, other);
    const prefix = commonPrefixLength(epithet, other);
    const close =
      distance <= 2 || (prefix >= 6 && prefix >= Math.min(epithet.length, other.length) - 1);
    if (!close) continue;
    const score = Math.min(distance, Math.max(epithet.length, other.length) - prefix);
    if (score < bestScore) {
      best = sticker;
      bestScore = score;
      tie = false;
    } else if (score === bestScore) {
      tie = true;
    }
  }
  return best && !tie ? best : null;
}

// ===== Layout =====

// Small deterministic random numbers, so a collage looks the same every time.
function seededRandom(seed) {
  let state = seed >>> 0 || 1;
  return function () {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

// How much of the page a bird gets, before scaling. Default: area follows
// mass^0.4, which keeps small birds visible next to big ones. True size: length
// follows the cube root of mass, so area follows mass^(2/3).
function stickerWeight(massG, trueSize) {
  const mass = Math.max(massG || 0, 2);
  return trueSize ? Math.pow(mass, 2 / 3) : Math.pow(mass, 0.4);
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "Jun–Aug" for a run of months (also across the new year: "Dec–Feb"),
// "Jan, Mar" otherwise, "" for none or all twelve.
function monthsLabel(months) {
  const set = Array.from(new Set(months || []))
    .map(Number)
    .filter((m) => m >= 1 && m <= 12)
    .sort((a, b) => a - b);
  if (!set.length || set.length === 12) return "";
  if (set.length === 1) return MONTH_NAMES[set[0] - 1];
  // A run is a set with exactly one gap when walked round the year.
  const gaps = set.map((m, i) => (set[(i + 1) % set.length] - m + 12) % 12 !== 1);
  if (gaps.filter(Boolean).length === 1) {
    const end = set[gaps.indexOf(true)];
    const start = set[(gaps.indexOf(true) + 1) % set.length];
    return `${MONTH_NAMES[start - 1]}–${MONTH_NAMES[end - 1]}`;
  }
  return set.map((m) => MONTH_NAMES[m - 1]).join(", ");
}

// ===== Lifers =====

// The first day of a collage's period: its from date, or 1 January of its
// year. "" when the period has no start (all time, or only an end date), when
// every bird would count as a lifer.
function periodStart(filters) {
  if (filters.d1) return String(filters.d1).slice(0, 10);
  if (filters.year) return `${filters.year}-01-01`;
  return "";
}

// "2026-11-19" for "2026-11-20", across months and years too.
function dayBefore(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
}

// The species_counts query for every species (of the collage's taxa) the user
// saw before a period starts, anywhere: those aren't lifers. Place, months,
// evidence and quality are left out on purpose (an animal seen once, anywhere,
// isn't new), but a wild-only collage doesn't count ones seen only in a zoo.
function priorQueryParams(username, start, wild, taxa = [3]) {
  let params = `user_login=${encodeURIComponent(username)}&taxon_id=${taxa.join(",")}&hrank=species&d2=${dayBefore(start)}`;
  if (wild) params += "&captive=false";
  return params;
}

// The line after the count: "bird species" (or the collage's own noun),
// "lifers", "threatened lifers", or "threatened lifers · Grebes" for a group
// (just "Grebes" with no status).
function collageWhat({ group = "", status = "", lifers = false, noun: species = "bird species" }) {
  const noun = lifers ? "lifers" : species;
  if (!group) return [status, noun].filter(Boolean).join(" ");
  const prefix = [status, lifers ? "lifers" : ""].filter(Boolean).join(" ");
  return prefix ? `${prefix} · ${group}` : group;
}

// The words in the middle: the automatic lines ({ who, count, what, where }),
// with any line the user typed in its place. A blank field keeps the automatic
// text; the count always follows the birds shown.
function centerText(auto, custom) {
  const lines = { ...auto };
  for (const key of ["who", "what", "where"]) {
    const text = String((custom && custom[key]) || "").trim();
    if (text) lines[key] = text;
  }
  return lines;
}

// The species_counts query for a collage's filters:
// { username, taxonId (a group), taxa (the collage's classes, birds by default), placeId, projectId, year, d1, d2, months, evidence
//   ("photos" | "sounds"), quality ("verifiable" | "research"),
//   establishment ("native" | "endemic" | "introduced"), wild }
function collageQueryParams(filters) {
  let params = `user_login=${encodeURIComponent(filters.username)}&taxon_id=${filters.taxonId || (filters.taxa || [3]).join(",")}&hrank=species`;
  if (filters.placeId) params += `&place_id=${filters.placeId}`;
  if (filters.projectId) params += `&project_id=${filters.projectId}`;
  if (filters.year) params += `&year=${filters.year}`;
  if (filters.d1) params += `&d1=${encodeURIComponent(filters.d1)}`;
  if (filters.d2) params += `&d2=${encodeURIComponent(filters.d2)}`;
  const months = monthsLabel(filters.months) ? filters.months : [];
  if (months.length)
    params += `&month=${months
      .slice()
      .sort((a, b) => a - b)
      .join(",")}`;
  if (filters.evidence === "photos") params += "&photos=true";
  if (filters.evidence === "sounds") params += "&sounds=true";
  if (filters.quality === "verifiable") params += "&verifiable=true";
  if (filters.quality === "research") params += "&quality_grade=research";
  if (["native", "endemic", "introduced"].includes(filters.establishment)) {
    params += `&${filters.establishment}=true`;
  }
  if (filters.wild) params += "&captive=false";
  return params;
}

// A sticker's mask on the layout grid, for a cw x ch box: `core`, the cells
// the bird covers (max-pooled from its alpha mask), and `test`, the same grown
// by `gap` cells, which must be free to put it down, so neighbours keep a gap.
// Offsets run from the middle out, so a blocked spot is usually rejected on the
// first test.
function gridMask(mask, cw, ch, gap) {
  const covered = new Uint8Array(cw * ch);
  for (let y = 0; y < mask.height; y++) {
    const gy = Math.min(ch - 1, Math.floor((y / mask.height) * ch));
    for (let x = 0; x < mask.width; x++) {
      if (mask.data[y * mask.width + x]) {
        covered[gy * cw + Math.min(cw - 1, Math.floor((x / mask.width) * cw))] = 1;
      }
    }
  }
  const core = [];
  const test = [];
  const seen = new Set();
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      if (!covered[y * cw + x]) continue;
      core.push([x, y]);
      for (let dy = -gap; dy <= gap; dy++) {
        for (let dx = -gap; dx <= gap; dx++) {
          const key = (y + dy) * 100000 + (x + dx);
          if (seen.has(key)) continue;
          seen.add(key);
          test.push([x + dx, y + dy]);
        }
      }
    }
  }
  if (!core.length) {
    core.push([Math.floor(cw / 2), Math.floor(ch / 2)]);
    test.push(core[0]);
  }
  const mx = cw / 2;
  const my = ch / 2;
  const byMiddle = (a, b) =>
    (a[0] - mx) ** 2 + (a[1] - my) ** 2 - ((b[0] - mx) ** 2 + (b[1] - my) ** 2);
  test.sort(byMiddle);
  return { core, test };
}

// Mark reserved areas (the count, the footer) on the grid. A reserve is a
// rectangle { x, y, w, h }; with shape "ellipse", the ellipse inside it
// (or, with a power above 2, a superellipse between the ellipse and the box).
function markReserve(occupied, cols, rows, cell, reserve) {
  for (const r of reserve) {
    const x0 = Math.max(0, Math.floor(r.x / cell));
    const y0 = Math.max(0, Math.floor(r.y / cell));
    const x1 = Math.min(cols, Math.ceil((r.x + r.w) / cell));
    const y1 = Math.min(rows, Math.ceil((r.y + r.h) / cell));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        if (r.shape === "ellipse") {
          // power 2 is an ellipse; higher powers square it off towards the box.
          const power = r.power || 2;
          const u = Math.abs(((x + 0.5) * cell - (r.x + r.w / 2)) / (r.w / 2));
          const v = Math.abs(((y + 0.5) * cell - (r.y + r.h / 2)) / (r.h / 2));
          if (u ** power + v ** power > 1) continue;
        }
        occupied[y * cols + x] = 2;
      }
    }
  }
}

function reserveArea(r) {
  if (r.shape !== "ellipse") return r.w * r.h;
  // Area of a superellipse |u|^p + |v|^p <= 1 over the box: Γ(1 + 1/p)² / Γ(1 + 2/p).
  const share = { 2: Math.PI / 4, 3: 0.8833, 4: 0.927 }[r.power || 2] || 0.9;
  return r.w * r.h * share;
}

// Pack stickers around a reserved middle (the species count), the way
// Everybird does: largest bird first, each at the free spot nearest the
// middle, so the big birds ring the count and the small ones fill in around
// them. If they don't all fit, shrink everything and start over. Then settle:
// each bird, nearest the middle first, steps one cell at a time towards the
// middle while it can, which closes the gaps between small stickers at the edge.
//
// birds:   [{ key, massG, aspect (width / height), opaque (0..1), mask: { width, height, data } }]
// options: { width, height, trueSize, reserve: [{ x, y, w, h, shape }], cols, fill, gap, maxShare }
// Returns  { placements: [{ key, x, y, w, h }], fill }, in the same units as width and height.
function layoutCollage(birds, options) {
  const { width, height, trueSize = false, reserve = [], cols = 320, gap = 1 } = options;
  const maxShare = options.maxShare || 0.36;
  const cell = width / cols;
  const rows = Math.ceil(height / cell);
  const freeArea = width * height - reserve.reduce((sum, r) => sum + reserveArea(r), 0);

  // Grid cells, nearest the middle first (in units of the page's own shape,
  // so the collage spreads to its edges), with a little jitter.
  const random = seededRandom(birds.length * 7919 + 17);
  const candidates = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const nx = (x + 0.5) / cols - 0.5;
      const ny = (y + 0.5) / rows - 0.5;
      // A superellipse (power 4): rounder than the page, squarer than an
      // oval, so the birds reach into the corners.
      const d = Math.pow(nx ** 4 + ny ** 4, 0.25);
      candidates.push({ x, y, d: d + random() * 0.012 });
    }
  }
  candidates.sort((a, b) => a.d - b.d);

  const weights = birds.map((bird) => stickerWeight(bird.massG, trueSize));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0) || 1;
  const order = birds
    .map((_, i) => i)
    .sort((a, b) => weights[b] - weights[a] || (birds[a].key < birds[b].key ? -1 : 1));

  function fits(occupied, test, left, top, cw, ch) {
    if (left < 1 || top < 1 || left + cw > cols - 1 || top + ch > rows - 1) return false;
    for (const [dx, dy] of test) {
      const gx = left + dx;
      const gy = top + dy;
      if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue;
      if (occupied[gy * cols + gx]) return false;
    }
    return true;
  }

  function stamp(occupied, core, left, top, value) {
    for (const [dx, dy] of core) occupied[(top + dy) * cols + left + dx] = value;
  }

  function pack(fill) {
    const occupied = new Uint8Array(cols * rows);
    markReserve(occupied, cols, rows, cell, reserve);
    const k = (fill * freeArea) / totalWeight;
    // Size each sticker by the area its bird covers, not its box.
    const sizes = birds.map((bird, i) => {
      const boxArea = (k * weights[i]) / Math.max(bird.opaque || 0.5, 0.15);
      const h = Math.sqrt(boxArea / bird.aspect);
      return { w: h * bird.aspect, h };
    });
    // No sticker may be wider or taller than maxShare of the page. Shrink them
    // all by the same factor rather than capping the big ones, so the sizes
    // keep following mass exactly (a few big birds would otherwise all come
    // out the same size).
    const limit = Math.min(
      1,
      ...sizes.map((s) => Math.min((maxShare * height) / s.h, (maxShare * width) / s.w))
    );
    const placed = [];
    for (const i of order) {
      const bird = birds[i];
      const h = sizes[i].h * limit;
      const w = sizes[i].w * limit;
      const cw = Math.max(1, Math.round(w / cell));
      const ch = Math.max(1, Math.round(h / cell));
      const mask = gridMask(bird.mask, cw, ch, gap);
      let spot = null;
      for (const candidate of candidates) {
        const left = candidate.x - Math.floor(cw / 2);
        const top = candidate.y - Math.floor(ch / 2);
        if (fits(occupied, mask.test, left, top, cw, ch)) {
          spot = { left, top };
          break;
        }
      }
      if (!spot) return null;
      stamp(occupied, mask.core, spot.left, spot.top, 1);
      placed.push({ key: bird.key, w, h, cw, ch, mask, left: spot.left, top: spot.top });
    }
    return { occupied, placed };
  }

  // Rounded-rectangle distance from the middle: birds settle towards it and
  // the corners of the page stay filled.
  const ax = cols / 2;
  const ay = rows / 2;
  function centrality(p, left, top) {
    const u = (left + p.cw / 2 - ax) / ax;
    const v = (top + p.ch / 2 - ay) / ay;
    const u2 = u * u;
    const v2 = v * v;
    return u2 * u2 * u2 * u2 + v2 * v2 * v2 * v2;
  }

  function settle({ occupied, placed }) {
    const MOVES = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const queue = placed
      .slice()
      .sort((a, b) => centrality(a, a.left, a.top) - centrality(b, b.left, b.top));
    for (const p of queue) {
      stamp(occupied, p.mask.core, p.left, p.top, 0);
      let best = centrality(p, p.left, p.top);
      for (let step = 0; step < 400; step++) {
        let next = null;
        for (const [mx, my] of MOVES) {
          const d = centrality(p, p.left + mx, p.top + my);
          if (d >= best - 1e-12) continue;
          if (!fits(occupied, p.mask.test, p.left + mx, p.top + my, p.cw, p.ch)) continue;
          best = d;
          next = [p.left + mx, p.top + my];
        }
        if (!next) break;
        [p.left, p.top] = next;
      }
      stamp(occupied, p.mask.core, p.left, p.top, 1);
    }
  }

  let fill = options.fill || 0.75;
  for (let attempt = 0; attempt < 16; attempt++) {
    const packed = pack(fill);
    if (packed) {
      settle(packed);
      return {
        fill,
        // Centre the real-size sticker on its grid box.
        placements: packed.placed.map((p) => ({
          key: p.key,
          x: (p.left + p.cw / 2) * cell - p.w / 2,
          y: (p.top + p.ch / 2) * cell - p.h / 2,
          w: p.w,
          h: p.h,
        })),
      };
    }
    fill *= 0.9;
  }
  return { placements: [], fill };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ANIMALS,
    animalsConfig,
    BIRD_ORDER_NAMES,
    MAMMAL_ORDER_NAMES,
    orderName,
    THREATENED_IUCN,
    stickerUrls,
    buildStickerIndex,
    matchSticker,
    matchTaxonSticker,
    editDistance,
    stickerWeight,
    MONTH_NAMES,
    monthsLabel,
    centerText,
    periodStart,
    dayBefore,
    priorQueryParams,
    collageWhat,
    collageQueryParams,
    gridMask,
    layoutCollage,
  };
}
