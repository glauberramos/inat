// Pure triage logic for the Notification Inbox tool. DOM wiring lives in
// notifications.html; keeping the classification here lets Node run the tests.

// Ordered from most to least attention-worthy; a card takes the highest
// category among its events, and the filter chips follow the same order.
const CATEGORY_PRIORITY = [
  "disagreement",
  "mention",
  "comment",
  "new_id",
  "coarser",
  "refinement",
  "agreement",
  "other",
];

const CATEGORY_LABELS = {
  disagreement: "Disagreements",
  mention: "Mentions",
  comment: "Comments",
  new_id: "New IDs",
  coarser: "Coarser IDs",
  refinement: "Refinements",
  agreement: "Agreements",
  other: "Other",
};

// Compare another user's identification against my current ID on the same
// observation. Taxa are {id, ancestor_ids} where ancestor_ids may or may not
// include the taxon's own id depending on the endpoint — the equality check
// runs first so both shapes classify the same way.
function classifyIdentification(idTaxon, myTaxon, disagreement) {
  if (!idTaxon) return "other";
  if (!myTaxon) return "new_id";
  if (idTaxon.id === myTaxon.id) return "agreement";
  if ((idTaxon.ancestor_ids || []).includes(myTaxon.id)) return "refinement";
  if ((myTaxon.ancestor_ids || []).includes(idTaxon.id)) {
    return disagreement ? "disagreement" : "coarser";
  }
  return "disagreement";
}

function classifyUpdate(update, myTaxon, myLogin) {
  if (update.comment) {
    const body = (update.comment.body || "").toLowerCase();
    return myLogin && body.includes("@" + String(myLogin).toLowerCase()) ? "mention" : "comment";
  }
  if (update.identification) {
    return classifyIdentification(
      update.identification.taxon,
      myTaxon,
      update.identification.disagreement === true
    );
  }
  return "other";
}

// My current ID's taxon on an observation, or null if I have none.
function findMyCurrentIdTaxon(obs, myUserId) {
  if (!obs || !obs.identifications) return null;
  for (const ident of obs.identifications) {
    if (ident.current && ident.user && ident.user.id === myUserId) {
      return ident.taxon || null;
    }
  }
  return null;
}

function topCategory(categories) {
  for (const category of CATEGORY_PRIORITY) {
    if (categories.includes(category)) return category;
  }
  return "other";
}

// Group raw update records into one card per observation, newest first, with
// events inside each card also newest first.
function groupUpdatesByObservation(updates) {
  const byObs = new Map();
  for (const update of updates) {
    const obsId = update.resource_id;
    if (!byObs.has(obsId)) byObs.set(obsId, []);
    byObs.get(obsId).push(update);
  }
  const groups = [];
  for (const [obsId, events] of byObs) {
    events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    groups.push({
      obsId,
      events,
      unread: events.some((e) => !e.viewed),
      category: topCategory(events.map((e) => e.triageCategory)),
      latestAt: events[0].created_at,
    });
  }
  groups.sort((a, b) => new Date(b.latestAt) - new Date(a.latestAt));
  return groups;
}

function summarizeCategories(groups) {
  const counts = {};
  for (const category of CATEGORY_PRIORITY) counts[category] = 0;
  for (const group of groups) {
    for (const event of group.events) {
      counts[event.triageCategory] = (counts[event.triageCategory] || 0) + 1;
    }
  }
  return counts;
}

// Expiry of an iNaturalist API JWT in ms since epoch, or null if unreadable.
function decodeJwtExpiry(token) {
  try {
    const payload = String(token).split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

// Allow unit tests (Node) to import the pure helpers; no-op in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CATEGORY_PRIORITY,
    CATEGORY_LABELS,
    classifyIdentification,
    classifyUpdate,
    findMyCurrentIdTaxon,
    topCategory,
    groupUpdatesByObservation,
    summarizeCategories,
    decodeJwtExpiry,
  };
}
