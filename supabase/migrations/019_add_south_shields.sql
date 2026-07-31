-- Add South Shields (south of the Tyne mouth).
-- Run in the Supabase SQL editor after prior beach migrations.
-- IDs must match data/checkin-beaches.ts.

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values
  ('south-shields', 'South Shields', 'south-shields', 55.0042, -1.4245, 16, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;
