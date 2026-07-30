-- Soft-remove mesh bag drop-offs from the public list
-- Run after 010_mesh_bag_dropoffs.sql

alter table public.mesh_bag_dropoffs
  add column if not exists removed_at timestamptz;

create or replace function public.list_recent_mesh_bag_dropoffs()
returns table (
  id uuid,
  quantity integer,
  location_id text,
  location_label text,
  location_other text,
  dropped_at timestamptz,
  submitted_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id,
    d.quantity,
    d.location_id,
    d.location_label,
    d.location_other,
    d.dropped_at,
    d.submitted_at
  from public.mesh_bag_dropoffs d
  where d.dropped_at >= now() - interval '24 hours'
    and d.removed_at is null
  order by d.dropped_at desc, d.submitted_at desc;
$$;

create or replace function public.remove_mesh_bag_dropoff(p_id uuid)
returns table (
  id uuid,
  quantity integer,
  location_id text,
  location_label text,
  location_other text,
  dropped_at timestamptz,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if p_id is null then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  return query
  update public.mesh_bag_dropoffs d
  set removed_at = now()
  where d.id = p_id
    and d.removed_at is null
  returning
    d.id,
    d.quantity,
    d.location_id,
    d.location_label,
    d.location_other,
    d.dropped_at,
    d.submitted_at;

  get diagnostics v_count = row_count;
  if v_count = 0 then
    raise exception 'not_found' using errcode = 'P0001';
  end if;
end;
$$;

grant execute on function public.remove_mesh_bag_dropoff(uuid)
  to anon, authenticated;
