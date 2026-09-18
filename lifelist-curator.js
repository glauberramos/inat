// Lifelist Curator — suggests species a user is likely to add to their
// lifelist next, based on what is commonly observed in a place minus what
// the user has already seen.
//
// Ranking runs in one of two modes:
//  - Jev mode: each candidate is scored by TypeSafe AI's Jev model
//    (https://typesafe.ai) through a small proxy that keeps the API key
//    secret (see jev-proxy-worker.js). Jev returns typed answers
//    (score/noul) that are combined into a rank here, in plain code.
//  - Heuristic mode (no proxy configured): local observation frequency
//    plus the user's taxon-group affinity. No AI involved, works offline
//    from any static host.
//
// Everything in this file is pure logic so it can run under node --test;
// all fetching and DOM work lives in lifelist-curator.html.

// Ordered levels for Jev "score" questions. Order matters: the first level
// maps to 0 and the last to 1 when answers are folded into a rank.
const JEV_CHANCE_LEVELS = ["very low", "low", "medium", "high", "very high"];
const JEV_AFFINITY_LEVELS = ["none", "weak", "moderate", "strong"];

// How much each Jev answer contributes to the final rank.
const JEV_WEIGHTS = { chance: 0.5, affinity: 0.3, ease: 0.2 };

// Heuristic mode: local frequency dominates, group affinity nudges.
const HEURISTIC_WEIGHTS = { frequency: 0.7, affinity: 0.3 };

const CURATOR_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Summarize a user's lifelist (raw species_counts rows) into the compact
// profile that goes into every Jev state. Passing the whole lifelist per
// candidate would work too — Jev input is cheap — but a summary keeps the
// state readable and the question focused.
function deriveUserProfile(userSpeciesRows) {
  const groups = {};
  let totalSpecies = 0;
  for (const row of userSpeciesRows || []) {
    if (!row.taxon) continue;
    totalSpecies++;
    const group = row.taxon.iconic_taxon_name || "Unknown";
    groups[group] = (groups[group] || 0) + 1;
  }
  const topGroups = Object.entries(groups)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([group, count]) => ({ group, count }));
  return { totalSpecies, topGroups };
}

// Turn place species_counts rows into ranking candidates, dropping species
// the user has already observed. observedIds is a Set of taxon ids.
function buildCandidates(placeSpeciesRows, observedIds, maxCandidates = 60) {
  const candidates = [];
  for (const row of placeSpeciesRows || []) {
    if (!row.taxon) continue;
    if (observedIds.has(row.taxon.id)) continue;
    candidates.push({
      taxonId: row.taxon.id,
      name: row.taxon.name,
      commonName: row.taxon.preferred_common_name || "",
      group: row.taxon.iconic_taxon_name || "Unknown",
      localCount: row.count || 0,
      photoUrl: row.taxon.default_photo ? row.taxon.default_photo.medium_url : "",
    });
    if (candidates.length >= maxCandidates) break;
  }
  return candidates;
}

// Build the { state, questions } item sent to Jev (via the proxy) for one
// candidate. The state carries the facts; the questions are deliberately
// atomic — one factor each — and get combined in combineJevAnswers.
// Seasonality is left to the model's own knowledge of the species'
// phenology (the state says which month it is) rather than fetched from
// per-species histogram calls, which would cost one extra iNat request per
// candidate.
function buildJevItem(profile, candidate, context) {
  const state = {
    user: {
      place: context.placeName,
      lifelist_species_total: profile.totalSpecies,
      most_observed_groups: profile.topGroups,
    },
    species: {
      scientific_name: candidate.name,
      common_name: candidate.commonName,
      group: candidate.group,
      observations_in_place: candidate.localCount,
    },
    context: {
      current_month: context.monthName,
      place: context.placeName,
    },
  };
  return {
    id: String(candidate.taxonId),
    state: JSON.stringify(state),
    questions: {
      chance: {
        type: "score",
        instructions:
          "How likely is this user to encounter this species in this place during the current month, considering the species' seasonality and how frequently it is observed there?",
        levels: JEV_CHANCE_LEVELS,
      },
      affinity: {
        type: "score",
        instructions:
          "How well does this species match the user's observation interests, based on the taxon groups they observe most?",
        levels: JEV_AFFINITY_LEVELS,
      },
      ease: {
        type: "noul",
        instructions:
          "Is this species reasonably easy for a hobbyist to find, photograph, and identify to species level from a photo?",
      },
    },
  };
}

// Map an ordered-level answer to 0..1 (first level 0, last level 1).
function scoreLevelValue(level, levels) {
  const index = levels.indexOf(level);
  if (index === -1) return null;
  return levels.length > 1 ? index / (levels.length - 1) : 0;
}

// Fold one candidate's Jev answers into a 0..1 rank. Answers arrive as
// { chance: { level }, affinity: { level }, ease: { value } } — level is
// the chosen score level, value is the noul truth value in 0..1. Missing
// or unrecognized answers drop their factor (weights renormalize) so one
// bad answer doesn't zero a candidate; returns null when nothing usable
// came back.
function combineJevAnswers(answers, weights = JEV_WEIGHTS) {
  if (!answers) return null;
  const parts = [];
  const chance = scoreLevelValue(answers.chance && answers.chance.level, JEV_CHANCE_LEVELS);
  if (chance !== null) parts.push({ value: chance, weight: weights.chance });
  const affinity = scoreLevelValue(answers.affinity && answers.affinity.level, JEV_AFFINITY_LEVELS);
  if (affinity !== null) parts.push({ value: affinity, weight: weights.affinity });
  const ease = answers.ease && typeof answers.ease.value === "number" ? answers.ease.value : null;
  if (ease !== null && ease >= 0 && ease <= 1) {
    parts.push({ value: ease, weight: weights.ease });
  }
  if (parts.length === 0) return null;
  const totalWeight = parts.reduce((sum, p) => sum + p.weight, 0);
  return parts.reduce((sum, p) => sum + p.value * p.weight, 0) / totalWeight;
}

// Fallback rank when no Jev proxy is configured: log-scaled local
// frequency (so the #1 species doesn't drown everything) blended with how
// much the user already observes the candidate's group.
function heuristicScore(candidate, profile, maxLocalCount) {
  const frequency =
    maxLocalCount > 0 ? Math.log1p(candidate.localCount) / Math.log1p(maxLocalCount) : 0;
  let affinity = 0;
  if (profile.totalSpecies > 0) {
    const match = profile.topGroups.find((g) => g.group === candidate.group);
    if (match) affinity = match.count / profile.totalSpecies;
  }
  return HEURISTIC_WEIGHTS.frequency * frequency + HEURISTIC_WEIGHTS.affinity * affinity;
}

// Attach scores (map of taxonId string -> 0..1 or null) and sort best
// first. Candidates without a usable score sink to the bottom but are kept,
// so a partial Jev failure still renders a full list.
function rankCandidates(candidates, scoresById) {
  return candidates
    .map((candidate) => ({
      ...candidate,
      score: scoresById[String(candidate.taxonId)] ?? null,
    }))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}

// Allow unit tests (Node) to import the helpers; no-op in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    JEV_CHANCE_LEVELS,
    JEV_AFFINITY_LEVELS,
    JEV_WEIGHTS,
    HEURISTIC_WEIGHTS,
    CURATOR_MONTH_NAMES,
    deriveUserProfile,
    buildCandidates,
    buildJevItem,
    scoreLevelValue,
    combineJevAnswers,
    heuristicScore,
    rankCandidates,
  };
}
