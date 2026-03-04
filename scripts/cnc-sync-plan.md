# CNC Data Pipeline: iNat API → Supabase (Step 1)

## Context
The cnc-achievements page currently fetches all observations live from iNat API. This works for small projects (<5k obs) but not for CNC at scale (2.7M+ obs across 664 cities in 2025).

The plan: a Node.js script that syncs all CNC city project data into Supabase, run manually once/day during the event. The web app then reads from Supabase instead of iNat API.

## Key numbers (CNC 2025)
- **664 sub-projects** under umbrella `city-nature-challenge-2025`
- **2,735,705 verifiable observations** total
- **~13,679 API pages** at 200/page → ~3.8 hours at 1 req/sec
- iNat daily limit: ~10,000 requests → need ~2 days for a full sync
- Most cities are small: median ~1,000 obs, ~90% under 10k

## Approach: Per-city API fetch → Supabase

**Why API, not CSV export**: The existing `supabase-sync.html` already implements API→Supabase with pagination, rate limiting, and upserts. The iNat CSV export requires login, queues jobs asynchronously, and can't be easily automated for 664 projects. The API approach is proven and scriptable.

**Why per-city, not umbrella**: Fetching from the umbrella project returns all 2.7M obs without city attribution. Per-city fetching lets us tag each observation with its `project_slug`, and we can process cities incrementally (smallest first, resume if interrupted).

## New file: `scripts/cnc-sync.js` (Node.js)

### Step 1: Fetch all sub-project slugs
```
GET /v1/projects/city-nature-challenge-2025
→ project_observation_rules[].operand_id → 664 project IDs
GET /v1/projects/{id1,id2,...,id10} (batch 10 per call → 67 calls)
→ slug, title, icon for each city
→ Save to Supabase `cnc_projects` table
```

### Step 2: For each city, fetch all observations
```
For each project (sorted by size, smallest first):
  GET /v1/observations?project_id={slug}&verifiable=true&per_page=200&order_by=id&order=asc&id_above={lastId}
  → Upsert each batch into Supabase `cnc_observations` table
  → Track progress in `cnc_sync_log` table (last_id_above per project)
  → Rate limit: 1 req/sec
  → Can resume from where it left off if interrupted
```

### Step 3: For each city, fetch aggregate stats
```
GET /v1/observations/observers?project_id={slug}&verifiable=true&per_page=10
GET /v1/observations/species_counts?project_id={slug}&verifiable=true&per_page=10
→ Store in `cnc_projects` table as JSON columns (top_observers, top_species)
```

### Supabase schema

**`cnc_projects`**
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| inat_project_id | int | unique |
| slug | text | unique, indexed |
| title | text | |
| icon_url | text | |
| year | int | 2025 |
| total_observations | int | from API total_results |
| top_observers | jsonb | cached from observers endpoint |
| top_species | jsonb | cached from species_counts endpoint |
| synced_at | timestamptz | |

**`cnc_observations`**
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| inat_id | int | unique, indexed |
| project_slug | text | indexed, FK-like |
| user_login | text | indexed |
| user_icon | text | |
| observed_on | date | indexed |
| quality_grade | text | |
| taxon_id | int | indexed |
| taxon_name | text | scientific name |
| common_name | text | |
| iconic_taxon_name | text | indexed |
| photo_url | text | square photo |
| faves_count | int | |
| created_at | timestamptz | |

**`cnc_sync_log`**
| Column | Type | Notes |
|--------|------|-------|
| project_slug | text | PK |
| last_id_above | int | resume cursor for incomplete full syncs |
| total_fetched | int | |
| status | text | pending/in_progress/done |
| started_at | timestamptz | |
| completed_at | timestamptz | used as `updated_since` for incremental syncs |

### Sync strategy (hybrid, matches `supabase-sync.html` pattern)

Uses two strategies depending on state — same approach as the existing `supabase-sync.html` (`fullSync` uses `id_above`, `incrementalSync` uses `updated_since`):

| State | Strategy | How |
|-------|----------|-----|
| No record / `status=pending` | **Full sync** | Paginate with `id_above=0`, save cursor after each batch |
| `status=in_progress` | **Resume full sync** | Paginate with `id_above={last_id_above}` from where it stopped |
| `status=done` | **Incremental sync** | Fetch with `updated_since={completed_at}` to catch new AND updated obs |

**Why both**: `id_above` is needed for resumable initial fetches (if script crashes mid-sync, restart from last cursor). `updated_since` (date) is needed for incremental syncs because it catches observations that were **updated** after initial fetch (quality_grade changes, taxon corrections, etc.) — not just new observations with higher IDs.

### Script features
- **Resumable**: Tracks `last_id_above` per project for incomplete full syncs
- **Incremental**: Uses `updated_since=completed_at` to catch new AND updated observations
- **Progress**: Prints progress per city (e.g., `[42/664] tokyo: 1200/3352 obs`)
- **Rate limiting**: 1 req/sec with exponential backoff on 429
- **Configurable**: Env vars for `SUPABASE_URL`, `SUPABASE_KEY`, `CNC_YEAR` (default 2025)
- **City ordering**: Process smallest cities first so most cities complete quickly

### Runtime estimate
| Phase | API calls | Time |
|-------|-----------|------|
| Fetch 664 project slugs | ~67 | ~1 min |
| Fetch aggregate stats (2 per city) | ~1,328 | ~22 min |
| Fetch all observations | ~13,679 | ~3.8 hours |
| **Total first run** | ~15,074 | **~4.2 hours** |
| **Subsequent runs (incremental)** | ~664 (check each) | **~11 min** |

Fits within iNat's 10k/day limit if split across 2 days for the first full sync. Incremental syncs (once/day during CNC) would be fast since only new observations since last run.

### Script file structure
```
scripts/
  cnc-sync.js          # Main sync script
  cnc-sync-plan.md     # This plan
  package.json         # Dependencies: @supabase/supabase-js, dotenv
  .env.example         # SUPABASE_URL, SUPABASE_KEY, CNC_YEAR
```

### Usage
```bash
# First time: full sync (may need 2 runs across days)
node scripts/cnc-sync.js

# Daily during CNC: incremental
node scripts/cnc-sync.js

# Sync just one city
node scripts/cnc-sync.js --project=city-nature-challenge-2025-tokyo
```

## Verification
- Run script → should print progress, fetch projects, then observations
- Check Supabase → `cnc_projects` has 664 rows, `cnc_observations` has data
- Interrupt and restart → resumes from last checkpoint
- Run again → incremental mode, only fetches new observations
- Query Supabase for a specific city → data matches iNat website
