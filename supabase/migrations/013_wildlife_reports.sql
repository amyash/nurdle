-- Wildlife impact reports (moderated community sightings)
-- Run in the Supabase SQL editor after prior migrations.
-- Reports default to pending; only approved rows appear publicly.

create table if not exists public.wildlife_reports (
  id uuid primary key default gen_random_uuid(),
  beach_id text not null references public.beaches (id),
  date_observed date not null,
  time_observed text,
  animal_type text not null,
  species text,
  animal_count integer not null,
  condition text not null,
  description text not null,
  has_supporting_evidence boolean not null default false,
  email text not null,
  reporter_name text,
  status text not null default 'pending',
  verified_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint wildlife_reports_animal_type_check
    check (animal_type in (
      'bird', 'fish', 'seal', 'marine_mammal', 'crustacean', 'other', 'unknown'
    )),
  constraint wildlife_reports_condition_check
    check (condition in (
      'alive_distress', 'dead', 'interacting_nurdles', 'unsure'
    )),
  constraint wildlife_reports_status_check
    check (status in ('pending', 'approved', 'rejected')),
  constraint wildlife_reports_count_check
    check (animal_count >= 1 and animal_count <= 100),
  constraint wildlife_reports_species_len
    check (species is null or char_length(species) <= 80),
  constraint wildlife_reports_description_len
    check (char_length(description) >= 1 and char_length(description) <= 1000),
  constraint wildlife_reports_email_len
    check (char_length(email) >= 3 and char_length(email) <= 120),
  constraint wildlife_reports_name_len
    check (reporter_name is null or char_length(reporter_name) <= 40),
  constraint wildlife_reports_time_format
    check (time_observed is null or time_observed ~ '^\d{2}:\d{2}$')
);

create index if not exists wildlife_reports_status_idx
  on public.wildlife_reports (status);

create index if not exists wildlife_reports_date_idx
  on public.wildlife_reports (date_observed desc);

create index if not exists wildlife_reports_submitted_idx
  on public.wildlife_reports (submitted_at desc);

create or replace function public.create_wildlife_report(
  p_beach_id text,
  p_date_observed date,
  p_time_observed text default null,
  p_animal_type text default null,
  p_species text default null,
  p_animal_count integer default null,
  p_condition text default null,
  p_description text default null,
  p_has_supporting_evidence boolean default false,
  p_email text default null,
  p_reporter_name text default null
)
returns table (
  id uuid,
  status text,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_active boolean;
  v_species text;
  v_description text;
  v_email text;
  v_name text;
  v_time text;
  v_spill date := date '2026-07-19';
begin
  select b.is_active into v_active
  from public.beaches b
  where b.id = p_beach_id;

  if v_active is null then
    raise exception 'invalid_beach' using errcode = 'P0001';
  end if;
  if v_active is not true then
    raise exception 'invalid_beach' using errcode = 'P0001';
  end if;

  if p_date_observed is null
    or p_date_observed < v_spill
    or p_date_observed > (timezone('Europe/London', now()))::date then
    raise exception 'invalid_date' using errcode = 'P0001';
  end if;

  v_time := nullif(btrim(coalesce(p_time_observed, '')), '');
  if v_time is not null and v_time !~ '^\d{2}:\d{2}$' then
    raise exception 'invalid_date' using errcode = 'P0001';
  end if;

  if p_animal_type is null or p_animal_type not in (
    'bird', 'fish', 'seal', 'marine_mammal', 'crustacean', 'other', 'unknown'
  ) then
    raise exception 'invalid_animal' using errcode = 'P0001';
  end if;

  if p_animal_count is null or p_animal_count < 1 or p_animal_count > 100 then
    raise exception 'invalid_count' using errcode = 'P0001';
  end if;

  if p_condition is null or p_condition not in (
    'alive_distress', 'dead', 'interacting_nurdles', 'unsure'
  ) then
    raise exception 'invalid_condition' using errcode = 'P0001';
  end if;

  v_description := nullif(btrim(coalesce(p_description, '')), '');
  if v_description is null or char_length(v_description) > 1000 then
    raise exception 'invalid_description' using errcode = 'P0001';
  end if;

  v_species := nullif(btrim(coalesce(p_species, '')), '');
  if v_species is not null and char_length(v_species) > 80 then
    raise exception 'invalid_animal' using errcode = 'P0001';
  end if;

  v_email := lower(nullif(btrim(coalesce(p_email, '')), ''));
  if v_email is null
    or char_length(v_email) > 120
    or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid_email' using errcode = 'P0001';
  end if;

  v_name := nullif(btrim(regexp_replace(coalesce(p_reporter_name, ''), '\s+', ' ', 'g')), '');
  if v_name is not null then
    if char_length(v_name) > 40 or v_name ~ '[[:cntrl:]]' then
      raise exception 'invalid_name' using errcode = 'P0001';
    end if;
  end if;

  return query
  insert into public.wildlife_reports (
    beach_id,
    date_observed,
    time_observed,
    animal_type,
    species,
    animal_count,
    condition,
    description,
    has_supporting_evidence,
    email,
    reporter_name,
    status
  )
  values (
    p_beach_id,
    p_date_observed,
    v_time,
    p_animal_type,
    v_species,
    p_animal_count,
    p_condition,
    v_description,
    coalesce(p_has_supporting_evidence, false),
    v_email,
    v_name,
    'pending'
  )
  returning
    wildlife_reports.id,
    wildlife_reports.status,
    wildlife_reports.submitted_at;
end;
$$;

-- Public list: approved only, no PII
create or replace function public.list_approved_wildlife_reports()
returns table (
  id uuid,
  beach_id text,
  date_observed date,
  time_observed text,
  animal_type text,
  species text,
  animal_count integer,
  condition text,
  description text,
  has_supporting_evidence boolean,
  status text,
  verified_at timestamptz,
  submitted_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id,
    r.beach_id,
    r.date_observed,
    r.time_observed,
    r.animal_type,
    r.species,
    r.animal_count,
    r.condition,
    r.description,
    r.has_supporting_evidence,
    r.status,
    r.verified_at,
    r.submitted_at
  from public.wildlife_reports r
  where r.status = 'approved'
  order by r.date_observed desc, r.submitted_at desc;
$$;

create or replace function public.get_wildlife_impact_stats()
returns table (
  verified_reports bigint,
  animals_reported bigint,
  species_recorded bigint,
  awaiting_review bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (
      select count(*)::bigint
      from public.wildlife_reports r
      where r.status = 'approved'
    ) as verified_reports,
    (
      select coalesce(sum(r.animal_count), 0)::bigint
      from public.wildlife_reports r
      where r.status = 'approved'
    ) as animals_reported,
    (
      select count(distinct lower(coalesce(nullif(btrim(r.species), ''), r.animal_type)))::bigint
      from public.wildlife_reports r
      where r.status = 'approved'
    ) as species_recorded,
    (
      select count(*)::bigint
      from public.wildlife_reports r
      where r.status = 'pending'
    ) as awaiting_review;
$$;

-- Organiser moderation helper (run from SQL editor — not exposed in the public UI)
create or replace function public.set_wildlife_report_status(
  p_id uuid,
  p_status text
)
returns table (
  id uuid,
  status text,
  verified_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if p_status is null or p_status not in ('pending', 'approved', 'rejected') then
    raise exception 'invalid_status' using errcode = 'P0001';
  end if;

  return query
  update public.wildlife_reports r
  set
    status = p_status,
    verified_at = case
      when p_status = 'approved' then coalesce(r.verified_at, now())
      else null
    end
  where r.id = p_id
  returning r.id, r.status, r.verified_at;

  get diagnostics v_count = row_count;
  if v_count = 0 then
    raise exception 'not_found' using errcode = 'P0001';
  end if;
end;
$$;

alter table public.wildlife_reports enable row level security;

revoke all on table public.wildlife_reports from anon, authenticated;

grant execute on function public.create_wildlife_report(
  text, date, text, text, text, integer, text, text, boolean, text, text
) to anon, authenticated;
grant execute on function public.list_approved_wildlife_reports()
  to anon, authenticated;
grant execute on function public.get_wildlife_impact_stats()
  to anon, authenticated;
-- Keep set_wildlife_report_status callable by service/SQL only if preferred;
-- grant to authenticated for organiser tooling later if needed.
grant execute on function public.set_wildlife_report_status(uuid, text)
  to authenticated;
