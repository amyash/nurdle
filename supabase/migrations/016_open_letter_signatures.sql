-- Open letter signatures (name + address, published on the letter page).
-- Run in the Supabase SQL editor after prior migrations.

create table if not exists public.open_letter_signatures (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  address text not null,
  signed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  removed_at timestamptz,
  constraint open_letter_signatures_name_len
    check (char_length(full_name) >= 2 and char_length(full_name) <= 80),
  constraint open_letter_signatures_address_len
    check (char_length(address) >= 5 and char_length(address) <= 300)
);

create index if not exists open_letter_signatures_signed_at_idx
  on public.open_letter_signatures (signed_at desc);

create unique index if not exists open_letter_signatures_name_address_uidx
  on public.open_letter_signatures (
    lower(btrim(full_name)),
    lower(btrim(address))
  )
  where removed_at is null;

create or replace function public.create_open_letter_signature(
  p_full_name text,
  p_address text
)
returns table (
  id uuid,
  full_name text,
  address text,
  signed_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_address text;
begin
  v_name := nullif(btrim(regexp_replace(coalesce(p_full_name, ''), '\s+', ' ', 'g')), '');
  if v_name is null
    or char_length(v_name) < 2
    or char_length(v_name) > 80
    or v_name ~ '[[:cntrl:]]' then
    raise exception 'invalid_name' using errcode = 'P0001';
  end if;

  v_address := nullif(btrim(regexp_replace(coalesce(p_address, ''), '[ \t]+', ' ', 'g')), '');
  v_address := nullif(regexp_replace(coalesce(v_address, ''), E'\n{3,}', E'\n\n', 'g'), '');
  if v_address is null
    or char_length(v_address) < 5
    or char_length(v_address) > 300 then
    raise exception 'invalid_address' using errcode = 'P0001';
  end if;

  begin
    return query
    insert into public.open_letter_signatures (full_name, address)
    values (v_name, v_address)
    returning
      open_letter_signatures.id,
      open_letter_signatures.full_name,
      open_letter_signatures.address,
      open_letter_signatures.signed_at;
  exception
    when unique_violation then
      raise exception 'duplicate' using errcode = 'P0001';
  end;
end;
$$;

create or replace function public.list_open_letter_signatures()
returns table (
  id uuid,
  full_name text,
  address text,
  signed_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.full_name,
    s.address,
    s.signed_at
  from public.open_letter_signatures s
  where s.removed_at is null
  order by s.signed_at desc;
$$;

create or replace function public.get_open_letter_signature_stats()
returns table (
  signature_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint as signature_count
  from public.open_letter_signatures s
  where s.removed_at is null;
$$;

alter table public.open_letter_signatures enable row level security;

revoke all on table public.open_letter_signatures from anon, authenticated;

grant execute on function public.create_open_letter_signature(text, text)
  to anon, authenticated;
grant execute on function public.list_open_letter_signatures()
  to anon, authenticated;
grant execute on function public.get_open_letter_signature_stats()
  to anon, authenticated;
