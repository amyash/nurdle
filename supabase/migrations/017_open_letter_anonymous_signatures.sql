-- Open letter: allow anonymous (non-public) signatures; list only public names.
-- Run after 016_open_letter_signatures.sql.

alter table public.open_letter_signatures
  add column if not exists is_public boolean not null default true;

drop function if exists public.create_open_letter_signature(text, text);

create or replace function public.create_open_letter_signature(
  p_full_name text,
  p_address text,
  p_is_public boolean default true
)
returns table (
  id uuid,
  full_name text,
  address text,
  signed_at timestamptz,
  is_public boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_address text;
  v_public boolean;
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

  v_public := coalesce(p_is_public, true);

  begin
    return query
    insert into public.open_letter_signatures (full_name, address, is_public)
    values (v_name, v_address, v_public)
    returning
      open_letter_signatures.id,
      open_letter_signatures.full_name,
      open_letter_signatures.address,
      open_letter_signatures.signed_at,
      open_letter_signatures.is_public;
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
    and s.is_public is true
  order by s.signed_at desc;
$$;

-- Stats still count every signature, public or anonymous
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

grant execute on function public.create_open_letter_signature(text, text, boolean)
  to anon, authenticated;
