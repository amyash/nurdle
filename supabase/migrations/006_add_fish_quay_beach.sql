-- Add Fish Quay to volunteer check-in beaches.
-- Run in the Supabase SQL editor if this project already applied earlier migrations.

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values ('fish-quay', 'Fish Quay', 'fish-quay', 55.0097, -1.4372, 11, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;
