-- Open letter: town (public) + optional private email; full address organiser-only.
-- Run after 017_open_letter_anonymous_signatures.sql.
--
-- Safe: adds columns and new functions only. Does not delete signature rows.
-- No DROP TABLE / DELETE.

alter table public.open_letter_signatures
  add column if not exists town text;

alter table public.open_letter_signatures
  add column if not exists email text;

alter table public.open_letter_signatures
  drop constraint if exists open_letter_signatures_town_len;

alter table public.open_letter_signatures
  add constraint open_letter_signatures_town_len
  check (town is null or (char_length(town) >= 2 and char_length(town) <= 80));

alter table public.open_letter_signatures
  drop constraint if exists open_letter_signatures_email_len;

alter table public.open_letter_signatures
  add constraint open_letter_signatures_email_len
  check (email is null or char_length(email) <= 120);

-- New sign function (avoids replacing older overloads)
create or replace function public.sign_open_letter(
  p_full_name text,
  p_address text,
  p_town text,
  p_email text default null,
  p_is_public boolean default true
)
returns table (
  id uuid,
  full_name text,
  town text,
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
  v_town text;
  v_email text;
  v_public boolean;
begin
  v_name := nullif(btrim(regexp_replace(coalesce(p_full_name, ''), '\s+', ' ', 'g')), '');
  if v_name is null
    or char_length(v_name) < 2
    or char_length(v_name) > 80
    or v_name ~ '[[:cntrl:]]' then
    raise exception 'invalid_name' using errcode = 'P0001';
  end if;

  v_town := nullif(btrim(regexp_replace(coalesce(p_town, ''), '\s+', ' ', 'g')), '');
  if v_town is null
    or char_length(v_town) < 2
    or char_length(v_town) > 80
    or v_town ~ '[[:cntrl:]]' then
    raise exception 'invalid_town' using errcode = 'P0001';
  end if;

  v_address := nullif(btrim(regexp_replace(coalesce(p_address, ''), '[ \t]+', ' ', 'g')), '');
  v_address := nullif(regexp_replace(coalesce(v_address, ''), E'\n{3,}', E'\n\n', 'g'), '');
  if v_address is null
    or char_length(v_address) < 5
    or char_length(v_address) > 300 then
    raise exception 'invalid_address' using errcode = 'P0001';
  end if;

  v_email := lower(nullif(btrim(coalesce(p_email, '')), ''));
  if v_email is not null then
    if char_length(v_email) > 120
      or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
      raise exception 'invalid_email' using errcode = 'P0001';
    end if;
  end if;

  v_public := coalesce(p_is_public, true);

  begin
    return query
    insert into public.open_letter_signatures (
      full_name,
      address,
      town,
      email,
      is_public
    )
    values (
      v_name,
      v_address,
      v_town,
      v_email,
      v_public
    )
    returning
      open_letter_signatures.id,
      open_letter_signatures.full_name,
      open_letter_signatures.town,
      open_letter_signatures.signed_at,
      open_letter_signatures.is_public;
  exception
    when unique_violation then
      raise exception 'duplicate' using errcode = 'P0001';
  end;
end;
$$;

-- Public list: name + town only (never full address or email)
create or replace function public.list_public_open_letter_signatories()
returns table (
  id uuid,
  full_name text,
  town text,
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
    s.town,
    s.signed_at
  from public.open_letter_signatures s
  where s.removed_at is null
    and s.is_public is true
    and s.town is not null
  order by s.signed_at desc;
$$;

grant execute on function public.sign_open_letter(text, text, text, text, boolean)
  to anon, authenticated;
grant execute on function public.list_public_open_letter_signatories()
  to anon, authenticated;
