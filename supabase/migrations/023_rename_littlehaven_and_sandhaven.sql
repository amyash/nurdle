-- Rename Littlehaven (South Shields) → Littlehaven and Sandhaven.
-- Keep id `south-shields` so existing cleanup / check-in / wildlife FKs stay valid.
-- Run in the Supabase SQL editor after 021_south_tyneside_beaches.sql.
-- IDs must match data/checkin-beaches.ts.

update public.beaches
set name = 'Littlehaven and Sandhaven'
where id = 'south-shields';
