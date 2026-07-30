-- Mesh filter bag drop-offs (sewing team / bag-makers)
-- Run in the Supabase SQL editor after 001–009.

create table if not exists public.mesh_bag_dropoffs (
  id uuid primary key default gen_random_uuid(),
  quantity integer not null,
  location_id text not null,
  location_label text not null,
  location_other text,
  dropped_at timestamptz not null,
  maker_name text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint mesh_bag_dropoffs_quantity_check
    check (quantity >= 1 and quantity <= 500),
  constraint mesh_bag_dropoffs_location_label_len
    check (char_length(location_label) <= 80),
  constraint mesh_bag_dropoffs_location_other_len
    check (location_other is null or char_length(location_other) <= 80),
  constraint mesh_bag_dropoffs_name_len
    check (maker_name is null or char_length(maker_name) <= 40)
);

create index if not exists mesh_bag_dropoffs_dropped_at_idx
  on public.mesh_bag_dropoffs (dropped_at desc);

create or replace function public.create_mesh_bag_dropoff(
  p_quantity integer,
  p_location_id text,
  p_location_label text,
  p_location_other text default null,
  p_dropped_at timestamptz default null,
  p_maker_name text default null
)
returns table (
  id uuid,
  quantity integer,
  location_id text,
  location_label text,
  location_other text,
  dropped_at timestamptz,
  maker_name text,
  submitted_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_label text;
  v_other text;
  v_name text;
  v_dropped timestamptz;
begin
  if p_quantity is null or p_quantity < 1 or p_quantity > 500 then
    raise exception 'invalid_quantity' using errcode = 'P0001';
  end if;

  v_label := nullif(btrim(coalesce(p_location_label, '')), '');
  if v_label is null or char_length(v_label) > 80 then
    raise exception 'invalid_location' using errcode = 'P0001';
  end if;

  if p_location_id is null or btrim(p_location_id) = '' then
    raise exception 'invalid_location' using errcode = 'P0001';
  end if;

  v_other := nullif(btrim(coalesce(p_location_other, '')), '');
  if v_other is not null and char_length(v_other) > 80 then
    raise exception 'invalid_location' using errcode = 'P0001';
  end if;

  if p_location_id = 'other' and v_other is null then
    raise exception 'invalid_location' using errcode = 'P0001';
  end if;

  v_dropped := coalesce(p_dropped_at, now());
  if v_dropped > now() + interval '5 minutes' then
    raise exception 'invalid_dropped_at' using errcode = 'P0001';
  end if;
  if v_dropped < now() - interval '7 days' then
    raise exception 'invalid_dropped_at' using errcode = 'P0001';
  end if;

  v_name := nullif(btrim(regexp_replace(coalesce(p_maker_name, ''), '\s+', ' ', 'g')), '');
  if v_name is not null then
    if char_length(v_name) > 40 or v_name ~ '[[:cntrl:]]' then
      raise exception 'invalid_name' using errcode = 'P0001';
    end if;
  end if;

  return query
  insert into public.mesh_bag_dropoffs (
    quantity,
    location_id,
    location_label,
    location_other,
    dropped_at,
    maker_name
  )
  values (
    p_quantity,
    btrim(p_location_id),
    v_label,
    v_other,
    v_dropped,
    v_name
  )
  returning
    mesh_bag_dropoffs.id,
    mesh_bag_dropoffs.quantity,
    mesh_bag_dropoffs.location_id,
    mesh_bag_dropoffs.location_label,
    mesh_bag_dropoffs.location_other,
    mesh_bag_dropoffs.dropped_at,
    mesh_bag_dropoffs.maker_name,
    mesh_bag_dropoffs.submitted_at;
end;
$$;

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
  order by d.dropped_at desc, d.submitted_at desc;
$$;

alter table public.mesh_bag_dropoffs enable row level security;

revoke all on table public.mesh_bag_dropoffs from anon, authenticated;

grant execute on function public.create_mesh_bag_dropoff(integer, text, text, text, timestamptz, text)
  to anon, authenticated;
grant execute on function public.list_recent_mesh_bag_dropoffs()
  to anon, authenticated;
