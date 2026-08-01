-- Open letter signing: postcode + WhatsApp-window flag.
-- Additive signatures (joined_whatsapp = false) increase the displayed total.
-- Run after 018_open_letter_town_email.sql.

alter table public.open_letter_signatures
  add column if not exists postcode text;

alter table public.open_letter_signatures
  add column if not exists joined_whatsapp boolean not null default false;

alter table public.open_letter_signatures
  drop constraint if exists open_letter_signatures_postcode_len;

alter table public.open_letter_signatures
  add constraint open_letter_signatures_postcode_len
  check (
    postcode is null
    or (char_length(postcode) >= 5 and char_length(postcode) <= 12)
  );

create or replace function public.sign_open_letter_v2(
  p_full_name text,
  p_town text,
  p_postcode text,
  p_joined_whatsapp boolean default false
)
returns table (
  id uuid,
  signed_at timestamptz,
  joined_whatsapp boolean,
  additive_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_town text;
  v_postcode text;
  v_joined boolean;
  v_id uuid;
  v_signed_at timestamptz;
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

  v_postcode := upper(nullif(btrim(regexp_replace(coalesce(p_postcode, ''), '\s+', '', 'g')), ''));
  if v_postcode is null
    or char_length(v_postcode) < 5
    or char_length(v_postcode) > 12
    or v_postcode !~ '^[A-Z]{1,2}[0-9][A-Z0-9]?[0-9][A-Z]{2}$' then
    raise exception 'invalid_postcode' using errcode = 'P0001';
  end if;
  v_postcode :=
    substring(v_postcode from 1 for char_length(v_postcode) - 3)
    || ' '
    || substring(v_postcode from char_length(v_postcode) - 2);

  v_joined := coalesce(p_joined_whatsapp, false);

  begin
    insert into public.open_letter_signatures (
      full_name,
      town,
      address,
      postcode,
      email,
      is_public,
      joined_whatsapp
    )
    values (
      v_name,
      v_town,
      v_postcode,
      v_postcode,
      null,
      false,
      v_joined
    )
    returning
      open_letter_signatures.id,
      open_letter_signatures.signed_at
    into v_id, v_signed_at;
  exception
    when unique_violation then
      raise exception 'duplicate' using errcode = 'P0001';
  end;

  return query
  select
    v_id,
    v_signed_at,
    v_joined,
    (
      select count(*)::bigint
      from public.open_letter_signatures s
      where s.joined_whatsapp = false
        and s.removed_at is null
    );
end;
$$;

create or replace function public.get_open_letter_additive_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint
  from public.open_letter_signatures s
  where s.joined_whatsapp = false
    and s.removed_at is null;
$$;

grant execute on function public.sign_open_letter_v2(text, text, text, boolean)
  to anon, authenticated;
grant execute on function public.get_open_letter_additive_count()
  to anon, authenticated;
