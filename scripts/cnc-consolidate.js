import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// ─── Config ───
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const CNC_DAYS = ["2025-04-25", "2025-04-26", "2025-04-27", "2025-04-28"];
const SPECIES_OR_BELOW = new Set(["species", "subspecies", "variety", "form", "hybrid", "infraspecies"]);

// CLI args
const args = process.argv.slice(2);
const singleProject = args.find((a) => a.startsWith("--project="))?.split("=")[1];
const dryRun = args.includes("--dry-run");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY.");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Leaf species algorithm ───
function computeLeafSpecies(obs) {
  const allMinSpecies = new Set();
  const allAncestors = new Set();
  obs.forEach((o) => {
    if (o.min_species_taxon_id) allMinSpecies.add(o.min_species_taxon_id);
    if (o.ancestor_ids) {
      const ids = Array.isArray(o.ancestor_ids) ? o.ancestor_ids : JSON.parse(o.ancestor_ids);
      ids.forEach((id) => {
        if (id !== o.taxon_id && id !== o.min_species_taxon_id) {
          allAncestors.add(id);
        }
      });
    }
  });
  const leafSpecies = new Set();
  allMinSpecies.forEach((id) => {
    if (!allAncestors.has(id)) leafSpecies.add(id);
  });
  return leafSpecies;
}

// ─── Fetch all observations for a project ───
async function fetchAllObservations(slug) {
  let allObs = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await db
      .from("cnc_observations")
      .select("*")
      .eq("project_slug", slug)
      .range(from, from + pageSize - 1);

    if (error) {
      console.error(`  Supabase error: ${error.message}`);
      break;
    }
    if (!data || data.length === 0) break;
    allObs = allObs.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return allObs;
}

// ─── Compute all metrics ───
function computeStats(allObs) {
  const leafSpecies = computeLeafSpecies(allObs);

  // --- Summary + donuts ---
  const observersSet = new Set();
  let rg = 0, needsId = 0, casual = 0;
  const speciesByTaxon = {};
  const obsByUser = {};

  allObs.forEach((o) => {
    if (o.min_species_taxon_id && leafSpecies.has(o.min_species_taxon_id)) {
      const iconic = o.iconic_taxon_name || "Other";
      if (!speciesByTaxon[iconic]) speciesByTaxon[iconic] = new Set();
      speciesByTaxon[iconic].add(o.min_species_taxon_id);
    }
    if (o.user_login) {
      observersSet.add(o.user_login);
      obsByUser[o.user_login] = (obsByUser[o.user_login] || 0) + 1;
    }
    if (o.quality_grade === "research") rg++;
    else if (o.quality_grade === "needs_id") needsId++;
    else casual++;
  });

  const summary = {
    total_observations: allObs.length,
    total_species: leafSpecies.size,
    total_observers: observersSet.size,
    research_grade: rg,
    needs_id: needsId,
    casual: casual,
  };

  // Species by iconic taxon (for donut)
  const species_by_iconic_taxon = {};
  for (const [taxon, set] of Object.entries(speciesByTaxon)) {
    species_by_iconic_taxon[taxon] = set.size;
  }

  // Observer donut (top 7 + Others)
  const sortedObs = Object.entries(obsByUser).sort((a, b) => b[1] - a[1]);
  const topN = Math.min(7, sortedObs.length);
  const observer_donut = sortedObs.slice(0, topN).map(([login, count]) => ({ login, count }));
  const othersCount = sortedObs.slice(topN).reduce((sum, [, c]) => sum + c, 0);
  if (othersCount > 0) {
    observer_donut.push({ login: `Others (${sortedObs.length - topN})`, count: othersCount });
  }

  // --- Leaderboards ---
  const userObsMap = {};
  const userSpecies = {};
  allObs.forEach((o) => {
    if (!o.user_login) return;
    if (!userObsMap[o.user_login]) userObsMap[o.user_login] = { count: 0, icon: o.user_icon };
    userObsMap[o.user_login].count++;
    if (o.min_species_taxon_id && SPECIES_OR_BELOW.has(o.taxon_rank)) {
      if (!userSpecies[o.user_login]) userSpecies[o.user_login] = { species: new Set(), icon: o.user_icon };
      userSpecies[o.user_login].species.add(o.min_species_taxon_id);
    }
  });

  const top_observers = Object.entries(userObsMap)
    .map(([login, d]) => ({ login, count: d.count, icon: d.icon }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const top_species_users = Object.entries(userSpecies)
    .map(([login, d]) => ({ login, count: d.species.size, icon: d.icon }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top observed species (leaf-filtered, prefer species-rank name/photo)
  const speciesObs = {};
  allObs.forEach((o) => {
    if (!o.min_species_taxon_id || !leafSpecies.has(o.min_species_taxon_id)) return;
    const sid = o.min_species_taxon_id;
    if (!speciesObs[sid]) speciesObs[sid] = { name: o.common_name || o.taxon_name || "Unknown", sci: o.taxon_name, count: 0, photo: o.photo_url };
    if (o.taxon_rank === "species" || !speciesObs[sid].sci) {
      speciesObs[sid].name = o.common_name || o.taxon_name || speciesObs[sid].name;
      speciesObs[sid].sci = o.taxon_name || speciesObs[sid].sci;
      if (o.photo_url) speciesObs[sid].photo = o.photo_url;
    }
    speciesObs[sid].count++;
  });
  const top_observed_species = Object.values(speciesObs)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // --- Taxonomy stats ---
  const taxStats = {};
  allObs.forEach((o) => {
    const iconic = o.iconic_taxon_name;
    if (!iconic) return;
    if (!taxStats[iconic]) taxStats[iconic] = { obs: 0, species: new Set() };
    taxStats[iconic].obs++;
    if (o.min_species_taxon_id && leafSpecies.has(o.min_species_taxon_id)) {
      taxStats[iconic].species.add(o.min_species_taxon_id);
    }
  });
  const taxonomy_stats = {};
  for (const [key, s] of Object.entries(taxStats)) {
    taxonomy_stats[key] = { obs: s.obs, species: s.species.size };
  }

  // --- Daily breakdown ---
  const dayStatsMap = {};
  allObs.forEach((o) => {
    const d = o.observed_on;
    if (!d) return;
    if (!dayStatsMap[d]) dayStatsMap[d] = { obs: 0, species: new Set(), observers: new Set() };
    dayStatsMap[d].obs++;
    if (o.min_species_taxon_id && leafSpecies.has(o.min_species_taxon_id)) dayStatsMap[d].species.add(o.min_species_taxon_id);
    if (o.user_login) dayStatsMap[d].observers.add(o.user_login);
  });
  const daily_stats = {};
  for (const [d, s] of Object.entries(dayStatsMap)) {
    daily_stats[d] = { obs: s.obs, species: s.species.size, observers: s.observers.size };
  }

  // --- Highlights ---
  const speciesData = {};
  const userData = {};

  allObs.forEach((o) => {
    if (o.user_login) {
      const login = o.user_login;
      if (!userData[login]) {
        userData[login] = {
          login, avatar: o.user_icon || "",
          obsCount: 0, speciesSet: new Set(), iconicSet: new Set(),
          rgCount: 0, daySet: new Set(), obsByDay: {},
        };
      }
      const u = userData[login];
      u.obsCount++;
      if (o.min_species_taxon_id && SPECIES_OR_BELOW.has(o.taxon_rank)) u.speciesSet.add(o.min_species_taxon_id);
      if (o.iconic_taxon_name) u.iconicSet.add(o.iconic_taxon_name);
      if (o.quality_grade === "research") u.rgCount++;
      if (o.observed_on) {
        u.daySet.add(o.observed_on);
        u.obsByDay[o.observed_on] = (u.obsByDay[o.observed_on] || 0) + 1;
      }
    }

    if (o.min_species_taxon_id && leafSpecies.has(o.min_species_taxon_id)) {
      const tid = o.min_species_taxon_id;
      if (!speciesData[tid]) {
        speciesData[tid] = {
          taxon_id: tid, taxon_name: o.taxon_name, common_name: o.common_name,
          iconic_taxon_name: o.iconic_taxon_name, photo_url: o.photo_url,
          observers: new Set(), obsCount: 0, firstObs: null,
        };
      }
      const sp = speciesData[tid];
      if (o.taxon_rank === "species" || !sp.taxon_name) {
        sp.taxon_name = o.taxon_name || sp.taxon_name;
        sp.common_name = o.common_name || sp.common_name;
        if (o.photo_url) sp.photo_url = o.photo_url;
      }
      if (o.user_login) sp.observers.add(o.user_login);
      sp.obsCount++;
      if (!sp.firstObs || o.observed_on < sp.firstObs.date) {
        sp.firstObs = { login: o.user_login || "?", date: o.observed_on };
      }
    }
  });

  const allSpecies = Object.values(speciesData);
  const allUsers = Object.values(userData);

  // Exclusive Species
  const exclusiveSpeciesList = allSpecies
    .filter((s) => s.observers.size === 1)
    .sort((a, b) => b.obsCount - a.obsCount);

  const exclusive_species = exclusiveSpeciesList.slice(0, 10).map((s) => ({
    taxon_id: s.taxon_id, taxon_name: s.taxon_name, common_name: s.common_name,
    photo_url: s.photo_url, observer: [...s.observers][0], obs_count: s.obsCount,
  }));

  // Exclusive Observers
  const exclusiveObserverMap = {};
  exclusiveSpeciesList.forEach((s) => {
    const login = [...s.observers][0];
    if (!exclusiveObserverMap[login]) exclusiveObserverMap[login] = 0;
    exclusiveObserverMap[login]++;
  });
  const exclusive_observers = Object.entries(exclusiveObserverMap)
    .map(([login, count]) => ({ login, avatar: userData[login] ? userData[login].avatar : "", count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Community Favorites
  const community_favorites = allSpecies
    .filter((s) => s.observers.size > 1)
    .sort((a, b) => b.observers.size - a.observers.size)
    .slice(0, 10)
    .map((s) => ({
      taxon_id: s.taxon_id, taxon_name: s.taxon_name, common_name: s.common_name,
      photo_url: s.photo_url, observers_count: s.observers.size, obs_count: s.obsCount,
    }));

  // Quality Champions
  const quality_champions = allUsers
    .filter((u) => u.obsCount >= 10)
    .map((u) => ({ login: u.login, avatar: u.avatar, rg_pct: Math.round((u.rgCount / u.obsCount) * 100), rg_count: u.rgCount, obs_count: u.obsCount }))
    .sort((a, b) => b.rg_pct - a.rg_pct)
    .slice(0, 10);

  // All Days Heroes
  const all_days_heroes = allUsers
    .filter((u) => CNC_DAYS.every((d) => u.daySet.has(d)))
    .sort((a, b) => b.obsCount - a.obsCount)
    .map((u) => ({ login: u.login, avatar: u.avatar, obs_count: u.obsCount }));

  // Marathon Observers
  const marathon_observers = allUsers
    .filter((u) => Object.values(u.obsByDay).some((c) => c >= 20))
    .map((u) => {
      const best = Math.max(...Object.values(u.obsByDay));
      const bestDay = Object.entries(u.obsByDay).find(([, c]) => c === best)[0];
      return { login: u.login, avatar: u.avatar, best_day: bestDay, best_count: best };
    })
    .sort((a, b) => b.best_count - a.best_count);

  // Biodiversity Explorers
  const biodiversity_explorers = allUsers
    .map((u) => ({ login: u.login, avatar: u.avatar, iconic_count: u.iconicSet.size, species_count: u.speciesSet.size }))
    .sort((a, b) => b.iconic_count - a.iconic_count || b.species_count - a.species_count)
    .slice(0, 10);

  // New Species per Day
  const new_species_per_day = {};
  CNC_DAYS.forEach((d) => { new_species_per_day[d] = 0; });
  allSpecies.forEach((s) => {
    if (s.firstObs && new_species_per_day[s.firstObs.date] !== undefined) {
      new_species_per_day[s.firstObs.date]++;
    }
  });

  // Most Faved
  const most_faved = [...allObs]
    .filter((o) => o.faves_count > 0)
    .sort((a, b) => b.faves_count - a.faves_count)
    .slice(0, 10)
    .map((o) => ({
      inat_id: o.inat_id, common_name: o.common_name, taxon_name: o.taxon_name,
      photo_url: o.photo_url, user_login: o.user_login, faves_count: o.faves_count,
    }));

  // Recent Observations
  const recent_observations = [...allObs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 12)
    .map((o) => ({
      inat_id: o.inat_id, common_name: o.common_name, taxon_name: o.taxon_name,
      photo_url: o.photo_url, user_login: o.user_login, user_icon: o.user_icon,
      observed_on: o.observed_on, quality_grade: o.quality_grade,
    }));

  return {
    summary,
    species_by_iconic_taxon,
    observer_donut,
    top_observers,
    top_species_users,
    top_observed_species,
    taxonomy_stats,
    daily_stats,
    exclusive_species,
    exclusive_species_total: exclusiveSpeciesList.length,
    exclusive_observers,
    community_favorites,
    quality_champions,
    all_days_heroes,
    marathon_observers,
    biodiversity_explorers,
    new_species_per_day,
    most_faved,
    recent_observations,
  };
}

// ─── Consolidate a single project ───
async function consolidateProject(slug, index, total) {
  const prefix = `[${index}/${total}] ${slug}`;
  process.stdout.write(`${prefix}: loading observations...\r`);

  const allObs = await fetchAllObservations(slug);
  if (allObs.length === 0) {
    console.log(`${prefix}: no observations, skipping`);
    return;
  }

  process.stdout.write(`${prefix}: computing stats for ${allObs.length} obs...\r`);
  const stats = computeStats(allObs);

  if (!dryRun) {
    const { error } = await db
      .from("cnc_projects")
      .update({
        computed_stats: stats,
        computed_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (error) {
      console.error(`${prefix}: update error: ${error.message}`);
      return;
    }
  }

  console.log(`${prefix}: ${allObs.length} obs -> ${stats.summary.total_species} species, ${stats.summary.total_observers} observers ${dryRun ? "[DRY RUN]" : ""}`);
}

// ─── Main ───
async function main() {
  console.log("\nCNC Consolidate");
  console.log(`Supabase: ${SUPABASE_URL}`);
  if (dryRun) console.log("*** DRY RUN ***");

  let projects;
  if (singleProject) {
    projects = [{ slug: singleProject }];
  } else {
    const { data, error } = await db
      .from("cnc_projects")
      .select("slug")
      .order("total_observations", { ascending: true });

    if (error) throw new Error(`Fetch projects: ${error.message}`);
    projects = data;
  }

  console.log(`\nConsolidating ${projects.length} projects...\n`);

  for (let i = 0; i < projects.length; i++) {
    await consolidateProject(projects[i].slug, i + 1, projects.length);
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
