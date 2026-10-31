// Tree-building helpers for the Species Tree page. The page fetches
// /observations/taxonomy, which lists every taxon on the path from Life down
// to each observed taxon (id, name, rank, parent_id), and turns it into a
// nested tree here.

const LIFE_TAXON_ID = 48460;

// Ranks kept in the "main ranks" view; everything in between (subfamily,
// tribe, section...) is skipped and its children attach to the nearest kept
// ancestor. Ranks below species are dropped: they roll up into their species.
const MAJOR_RANKS = ["kingdom", "phylum", "class", "order", "family", "genus", "species"];
const SPECIES_RANK_LEVEL = 10;

// Build the tree from /observations/taxonomy rows. Each node gets:
//   species - distinct species in its subtree (the number people care about)
//   weight  - size used to draw it: species count, plus 1 for each branch that
//             ends above species (observations only identified to genus, say),
//             so those stay visible instead of collapsing to nothing.
function buildSpeciesTree(rows, { majorOnly = true } = {}) {
  const byId = new Map();
  for (const row of rows || []) {
    if (!row || row.id == null) continue;
    byId.set(row.id, {
      id: row.id,
      name: row.name,
      rank: row.rank,
      rankLevel: row.rank_level,
      iconic: row.iconic_taxon_name || null,
      parentId: row.parent_id ?? null,
      directObs: row.direct_obs_count || 0,
      descendantObs: row.descendant_obs_count || 0,
      children: [],
      parent: null,
      species: 0,
      weight: 0,
    });
  }

  let root = byId.get(LIFE_TAXON_ID);
  if (!root) {
    root = {
      id: LIFE_TAXON_ID,
      name: "Life",
      rank: "stateofmatter",
      rankLevel: 100,
      iconic: null,
      parentId: null,
      directObs: 0,
      descendantObs: 0,
      children: [],
      parent: null,
      species: 0,
      weight: 0,
    };
    byId.set(root.id, root);
  }

  const keep = (node) =>
    node === root ||
    (majorOnly ? MAJOR_RANKS.includes(node.rank) : node.rankLevel >= SPECIES_RANK_LEVEL);

  // Nearest kept ancestor, memoized since many nodes share long ancestor chains
  const keptParent = new Map();
  const findKeptParent = (node) => {
    const chain = [];
    let current = byId.get(node.parentId);
    let found = root;
    while (current) {
      if (keptParent.has(current.id)) {
        found = keptParent.get(current.id);
        break;
      }
      if (keep(current)) {
        found = current;
        break;
      }
      chain.push(current);
      current = byId.get(current.parentId);
    }
    for (const skipped of chain) keptParent.set(skipped.id, found);
    return found;
  };

  for (const node of byId.values()) {
    if (node === root || !keep(node)) continue;
    const parent = findKeptParent(node);
    node.parent = parent;
    parent.children.push(node);
  }

  const finish = (node) => {
    let species = node.rank === "species" ? 1 : 0;
    let weight = 0;
    for (const child of node.children) {
      finish(child);
      species += child.species;
      weight += child.weight;
    }
    node.species = species;
    node.weight = node.rank === "species" ? 1 : Math.max(weight, node.children.length ? 0 : 1);
    node.children.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));
  };
  finish(root);

  // Life itself is not a branch that ends early
  if (!root.children.length) root.weight = 0;
  return root;
}

// How many distinct taxa of each main rank the tree holds
function countByRank(root) {
  const counts = Object.fromEntries(MAJOR_RANKS.map((rank) => [rank, 0]));
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (node.rank in counts) counts[node.rank]++;
    stack.push(...node.children);
  }
  return counts;
}

// Give every node its slice of the full circle, as fractions of a turn
// (x0..x1), plus its depth below Life. Zooming the sunburst is then just a
// change of view window, which is what lets it animate smoothly.
function partitionTree(root) {
  root.x0 = 0;
  root.x1 = 1;
  root.depth = 0;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    const total = node.children.reduce((sum, child) => sum + child.weight, 0);
    let x = node.x0;
    for (const child of node.children) {
      const span = total ? ((node.x1 - node.x0) * child.weight) / total : 0;
      child.x0 = x;
      child.x1 = x + span;
      child.depth = node.depth + 1;
      x += span;
      stack.push(child);
    }
  }
  return root;
}

// The view window that puts `focus` in the center of the sunburst
function sunburstView(focus) {
  return { x0: focus.x0, x1: focus.x1, depth: focus.depth };
}

// Where a node lands in a view: angles in radians from 12 o'clock, clamped
// to the circle, and its ring (1 is the innermost ring around the center).
function arcGeometry(node, view) {
  const width = view.x1 - view.x0 || 1;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  return {
    start: clamp((node.x0 - view.x0) / width) * Math.PI * 2,
    end: clamp((node.x1 - view.x0) / width) * Math.PI * 2,
    ring: node.depth - view.depth,
  };
}

// Descendants of `focus` drawn as arcs, up to `maxDepth` rings out. Arcs
// thinner than `minAngle` radians are left out (with their whole subtree) so
// huge trees stay fast. Needs partitionTree to have run.
function visibleArcs(focus, { maxDepth = 4, minAngle = 0.002 } = {}) {
  const nodes = [];
  const width = focus.x1 - focus.x0;
  if (!width) return nodes;
  const stack = [...focus.children];
  while (stack.length) {
    const node = stack.pop();
    const ring = node.depth - focus.depth;
    if (ring > maxDepth || ((node.x1 - node.x0) / width) * Math.PI * 2 < minAngle) continue;
    nodes.push(node);
    stack.push(...node.children);
  }
  return nodes;
}

// Lay out the node-link tree, Life on the left and one column per level.
// Collapsed nodes and leaves each take a row; an open node sits midway
// between its first and last child. Returns id -> {x, y, top, bottom, node},
// where top..bottom is the vertical extent of the node's visible subtree.
function layoutTree(root, isOpen, { rowHeight = 46, columnWidth = 220 } = {}) {
  const positions = new Map();
  let row = 0;
  const visit = (node, depth) => {
    let position;
    if (node.children.length && isOpen(node)) {
      const first = visit(node.children[0], depth + 1);
      let last = first;
      for (let i = 1; i < node.children.length; i++) last = visit(node.children[i], depth + 1);
      position = {
        x: depth * columnWidth,
        y: (first.y + last.y) / 2,
        top: first.top,
        bottom: last.bottom,
        node,
      };
    } else {
      const y = row * rowHeight;
      row++;
      position = { x: depth * columnWidth, y, top: y, bottom: y, node };
    }
    positions.set(node.id, position);
    return position;
  };
  visit(root, 0);
  return positions;
}

// The species whose photo stands for a coarser taxon: follow the biggest
// branch down until reaching a species.
function representativeSpecies(node) {
  let current = node;
  while (current && current.rank !== "species" && current.children.length) {
    current = current.children[0];
  }
  return current && current.rank === "species" ? current : null;
}

// From /observations results (best first), pick the first photographed
// observation of each wanted species. An observation of a subspecies counts
// for its species, found through the taxon's ancestor_ids.
function pickObservationPhotos(observations, speciesIds) {
  const wanted = new Set(speciesIds);
  const picked = new Map();
  for (const obs of observations || []) {
    const photo = obs.photos && obs.photos[0];
    if (!photo || !obs.taxon) continue;
    const candidates = [obs.taxon.id, ...(obs.taxon.ancestor_ids || [])];
    const speciesId = candidates.find((id) => wanted.has(id));
    if (speciesId == null || picked.has(speciesId)) continue;
    picked.set(speciesId, {
      observationId: obs.id,
      photo: photo.url,
      observedOn: obs.observed_on || null,
      place: obs.place_guess || null,
    });
  }
  return picked;
}

// iNaturalist photo URLs end in /square.jpg; other sizes swap that word
function photoSize(url, size) {
  return url ? url.replace(/\/square\./, `/${size}.`) : url;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// Path from Life down to the node, both included
function pathToRoot(node) {
  const path = [];
  for (let current = node; current; current = current.parent) path.unshift(current);
  return path;
}

function findNode(root, id) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (node.id === id) return node;
    stack.push(...node.children);
  }
  return null;
}

// Nodes whose scientific name (or a known common name) contains the query,
// coarsest ranks first so "Aves" finds the class before any "Avesia" genus.
function searchTree(root, query, commonNames = new Map(), limit = 20) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const matches = [];
  const stack = [...root.children];
  while (stack.length) {
    const node = stack.pop();
    const common = commonNames.get(node.id);
    if (
      node.name.toLowerCase().includes(needle) ||
      (common && common.toLowerCase().includes(needle))
    ) {
      matches.push(node);
    }
    stack.push(...node.children);
  }
  matches.sort(
    (a, b) =>
      b.rankLevel - a.rankLevel ||
      Number(!a.name.toLowerCase().startsWith(needle)) -
        Number(!b.name.toLowerCase().startsWith(needle)) ||
      b.weight - a.weight
  );
  return matches.slice(0, limit);
}

// Allow unit tests (Node) to import the helpers; no-op in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LIFE_TAXON_ID,
    MAJOR_RANKS,
    buildSpeciesTree,
    countByRank,
    partitionTree,
    sunburstView,
    arcGeometry,
    visibleArcs,
    layoutTree,
    representativeSpecies,
    pickObservationPhotos,
    photoSize,
    easeInOutCubic,
    pathToRoot,
    findNode,
    searchTree,
  };
}
