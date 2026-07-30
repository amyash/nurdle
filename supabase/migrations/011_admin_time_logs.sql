-- Admin / organising time logs (not beach-specific)
-- Run in the Supabase SQL editor after 001–010.

create table if not exists public.admin_time_logs (
  id uuid primary key default gen_random_uuid(),
  work_date date not null,
  duration_minutes integer not null,
  category text not null,
  person_name text,
  notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint admin_time_logs_duration_check
    check (duration_minutes >= 15 and duration_minutes <= 720),
  constraint admin_time_logs_category_len
    check (char_length(category) >= 1 and char_length(category) <= 40),
  constraint admin_time_logs_name_len
    check (person_name is null or char_length(person_name) <= 40),
  constraint admin_time_logs_notes_len
    check (notes is null or char_length(notes) <= 300)
);

create index if not exists admin_time_logs_work_date_idx
  on public.admin_time_logs (work_date desc);

create index if not exists admin_time_logs_submitted_at_idx
  on public.admin_time_logs (submitted_at desc);

create or replace function public.create_admin_time_log(
  p_work_date date,
  p_duration_minutes integer,
  p_category text,
  p_person_name text default null,
  p_notes text default null
)
returns table (
  id uuid,
  work_date date,
  duration_minutes integer,
  category text,
  person_name text,
  notes text,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_notes text;
  v_category text;
  v_spill date := date '2026-07-19';
begin
  if p_work_date is null or p_work_date < v_spill or p_work_date > (timezone('Europe/London', now()))::date then
    raise exception 'invalid_date' using errcode = 'P0001';
  end if;

  if p_duration_minutes is null
    or p_duration_minutes < 15
    or p_duration_minutes > 720 then
    raise exception 'invalid_duration' using errcode = 'P0001';
  end if;

  v_category := nullif(btrim(coalesce(p_category, '')), '');
  if v_category is null or char_length(v_category) > 40 then
    raise exception 'invalid_category' using errcode = 'P0001';
  end if;

  v_name := nullif(btrim(regexp_replace(coalesce(p_person_name, ''), '\s+', ' ', 'g')), '');
  if v_name is not null then
    if char_length(v_name) > 40 or v_name ~ '[[:cntrl:]]' then
      raise exception 'invalid_name' using errcode = 'P0001';
    end if;
  end if;

  v_notes := nullif(btrim(coalesce(p_notes, '')), '');
  if v_notes is not null and char_length(v_notes) > 300 then
    raise exception 'invalid_notes' using errcode = 'P0001';
  end if;

  return query
  insert into public.admin_time_logs (
    work_date,
    duration_minutes,
    category,
    person_name,
    notes
  )
  values (
    p_work_date,
    p_duration_minutes,
    v_category,
    v_name,
    v_notes
  )
  returning
    admin_time_logs.id,
    admin_time_logs.work_date,
    admin_time_logs.duration_minutes,
    admin_time_logs.category,
    admin_time_logs.person_name,
    admin_time_logs.notes,
    admin_time_logs.submitted_at;
end;
$$;

create or replace function public.get_admin_time_stats()
returns table (
  total_duration_minutes bigint,
  submission_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(sum(l.duration_minutes), 0)::bigint as total_duration_minutes,
    count(*)::bigint as submission_count
  from public.admin_time_logs l;
$$;

alter table public.admin_time_logs enable row level security;

revoke all on table public.admin_time_logs from anon, authenticated;

grant execute on function public.create_admin_time_log(date, integer, text, text, text)
  to anon, authenticated;
grant execute on function public.get_admin_time_stats()
  to anon, authenticated;
