-- Add Cresswell to Alnmouth stretch (inc Druridge and Amble).
-- WhatsApp for this beach uses the main community group.
-- Run in the Supabase SQL editor after 021_south_tyneside_beaches.sql.
-- IDs must match data/checkin-beaches.ts.

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values
  (
    'cresswell-to-alnmouth',
    'Cresswell to Alnmouth (inc Druridge and Amble)',
    'cresswell-to-alnmouth',
    55.279,
    -1.567,
    19,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;
