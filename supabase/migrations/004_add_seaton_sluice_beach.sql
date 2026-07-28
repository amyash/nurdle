-- Add Seaton Sluice to volunteer check-in beaches.
-- Run in the Supabase SQL editor if this project already applied earlier migrations.

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values ('seaton-sluice', 'Seaton Sluice', 'seaton-sluice', 55.0825, -1.4745, 9, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;
