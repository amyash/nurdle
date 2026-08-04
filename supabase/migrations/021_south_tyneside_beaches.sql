-- Rename South Shields → Littlehaven (South Shields); add Roker + Seaburn.
-- Keep id `south-shields` so existing cleanup / check-in / wildlife FKs stay valid.
-- Run in the Supabase SQL editor after 019_add_south_shields.sql.
-- IDs must match data/checkin-beaches.ts.

update public.beaches
set
  name = 'Littlehaven (South Shields)',
  slug = 'littlehaven-south-shields',
  display_order = 16,
  is_active = true
where id = 'south-shields';

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values
  ('roker', 'Roker', 'roker', 54.9215, -1.3665, 17, true),
  ('seaburn', 'Seaburn', 'seaburn', 54.9369, -1.3667, 18, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;
