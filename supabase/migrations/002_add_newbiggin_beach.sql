-- Add Newbiggin to volunteer check-in beaches.
-- Run in the Supabase SQL editor if this project already applied 001.

insert into public.beaches (id, name, slug, latitude, longitude, display_order, is_active)
values ('newbiggin', 'Newbiggin', 'newbiggin', 55.1845, -1.5098, 7, true)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  display_order = excluded.display_order,
  is_active = excluded.is_active;
