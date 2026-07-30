-- Auto-publish wildlife reports on submit; soft-remove with email confirmation.
-- Run after 013_wildlife_reports.sql (and 014 if using Brown’s Bay).

alter table public.wildlife_reports
  add column if not exists removed_at timestamptz;

alter table public.wildlife_reports
  alter column status set default 'approved';

-- Publish any existing pending reports so they appear immediately
update public.wildlife_reports
set
  status = 'approved',
  verified_at = coalesce(verified_at, submitted_at, now())
where status = 'pending'
  and removed_at is null;

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
    status,
    verified_at
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
    'approved',
    now()
  )
  returning
    wildlife_reports.id,
    wildlife_reports.status,
    wildlife_reports.submitted_at;
end;
$$;

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
    and r.removed_at is null
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
        and r.removed_at is null
    ) as verified_reports,
    (
      select coalesce(sum(r.animal_count), 0)::bigint
      from public.wildlife_reports r
      where r.status = 'approved'
        and r.removed_at is null
    ) as animals_reported,
    (
      select count(distinct lower(coalesce(nullif(btrim(r.species), ''), r.animal_type)))::bigint
      from public.wildlife_reports r
      where r.status = 'approved'
        and r.removed_at is null
    ) as species_recorded,
    0::bigint as awaiting_review;
$$;

-- Soft-remove a report when the submitter confirms the email used on the form
create or replace function public.remove_wildlife_report(
  p_id uuid,
  p_email text
)
returns table (
  id uuid,
  removed_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_count integer;
begin
  if p_id is null then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  v_email := lower(nullif(btrim(coalesce(p_email, '')), ''));
  if v_email is null then
    raise exception 'invalid_email' using errcode = 'P0001';
  end if;

  return query
  update public.wildlife_reports r
  set removed_at = now()
  where r.id = p_id
    and r.removed_at is null
    and lower(r.email) = v_email
  returning r.id, r.removed_at;

  get diagnostics v_count = row_count;
  if v_count = 0 then
    -- Distinguish missing report vs wrong email without leaking whether the id exists
    if exists (
      select 1
      from public.wildlife_reports r
      where r.id = p_id
        and r.removed_at is null
    ) then
      raise exception 'email_mismatch' using errcode = 'P0001';
    end if;
    raise exception 'not_found' using errcode = 'P0001';
  end if;
end;
$$;

grant execute on function public.remove_wildlife_report(uuid, text)
  to anon, authenticated;
