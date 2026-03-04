-- CNC Sync tables

-- Projects
create table cnc_projects (
  id serial primary key,
  inat_project_id int unique not null,
  slug text unique not null,
  title text,
  icon_url text,
  year int not null default 2025,
  total_observations int default 0,
  top_observers jsonb,
  top_species jsonb,
  synced_at timestamptz
);

create index idx_cnc_projects_year on cnc_projects(year);

-- Observations
create table cnc_observations (
  id serial primary key,
  inat_id int unique not null,
  project_slug text not null,
  user_login text,
  user_icon text,
  observed_on date,
  quality_grade text,
  taxon_id int,
  taxon_name text,
  common_name text,
  iconic_taxon_name text,
  photo_url text,
  faves_count int default 0,
  created_at timestamptz
);

create index idx_cnc_obs_project on cnc_observations(project_slug);
create index idx_cnc_obs_user on cnc_observations(user_login);
create index idx_cnc_obs_taxon on cnc_observations(taxon_id);
create index idx_cnc_obs_date on cnc_observations(observed_on);
create index idx_cnc_obs_iconic on cnc_observations(iconic_taxon_name);

-- Sync log
create table cnc_sync_log (
  project_slug text primary key,
  last_id_above int default 0,
  total_fetched int default 0,
  status text default 'pending',
  started_at timestamptz,
  completed_at timestamptz
);
