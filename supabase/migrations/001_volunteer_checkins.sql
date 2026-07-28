-- Volunteer Beach Check-in schema + RPCs
-- Run in the Supabase SQL editor (or via supabase db push).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.beaches (
  id text primary key,
  name text not null,
  slug text not null unique,
  latitude double precision not null,
  longitude double precision not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.volunteer_checkins (
  id uuid primary key default gen_random_uuid(),
  beach_id text not null references public.beaches (id),
  first_name text,
  session_id text not null,
  checked_in_at timestamptz not null default now(),
  expires_at timestamptz not null,
  checked_out_at timestamptz,
  created_at timestamptz not null default now(),
  constraint volunteer_checkins_first_name_len
    check (first_name is null or char_length(first_name) <= 40)
);

create index if not exists volunteer_checkins_beach_id_idx
  on public.volunteer_checkins (beach_id);

create index if not exists volunteer_checkins_session_id_idx
  on public.volunteer_checkins (session_id);

create index if not exists volunteer_checkins_expires_at_idx
  on public.volunteer_checkins (expires_at);

-- Speeds up “active check-in” filters
create index if not exists volunteer_checkins_active_idx
  on public.volunteer_checkins (beach_id, expires_at)
  where checked_out_at is null;

-- ---------------------------------------------------------------------------
-- Seed beaches (IDs must match data/checkin-beaches.ts)
-- ---------------------------------------------------------------------------

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values
  ('whitley-bay', 'Whitley Bay', 'whitley-bay', 55.0481, -1.4494, 1, true),
  ('cullercoats-bay', 'Cullercoats Bay', 'cullercoats-bay', 55.0349, -1.4328, 2, true),
  ('longsands-north', 'Tynemouth Longsands — North', 'longsands-north', 55.0288, -1.4296, 3, true),
  ('longsands-south', 'Tynemouth Longsands — South', 'longsands-south', 55.0234, -1.4269, 4, true),
  ('king-edwards-bay', 'King Edward’s Bay', 'king-edwards-bay', 55.0182, -1.4158, 5, true),
  ('tynemouth-haven', 'Tynemouth Haven', 'tynemouth-haven', 55.0156, -1.4204, 6, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_checkin_active(
  p_checked_out_at timestamptz,
  p_expires_at timestamptz
) returns boolean
language sql
immutable
as $$
  select p_checked_out_at is null and p_expires_at > now();
$$;

-- Aggregated beach stats (no raw name lists)
create or replace function public.get_beach_checkin_stats()
returns table (
  beach_id text,
  volunteer_count bigint,
  latest_checked_in_at timestamptz,
  sample_first_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    b.id as beach_id,
    count(c.id)::bigint as volunteer_count,
    max(c.checked_in_at) as latest_checked_in_at,
    (
      select c2.first_name
      from public.volunteer_checkins c2
      where c2.beach_id = b.id
        and c2.checked_out_at is null
        and c2.expires_at > now()
        and c2.first_name is not null
      order by c2.checked_in_at desc
      limit 1
    ) as sample_first_name
  from public.beaches b
  left join public.volunteer_checkins c
    on c.beach_id = b.id
    and c.checked_out_at is null
    and c.expires_at > now()
  where b.is_active = true
  group by b.id
  order by min(b.display_order);
$$;

create or replace function public.get_my_active_checkin(p_session_id text)
returns table (
  id uuid,
  beach_id text,
  first_name text,
  checked_in_at timestamptz,
  expires_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id,
    c.beach_id,
    c.first_name,
    c.checked_in_at,
    c.expires_at
  from public.volunteer_checkins c
  where c.session_id = p_session_id
    and c.checked_out_at is null
    and c.expires_at > now()
  order by c.checked_in_at desc
  limit 1;
$$;

create or replace function public.check_in_volunteer(
  p_beach_id text,
  p_session_id text,
  p_first_name text default null
)
returns table (
  id uuid,
  beach_id text,
  first_name text,
  checked_in_at timestamptz,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_active boolean;
  v_name text;
begin
  if p_session_id is null or length(btrim(p_session_id)) < 8 or length(p_session_id) > 64 then
    raise exception 'invalid_session' using errcode = 'P0001';
  end if;

  select b.is_active into v_active
  from public.beaches b
  where b.id = p_beach_id;

  if v_active is null then
    raise exception 'invalid_beach' using errcode = 'P0001';
  end if;

  if v_active is not true then
    raise exception 'beach_disabled' using errcode = 'P0001';
  end if;

  v_name := nullif(btrim(regexp_replace(coalesce(p_first_name, ''), '\s+', ' ', 'g')), '');
  if v_name is not null then
    if char_length(v_name) > 40 or v_name ~ '[[:cntrl:]]' then
      raise exception 'invalid_name' using errcode = 'P0001';
    end if;
  end if;

  -- One active check-in per session: end any previous
  update public.volunteer_checkins c
  set checked_out_at = now()
  where c.session_id = p_session_id
    and c.checked_out_at is null
    and c.expires_at > now();

  return query
  insert into public.volunteer_checkins (
    beach_id,
    first_name,
    session_id,
    checked_in_at,
    expires_at
  )
  values (
    p_beach_id,
    v_name,
    p_session_id,
    now(),
    now() + interval '2 hours'
  )
  returning
    volunteer_checkins.id,
    volunteer_checkins.beach_id,
    volunteer_checkins.first_name,
    volunteer_checkins.checked_in_at,
    volunteer_checkins.expires_at;
end;
$$;

create or replace function public.check_out_volunteer(p_session_id text)
returns table (
  id uuid,
  beach_id text,
  first_name text,
  checked_in_at timestamptz,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_beach_id text;
  v_first_name text;
  v_checked_in_at timestamptz;
  v_expires_at timestamptz;
begin
  if p_session_id is null or length(btrim(p_session_id)) < 8 then
    raise exception 'invalid_session' using errcode = 'P0001';
  end if;

  update public.volunteer_checkins c
  set checked_out_at = now()
  where c.id = (
    select c2.id
    from public.volunteer_checkins c2
    where c2.session_id = p_session_id
      and c2.checked_out_at is null
      and c2.expires_at > now()
    order by c2.checked_in_at desc
    limit 1
  )
  returning
    c.id,
    c.beach_id,
    c.first_name,
    c.checked_in_at,
    c.expires_at
  into
    v_id,
    v_beach_id,
    v_first_name,
    v_checked_in_at,
    v_expires_at;

  if v_id is null then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  id := v_id;
  beach_id := v_beach_id;
  first_name := v_first_name;
  checked_in_at := v_checked_in_at;
  expires_at := v_expires_at;
  return next;
end;
$$;

create or replace function public.extend_checkin(p_session_id text)
returns table (
  id uuid,
  beach_id text,
  first_name text,
  checked_in_at timestamptz,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_beach_id text;
  v_first_name text;
  v_checked_in_at timestamptz;
  v_expires_at timestamptz;
begin
  if p_session_id is null or length(btrim(p_session_id)) < 8 then
    raise exception 'invalid_session' using errcode = 'P0001';
  end if;

  update public.volunteer_checkins c
  set expires_at = now() + interval '2 hours'
  where c.id = (
    select c2.id
    from public.volunteer_checkins c2
    where c2.session_id = p_session_id
      and c2.checked_out_at is null
      and c2.expires_at > now()
    order by c2.checked_in_at desc
    limit 1
  )
  returning
    c.id,
    c.beach_id,
    c.first_name,
    c.checked_in_at,
    c.expires_at
  into
    v_id,
    v_beach_id,
    v_first_name,
    v_checked_in_at,
    v_expires_at;

  if v_id is null then
    raise exception 'expired' using errcode = 'P0001';
  end if;

  id := v_id;
  beach_id := v_beach_id;
  first_name := v_first_name;
  checked_in_at := v_checked_in_at;
  expires_at := v_expires_at;
  return next;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS — visitors use RPCs; no raw check-in table reads
-- ---------------------------------------------------------------------------

alter table public.beaches enable row level security;
alter table public.volunteer_checkins enable row level security;

drop policy if exists beaches_public_read on public.beaches;
create policy beaches_public_read
  on public.beaches
  for select
  to anon, authenticated
  using (is_active = true);

-- No direct policies on volunteer_checkins for anon/authenticated.
-- All access goes through security definer RPCs below.

revoke all on table public.volunteer_checkins from anon, authenticated;
revoke all on table public.beaches from anon, authenticated;
grant select on table public.beaches to anon, authenticated;

grant execute on function public.get_beach_checkin_stats() to anon, authenticated;
grant execute on function public.get_my_active_checkin(text) to anon, authenticated;
grant execute on function public.check_in_volunteer(text, text, text) to anon, authenticated;
grant execute on function public.check_out_volunteer(text) to anon, authenticated;
grant execute on function public.extend_checkin(text) to anon, authenticated;
