-- Cleanup logs (retrospective volunteer effort)
-- Run in the Supabase SQL editor after 001–008.

create table if not exists public.cleanup_logs (
  id uuid primary key default gen_random_uuid(),
  beach_id text not null references public.beaches (id),
  cleanup_date date not null,
  duration_minutes integer not null,
  volunteer_count integer not null,
  estimated_weight_kg numeric(8, 2),
  volunteer_name text,
  notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint cleanup_logs_duration_check
    check (duration_minutes >= 15 and duration_minutes <= 720),
  constraint cleanup_logs_volunteer_count_check
    check (volunteer_count >= 1 and volunteer_count <= 100),
  constraint cleanup_logs_weight_check
    check (
      estimated_weight_kg is null
      or (estimated_weight_kg >= 0 and estimated_weight_kg <= 1000)
    ),
  constraint cleanup_logs_name_len
    check (volunteer_name is null or char_length(volunteer_name) <= 40),
  constraint cleanup_logs_notes_len
    check (notes is null or char_length(notes) <= 300)
);

create index if not exists cleanup_logs_beach_id_idx
  on public.cleanup_logs (beach_id);

create index if not exists cleanup_logs_cleanup_date_idx
  on public.cleanup_logs (cleanup_date);

create index if not exists cleanup_logs_submitted_at_idx
  on public.cleanup_logs (submitted_at desc);

create or replace function public.create_cleanup_log(
  p_beach_id text,
  p_cleanup_date date,
  p_duration_minutes integer,
  p_volunteer_count integer,
  p_estimated_weight_kg numeric default null,
  p_volunteer_name text default null,
  p_notes text default null
)
returns table (
  id uuid,
  beach_id text,
  cleanup_date date,
  duration_minutes integer,
  volunteer_count integer,
  estimated_weight_kg numeric,
  volunteer_name text,
  notes text,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_active boolean;
  v_name text;
  v_notes text;
  v_weight numeric;
  v_spill date := date '2026-07-19';
begin
  select b.is_active into v_active
  from public.beaches b
  where b.id = p_beach_id;

  if v_active is null then
    raise exception 'invalid_beach' using errcode = 'P0001';
  end if;

  if v_active is not true then
    raise exception 'beach_disabled' using errcode = 'P0001';
  end if;

  if p_cleanup_date is null
    or p_cleanup_date < v_spill
    or p_cleanup_date > (timezone('Europe/London', now()))::date then
    raise exception 'invalid_date' using errcode = 'P0001';
  end if;

  if p_duration_minutes is null
    or p_duration_minutes < 15
    or p_duration_minutes > 720 then
    raise exception 'invalid_duration' using errcode = 'P0001';
  end if;

  if p_volunteer_count is null
    or p_volunteer_count < 1
    or p_volunteer_count > 100 then
    raise exception 'invalid_volunteers' using errcode = 'P0001';
  end if;

  v_weight := p_estimated_weight_kg;
  if v_weight is not null then
    if v_weight < 0 or v_weight > 1000 then
      raise exception 'invalid_weight' using errcode = 'P0001';
    end if;
    v_weight := round(v_weight, 2);
  end if;

  v_name := nullif(btrim(regexp_replace(coalesce(p_volunteer_name, ''), '\s+', ' ', 'g')), '');
  if v_name is not null then
    if char_length(v_name) > 40 or v_name ~ '[[:cntrl:]]' then
      raise exception 'invalid_name' using errcode = 'P0001';
    end if;
  end if;

  v_notes := nullif(btrim(coalesce(p_notes, '')), '');
  if v_notes is not null then
    if char_length(v_notes) > 300 or v_notes ~ '[[:cntrl:]]' then
      raise exception 'invalid_notes' using errcode = 'P0001';
    end if;
  end if;

  return query
  insert into public.cleanup_logs (
    beach_id,
    cleanup_date,
    duration_minutes,
    volunteer_count,
    estimated_weight_kg,
    volunteer_name,
    notes
  )
  values (
    p_beach_id,
    p_cleanup_date,
    p_duration_minutes,
    p_volunteer_count,
    v_weight,
    v_name,
    v_notes
  )
  returning
    cleanup_logs.id,
    cleanup_logs.beach_id,
    cleanup_logs.cleanup_date,
    cleanup_logs.duration_minutes,
    cleanup_logs.volunteer_count,
    cleanup_logs.estimated_weight_kg,
    cleanup_logs.volunteer_name,
    cleanup_logs.notes,
    cleanup_logs.submitted_at;
end;
$$;

-- Returns one row per beach with activity, plus an overall sentinel beach_id = ''
create or replace function public.get_cleanup_stats()
returns table (
  beach_id text,
  total_duration_minutes bigint,
  total_volunteer_hours numeric,
  total_volunteer_sessions bigint,
  total_estimated_weight_kg numeric,
  submission_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with per_beach as (
    select
      c.beach_id,
      coalesce(sum(c.duration_minutes), 0)::bigint as total_duration_minutes,
      coalesce(
        sum((c.duration_minutes::numeric / 60.0) * c.volunteer_count),
        0
      ) as total_volunteer_hours,
      coalesce(sum(c.volunteer_count), 0)::bigint as total_volunteer_sessions,
      coalesce(sum(c.estimated_weight_kg), 0) as total_estimated_weight_kg,
      count(*)::bigint as submission_count
    from public.cleanup_logs c
    group by c.beach_id
  )
  select
    p.beach_id,
    p.total_duration_minutes,
    p.total_volunteer_hours,
    p.total_volunteer_sessions,
    p.total_estimated_weight_kg,
    p.submission_count
  from per_beach p
  union all
  select
    ''::text as beach_id,
    coalesce(sum(p.total_duration_minutes), 0)::bigint,
    coalesce(sum(p.total_volunteer_hours), 0),
    coalesce(sum(p.total_volunteer_sessions), 0)::bigint,
    coalesce(sum(p.total_estimated_weight_kg), 0),
    coalesce(sum(p.submission_count), 0)::bigint
  from per_beach p;
$$;

alter table public.cleanup_logs enable row level security;

revoke all on table public.cleanup_logs from anon, authenticated;

grant execute on function public.create_cleanup_log(text, date, integer, integer, numeric, text, text)
  to anon, authenticated;
grant execute on function public.get_cleanup_stats()
  to anon, authenticated;
