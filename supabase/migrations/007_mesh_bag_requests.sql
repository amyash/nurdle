-- Mesh bag requests for the Beach groups hub
-- Run in the Supabase SQL editor after 001–006.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

create table if not exists public.mesh_bag_requests (
  id uuid primary key default gen_random_uuid(),
  beach_id text not null references public.beaches (id),
  quantity_requested integer not null,
  needed_type text not null,
  needed_at timestamptz,
  requester_name text,
  note text,
  status text not null default 'requested',
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mesh_bag_requests_quantity_check
    check (quantity_requested >= 1 and quantity_requested <= 999),
  constraint mesh_bag_requests_needed_type_check
    check (needed_type in ('asap', 'scheduled')),
  constraint mesh_bag_requests_status_check
    check (status in ('requested', 'delivered', 'cancelled')),
  constraint mesh_bag_requests_needed_at_check
    check (
      (needed_type = 'asap' and needed_at is null)
      or (needed_type = 'scheduled' and needed_at is not null)
    ),
  constraint mesh_bag_requests_requester_name_len
    check (requester_name is null or char_length(requester_name) <= 40),
  constraint mesh_bag_requests_note_len
    check (note is null or char_length(note) <= 500),
  constraint mesh_bag_requests_delivered_at_check
    check (
      (status = 'delivered' and delivered_at is not null)
      or (status <> 'delivered' and delivered_at is null)
    )
);

create index if not exists mesh_bag_requests_beach_status_idx
  on public.mesh_bag_requests (beach_id, status);

create index if not exists mesh_bag_requests_status_delivered_at_idx
  on public.mesh_bag_requests (status, delivered_at);

create index if not exists mesh_bag_requests_created_at_idx
  on public.mesh_bag_requests (created_at desc);

-- ---------------------------------------------------------------------------
-- RPCs (security definer — no raw table access for anon)
-- ---------------------------------------------------------------------------

create or replace function public.create_mesh_bag_request(
  p_beach_id text,
  p_quantity_requested integer,
  p_needed_type text,
  p_needed_at timestamptz default null,
  p_requester_name text default null,
  p_note text default null
)
returns table (
  id uuid,
  beach_id text,
  quantity_requested integer,
  needed_type text,
  needed_at timestamptz,
  requester_name text,
  note text,
  status text,
  delivered_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_active boolean;
  v_name text;
  v_note text;
  v_needed_at timestamptz;
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

  if p_quantity_requested is null
    or p_quantity_requested < 1
    or p_quantity_requested > 999 then
    raise exception 'invalid_quantity' using errcode = 'P0001';
  end if;

  if p_needed_type is null or p_needed_type not in ('asap', 'scheduled') then
    raise exception 'invalid_needed' using errcode = 'P0001';
  end if;

  if p_needed_type = 'asap' then
    v_needed_at := null;
  else
    if p_needed_at is null then
      raise exception 'invalid_needed' using errcode = 'P0001';
    end if;
    v_needed_at := p_needed_at;
  end if;

  v_name := nullif(btrim(regexp_replace(coalesce(p_requester_name, ''), '\s+', ' ', 'g')), '');
  if v_name is not null then
    if char_length(v_name) > 40 or v_name ~ '[[:cntrl:]]' then
      raise exception 'invalid_name' using errcode = 'P0001';
    end if;
  end if;

  v_note := nullif(btrim(coalesce(p_note, '')), '');
  if v_note is not null then
    if char_length(v_note) > 500 or v_note ~ '[[:cntrl:]]' then
      raise exception 'invalid_note' using errcode = 'P0001';
    end if;
  end if;

  return query
  insert into public.mesh_bag_requests (
    beach_id,
    quantity_requested,
    needed_type,
    needed_at,
    requester_name,
    note,
    status
  )
  values (
    p_beach_id,
    p_quantity_requested,
    p_needed_type,
    v_needed_at,
    v_name,
    v_note,
    'requested'
  )
  returning
    mesh_bag_requests.id,
    mesh_bag_requests.beach_id,
    mesh_bag_requests.quantity_requested,
    mesh_bag_requests.needed_type,
    mesh_bag_requests.needed_at,
    mesh_bag_requests.requester_name,
    mesh_bag_requests.note,
    mesh_bag_requests.status,
    mesh_bag_requests.delivered_at,
    mesh_bag_requests.created_at,
    mesh_bag_requests.updated_at;
end;
$$;

create or replace function public.list_visible_mesh_bag_requests()
returns table (
  id uuid,
  beach_id text,
  quantity_requested integer,
  needed_type text,
  needed_at timestamptz,
  requester_name text,
  note text,
  status text,
  delivered_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id,
    r.beach_id,
    r.quantity_requested,
    r.needed_type,
    r.needed_at,
    r.requester_name,
    r.note,
    r.status,
    r.delivered_at,
    r.created_at,
    r.updated_at
  from public.mesh_bag_requests r
  where r.status = 'requested'
     or (
       r.status = 'delivered'
       and r.delivered_at is not null
       and r.delivered_at > now() - interval '10 hours'
     )
  order by
    case when r.status = 'requested' then 0 else 1 end,
    case
      when r.needed_type = 'asap' then r.created_at
      else coalesce(r.needed_at, r.created_at)
    end asc,
    r.created_at asc;
$$;

create or replace function public.mark_mesh_bag_delivered(p_id uuid)
returns table (
  id uuid,
  beach_id text,
  quantity_requested integer,
  needed_type text,
  needed_at timestamptz,
  requester_name text,
  note text,
  status text,
  delivered_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_beach_id text;
  v_quantity integer;
  v_needed_type text;
  v_needed_at timestamptz;
  v_requester_name text;
  v_note text;
  v_status text;
  v_delivered_at timestamptz;
  v_created_at timestamptz;
  v_updated_at timestamptz;
begin
  if p_id is null then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  update public.mesh_bag_requests r
  set
    status = 'delivered',
    delivered_at = now(),
    updated_at = now()
  where r.id = p_id
    and r.status = 'requested'
  returning
    r.id,
    r.beach_id,
    r.quantity_requested,
    r.needed_type,
    r.needed_at,
    r.requester_name,
    r.note,
    r.status,
    r.delivered_at,
    r.created_at,
    r.updated_at
  into
    v_id,
    v_beach_id,
    v_quantity,
    v_needed_type,
    v_needed_at,
    v_requester_name,
    v_note,
    v_status,
    v_delivered_at,
    v_created_at,
    v_updated_at;

  if v_id is null then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  id := v_id;
  beach_id := v_beach_id;
  quantity_requested := v_quantity;
  needed_type := v_needed_type;
  needed_at := v_needed_at;
  requester_name := v_requester_name;
  note := v_note;
  status := v_status;
  delivered_at := v_delivered_at;
  created_at := v_created_at;
  updated_at := v_updated_at;
  return next;
end;
$$;

create or replace function public.cancel_mesh_bag_request(p_id uuid)
returns table (
  id uuid,
  beach_id text,
  quantity_requested integer,
  needed_type text,
  needed_at timestamptz,
  requester_name text,
  note text,
  status text,
  delivered_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_beach_id text;
  v_quantity integer;
  v_needed_type text;
  v_needed_at timestamptz;
  v_requester_name text;
  v_note text;
  v_status text;
  v_delivered_at timestamptz;
  v_created_at timestamptz;
  v_updated_at timestamptz;
begin
  if p_id is null then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  update public.mesh_bag_requests r
  set
    status = 'cancelled',
    delivered_at = null,
    updated_at = now()
  where r.id = p_id
    and r.status = 'requested'
  returning
    r.id,
    r.beach_id,
    r.quantity_requested,
    r.needed_type,
    r.needed_at,
    r.requester_name,
    r.note,
    r.status,
    r.delivered_at,
    r.created_at,
    r.updated_at
  into
    v_id,
    v_beach_id,
    v_quantity,
    v_needed_type,
    v_needed_at,
    v_requester_name,
    v_note,
    v_status,
    v_delivered_at,
    v_created_at,
    v_updated_at;

  if v_id is null then
    raise exception 'not_found' using errcode = 'P0001';
  end if;

  id := v_id;
  beach_id := v_beach_id;
  quantity_requested := v_quantity;
  needed_type := v_needed_type;
  needed_at := v_needed_at;
  requester_name := v_requester_name;
  note := v_note;
  status := v_status;
  delivered_at := v_delivered_at;
  created_at := v_created_at;
  updated_at := v_updated_at;
  return next;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.mesh_bag_requests enable row level security;

revoke all on table public.mesh_bag_requests from anon, authenticated;

grant execute on function public.create_mesh_bag_request(text, integer, text, timestamptz, text, text)
  to anon, authenticated;
grant execute on function public.list_visible_mesh_bag_requests()
  to anon, authenticated;
grant execute on function public.mark_mesh_bag_delivered(uuid)
  to anon, authenticated;
grant execute on function public.cancel_mesh_bag_request(uuid)
  to anon, authenticated;
