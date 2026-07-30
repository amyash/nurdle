-- Add Brown’s Bay (between Whitley Bay South and Cullercoats).
-- Run in the Supabase SQL editor after prior beach migrations.
-- IDs must match data/checkin-beaches.ts.

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values
  ('browns-bay', 'Brown’s Bay', 'browns-bay', 55.0403, -1.4300, 5, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

-- Shift beaches south of Brown’s Bay so display order stays coastal
update public.beaches set display_order = 6 where id = 'cullercoats-bay';
update public.beaches set display_order = 7 where id = 'longsands-north';
update public.beaches set display_order = 8 where id = 'longsands-south';
update public.beaches set display_order = 9 where id = 'king-edwards-bay';
update public.beaches set display_order = 10 where id = 'tynemouth-haven';
update public.beaches set display_order = 11 where id = 'newbiggin';
update public.beaches set display_order = 12 where id = 'blyth';
update public.beaches set display_order = 13 where id = 'seaton-sluice';
update public.beaches set display_order = 14 where id = 'cambois';
update public.beaches set display_order = 15 where id = 'fish-quay';
