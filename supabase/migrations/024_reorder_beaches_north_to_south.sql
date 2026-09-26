-- Reorder beaches from north to south.
-- Run in the Supabase SQL editor after 023_rename_littlehaven_and_sandhaven.sql.
-- IDs and display_order must match data/checkin-beaches.ts.

update public.beaches set display_order = 1 where id = 'cresswell-to-alnmouth';
update public.beaches set display_order = 2 where id = 'newbiggin';
update public.beaches set display_order = 3 where id = 'cambois';
update public.beaches set display_order = 4 where id = 'blyth';
update public.beaches set display_order = 5 where id = 'seaton-sluice';
update public.beaches set display_order = 6 where id = 'st-marys-lighthouse';
update public.beaches set display_order = 7 where id = 'whitley-bay-north';
update public.beaches set display_order = 8 where id = 'whitley-bay-central';
update public.beaches set display_order = 9 where id = 'whitley-bay-south';
update public.beaches set display_order = 10 where id = 'browns-bay';
update public.beaches set display_order = 11 where id = 'cullercoats-bay';
update public.beaches set display_order = 12 where id = 'longsands-north';
update public.beaches set display_order = 13 where id = 'longsands-south';
update public.beaches set display_order = 14 where id = 'king-edwards-bay';
update public.beaches set display_order = 15 where id = 'tynemouth-haven';
update public.beaches set display_order = 16 where id = 'fish-quay';
update public.beaches set display_order = 17 where id = 'south-shields';
update public.beaches set display_order = 18 where id = 'seaburn';
update public.beaches set display_order = 19 where id = 'roker';
