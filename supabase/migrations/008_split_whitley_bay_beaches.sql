-- Split Whitley Bay into four check-in / mesh-bag locations.
-- Run in the Supabase SQL editor after 001–007.
-- Historical rows that still reference id `whitley-bay` are left in place;
-- that beach is deactivated so it no longer appears on the hub.

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values
  ('st-marys-lighthouse', 'St Mary’s Lighthouse', 'st-marys-lighthouse', 55.0718, -1.4495, 1, true),
  ('whitley-bay-north', 'Whitley Bay North (Briardene)', 'whitley-bay-north', 55.0565, -1.4505, 2, true),
  ('whitley-bay-central', 'Whitley Bay Central (Panama)', 'whitley-bay-central', 55.0481, -1.4494, 3, true),
  ('whitley-bay-south', 'Whitley Bay South', 'whitley-bay-south', 55.0420, -1.4465, 4, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;

-- Retire the old single Whitley Bay pin (keep row for historical FKs)
update public.beaches
set
  is_active = false,
  display_order = 0,
  name = 'Whitley Bay (retired)'
where id = 'whitley-bay';

-- Keep other beaches ordered after the new Whitley Bay segment
update public.beaches set display_order = 5 where id = 'cullercoats-bay';
update public.beaches set display_order = 6 where id = 'longsands-north';
update public.beaches set display_order = 7 where id = 'longsands-south';
update public.beaches set display_order = 8 where id = 'king-edwards-bay';
update public.beaches set display_order = 9 where id = 'tynemouth-haven';
update public.beaches set display_order = 10 where id = 'newbiggin';
update public.beaches set display_order = 11 where id = 'blyth';
update public.beaches set display_order = 12 where id = 'seaton-sluice';
update public.beaches set display_order = 13 where id = 'cambois';
update public.beaches set display_order = 14 where id = 'fish-quay';
