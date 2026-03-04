import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// ─── Config ───
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const CNC_YEAR = parseInt(process.env.CNC_YEAR || "2025");
const UMBRELLA_SLUG = `city-nature-challenge-${CNC_YEAR}`;
const API_BASE = "https://api.inaturalist.org/v1";
const PER_PAGE = 200;
const PROJECT_BATCH_SIZE = 10;

// CLI args
const args = process.argv.slice(2);
const singleProject = args.find((a) => a.startsWith("--project="))?.split("=")[1];
const projectsOnly = args.includes("--projects-only");
const statsOnly = args.includes("--stats-only");
const dryRun = args.includes("--dry-run");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY. Copy .env.example to .env and fill in values.");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Rate limiter ───
let lastRequestTime = 0;

async function rateLimitedFetch(url) {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 1000) {
    await new Promise((r) => setTimeout(r, 1000 - elapsed));
  }
  lastRequestTime = Date.now();

  const response = await fetch(url, {
    headers: { "User-Agent": "CNC-Sync-Script/1.0" },
  });

  if (response.status === 429) {
    console.warn("  Rate limited (429). Waiting 60s...");
    await new Promise((r) => setTimeout(r, 60000));
    lastRequestTime = Date.now();
    return rateLimitedFetch(url);
  }

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${url}`);
  }

  return response.json();
}

// ─── Step 1: Fetch all sub-project slugs ───
async function fetchProjects() {
  console.log(`\n=== Step 1: Fetching sub-projects from ${UMBRELLA_SLUG} ===\n`);

  const data = await rateLimitedFetch(`${API_BASE}/projects/${UMBRELLA_SLUG}`);
  const umbrella = data.results[0];
  const rules = umbrella.project_observation_rules || [];
  const projectIds = rules.map((r) => r.operand_id);

  console.log(`Found ${projectIds.length} sub-projects`);

  // Batch-fetch project details
  const projects = [];
  for (let i = 0; i < projectIds.length; i += PROJECT_BATCH_SIZE) {
    const batch = projectIds.slice(i, i + PROJECT_BATCH_SIZE);
    const batchData = await rateLimitedFetch(`${API_BASE}/projects/${batch.join(",")}`);
    for (const p of batchData.results) {
      projects.push({
        inat_project_id: p.id,
        slug: p.slug,
        title: p.title,
        icon_url: p.icon || null,
        year: CNC_YEAR,
      });
    }
    console.log(`  Fetched ${Math.min(i + PROJECT_BATCH_SIZE, projectIds.length)}/${projectIds.length} project details`);
  }

  // Get observation count for each project (to sort by size)
  console.log(`\nFetching observation counts...`);
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const countData = await rateLimitedFetch(
      `${API_BASE}/observations?project_id=${p.slug}&per_page=1`
    );
    p.total_observations = countData.total_results || 0;
    if ((i + 1) % 50 === 0 || i === projects.length - 1) {
      console.log(`  Counted ${i + 1}/${projects.length} projects`);
    }
  }

  // Sort by size ascending
  projects.sort((a, b) => a.total_observations - b.total_observations);

  if (!dryRun) {
    // Upsert to Supabase
    const { error } = await db.from("cnc_projects").upsert(projects, {
      onConflict: "slug",
    });
    if (error) throw new Error(`Supabase upsert cnc_projects: ${error.message}`);
    console.log(`\nSaved ${projects.length} projects to Supabase`);
  } else {
    console.log(`\n[DRY RUN] Would save ${projects.length} projects`);
    const total = projects.reduce((s, p) => s + p.total_observations, 0);
    console.log(`Total observations across all cities: ${total.toLocaleString()}`);
    console.log(`Smallest: ${projects[0].slug} (${projects[0].total_observations})`);
    console.log(`Largest: ${projects[projects.length - 1].slug} (${projects[projects.length - 1].total_observations})`);
  }

  return projects;
}

// ─── Step 2: Sync observations for a single project ───
function mapObservation(obs, projectSlug) {
  const photo =
    obs.photos && obs.photos[0] ? obs.photos[0].url.replace("square", "small") : null;
  return {
    inat_id: obs.id,
    project_slug: projectSlug,
    user_login: obs.user ? obs.user.login : null,
    user_icon: obs.user ? obs.user.icon : null,
    observed_on: obs.observed_on || null,
    quality_grade: obs.quality_grade || null,
    taxon_id: obs.taxon ? obs.taxon.id : null,
    taxon_name: obs.taxon ? obs.taxon.name : null,
    taxon_rank: obs.taxon ? obs.taxon.rank : null,
    min_species_taxon_id: obs.taxon ? obs.taxon.min_species_taxon_id : null,
    ancestor_ids: obs.taxon ? obs.taxon.ancestor_ids : null,
    common_name: obs.taxon ? obs.taxon.preferred_common_name : null,
    iconic_taxon_name: obs.taxon ? obs.taxon.iconic_taxon_name : null,
    photo_url: photo,
    faves_count: obs.faves_count || 0,
    created_at: obs.created_at || null,
  };
}

async function getSyncLog(projectSlug) {
  const { data, error } = await db
    .from("cnc_sync_log")
    .select("*")
    .eq("project_slug", projectSlug)
    .limit(1);

  if (error) {
    console.warn(`  Could not read sync log: ${error.message}`);
    return null;
  }
  return data.length > 0 ? data[0] : null;
}

async function updateSyncLog(projectSlug, updates) {
  // Upsert: insert if not exists, then update
  await db.from("cnc_sync_log").upsert(
    { project_slug: projectSlug, ...updates },
    { onConflict: "project_slug" }
  );
}

async function fullSyncProject(projectSlug, resumeIdAbove = 0) {
  let idAbove = resumeIdAbove;
  let totalFetched = 0;
  const syncStartedAt = new Date().toISOString();

  if (resumeIdAbove > 0) {
    console.log(`  Resuming full sync from id_above=${resumeIdAbove}`);
  }

  await updateSyncLog(projectSlug, {
    status: "in_progress",
    started_at: new Date().toISOString(),
  });

  while (true) {
    const url = `${API_BASE}/observations?project_id=${projectSlug}&per_page=${PER_PAGE}&order_by=id&order=asc${idAbove ? `&id_above=${idAbove}` : ""}`;
    const data = await rateLimitedFetch(url);
    const results = data.results || [];

    if (results.length === 0) break;

    const rows = results.map((obs) => mapObservation(obs, projectSlug));

    if (!dryRun) {
      const { error } = await db.from("cnc_observations").upsert(rows, {
        onConflict: "inat_id",
      });
      if (error) throw new Error(`Supabase upsert: ${error.message}`);
    }

    totalFetched += results.length;
    idAbove = results[results.length - 1].id;

    // Save checkpoint after each batch
    if (!dryRun) {
      await updateSyncLog(projectSlug, {
        last_id_above: idAbove,
        total_fetched: totalFetched + (resumeIdAbove > 0 ? 1 : 0), // approximate
      });
    }

    process.stdout.write(`  ${totalFetched} obs fetched (id_above=${idAbove})\r`);

    if (results.length < PER_PAGE) break;
  }

  console.log(`  ${totalFetched} observations synced (full)`);

  if (!dryRun) {
    await updateSyncLog(projectSlug, {
      status: "done",
      total_fetched: totalFetched,
      completed_at: syncStartedAt,
    });
  }

  return totalFetched;
}

async function incrementalSyncProject(projectSlug, completedAt) {
  let totalFetched = 0;
  let idAbove = 0;
  const syncStartedAt = new Date().toISOString();

  console.log(`  Incremental sync since ${completedAt}`);

  while (true) {
    const url = `${API_BASE}/observations?project_id=${projectSlug}&per_page=${PER_PAGE}&order_by=id&order=asc${idAbove ? `&id_above=${idAbove}` : ""}&updated_since=${encodeURIComponent(completedAt)}`;
    const data = await rateLimitedFetch(url);
    const results = data.results || [];

    if (results.length === 0) break;

    const rows = results.map((obs) => mapObservation(obs, projectSlug));

    if (!dryRun) {
      const { error } = await db.from("cnc_observations").upsert(rows, {
        onConflict: "inat_id",
      });
      if (error) throw new Error(`Supabase upsert: ${error.message}`);
    }

    totalFetched += results.length;
    idAbove = results[results.length - 1].id;
    process.stdout.write(`  ${totalFetched} obs updated (id_above=${idAbove})\r`);

    if (results.length < PER_PAGE) break;
  }

  console.log(`  ${totalFetched} observations updated (incremental)`);

  if (!dryRun && totalFetched >= 0) {
    await updateSyncLog(projectSlug, {
      completed_at: syncStartedAt,
    });
  }

  return totalFetched;
}

async function syncProject(projectSlug, index, total) {
  const prefix = `[${index}/${total}] ${projectSlug}`;
  console.log(`\n${prefix}`);

  if (dryRun) {
    console.log(`  [DRY RUN] Would sync observations`);
    return 0;
  }

  const log = await getSyncLog(projectSlug);

  if (!log || log.status === "pending") {
    // Fresh full sync
    return fullSyncProject(projectSlug);
  } else if (log.status === "in_progress") {
    // Resume interrupted full sync
    return fullSyncProject(projectSlug, log.last_id_above || 0);
  } else if (log.status === "done" && log.completed_at) {
    // Incremental sync
    return incrementalSyncProject(projectSlug, log.completed_at);
  } else if (log.status === "done") {
    // Done but no completed_at — do a full sync
    return fullSyncProject(projectSlug);
  }

  return 0;
}

// ─── Step 3: Fetch aggregate stats per project ───
async function syncProjectStats(project, index, total) {
  const prefix = `[${index}/${total}] ${project.slug}`;
  process.stdout.write(`${prefix}: fetching stats...\r`);

  const [observersData, speciesData] = await Promise.all([
    rateLimitedFetch(
      `${API_BASE}/observations/observers?project_id=${project.slug}&per_page=10`
    ),
    rateLimitedFetch(
      `${API_BASE}/observations/species_counts?project_id=${project.slug}&per_page=10&rank=species`
    ),
  ]);

  // Wait extra second since we made 2 requests
  await new Promise((r) => setTimeout(r, 1000));

  const topObservers = (observersData.results || []).map((r) => ({
    login: r.user.login,
    icon: r.user.icon,
    observation_count: r.observation_count,
    species_count: r.species_count,
  }));

  const topSpecies = (speciesData.results || []).map((r) => ({
    taxon_id: r.taxon.id,
    name: r.taxon.name,
    common_name: r.taxon.preferred_common_name,
    iconic_taxon_name: r.taxon.iconic_taxon_name,
    photo_url: r.taxon.default_photo ? r.taxon.default_photo.square_url : null,
    count: r.count,
  }));

  if (!dryRun) {
    const { error } = await db
      .from("cnc_projects")
      .update({
        top_observers: topObservers,
        top_species: topSpecies,
        synced_at: new Date().toISOString(),
      })
      .eq("slug", project.slug);

    if (error) console.warn(`  Stats update error for ${project.slug}: ${error.message}`);
  }

  console.log(`${prefix}: ${topObservers.length} observers, ${topSpecies.length} species`);
}

// ─── Main ───
async function main() {
  console.log(`\nCNC Sync — ${UMBRELLA_SLUG}`);
  console.log(`Supabase: ${SUPABASE_URL}`);
  if (dryRun) console.log("*** DRY RUN — no writes to Supabase ***");
  if (singleProject) console.log(`Single project: ${singleProject}`);
  console.log("");

  // Step 1: Fetch/load projects
  let projects;
  if (singleProject) {
    // Just sync one project
    projects = [{ slug: singleProject, total_observations: 0 }];
  } else {
    projects = await fetchProjects();
  }

  if (projectsOnly) {
    console.log("\n--projects-only flag set. Done.");
    return;
  }

  // Step 2: Sync observations
  if (!statsOnly) {
    console.log(`\n=== Step 2: Syncing observations for ${projects.length} projects ===`);
    let totalSynced = 0;
    for (let i = 0; i < projects.length; i++) {
      const count = await syncProject(projects[i].slug, i + 1, projects.length);
      totalSynced += count;
    }
    console.log(`\n=== Observations sync complete: ${totalSynced.toLocaleString()} total ===`);
  }

  // Step 3: Fetch aggregate stats
  if (!singleProject) {
    console.log(`\n=== Step 3: Fetching aggregate stats for ${projects.length} projects ===`);
    for (let i = 0; i < projects.length; i++) {
      await syncProjectStats(projects[i], i + 1, projects.length);
    }
    console.log(`\n=== Stats sync complete ===`);
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
