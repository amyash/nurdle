# North East Nurdle Spill — Volunteer Board

Mobile-first emergency information for community volunteers cleaning beaches around North Tyneside.

## Pages

- `/` — community effort totals + organiser message + actions + scientific briefing
- `/news` — community news and updates
- `/how-to-clean` — what to bring, how to collect, mesh filter bag drop-offs, videos, cleanup techniques, FAQs
- `/beaches` — beach hub: map, volunteer check-in, WhatsApp links, official collection points, log clean-ups, admin time
- `/wildlife-impact` — community wildlife sightings (moderated; local feature until promoted)
- `/photos` — volunteer photos
- `/press-release` — press / media information

Old paths (`/announcements`, `/beach-cleanup`, `/beach-groups`, `/collection-points`, `/drop-off-points`, `/community-images`, `/updates`, `/volunteer-check-in`) permanently redirect to the new URLs.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Update content

Edit **`data/content.ts`** for most site copy. Beach hub locations + WhatsApp links live in **`data/checkin-beaches.ts`**.

## Beach groups hub (Supabase)

Check-in counts, clean-up logs, mesh bag drop-offs, and admin time need a Supabase project. Features show a “not configured” note until env vars are set.

### 1. Create a Supabase project

1. Sign in at [https://supabase.com](https://supabase.com)
2. Create a project
3. Open **Project Settings → API** and copy:
   - Project URL
   - `anon` `public` key

### 2. Run the SQL migrations

In the Supabase dashboard open **SQL → New query**, paste and run:

1. `supabase/migrations/001_volunteer_checkins.sql` (beaches + check-ins + RPCs)
2. Later beach inserts if needed: `002`–`006`
3. `supabase/migrations/007_mesh_bag_requests.sql` (legacy; no longer used by the site)
4. `supabase/migrations/008_split_whitley_bay_beaches.sql` (split Whitley Bay into four locations)
5. `supabase/migrations/009_cleanup_logs.sql` (retrospective clean-up logs + stats RPCs)
6. `supabase/migrations/010_mesh_bag_dropoffs.sql` (bag-maker drop-offs + RPCs)
7. `supabase/migrations/011_admin_time_logs.sql` (organising / admin time + RPCs)
8. `supabase/migrations/012_remove_mesh_bag_dropoffs.sql` (remove drop-offs from public list)
9. `supabase/migrations/013_wildlife_reports.sql` (wildlife impact reports + RPCs)
10. `supabase/migrations/014_add_browns_bay.sql` (Brown’s Bay beach)
11. `supabase/migrations/015_wildlife_auto_publish.sql` (publish on submit + email-confirmed remove)

`013` / `015` create:

- `wildlife_reports` (published on submit; soft-removed with matching email)
- RPCs: `create_wildlife_report`, `list_approved_wildlife_reports`, `get_wildlife_impact_stats`, `remove_wildlife_report`
- Public UI never returns email / reporter name

To remove a mistaken report from the site, use **Remove** on the card and confirm with the email entered on the form.

`011` creates:

- `admin_time_logs`
- RPCs: `create_admin_time_log`, `get_admin_time_stats`
- Separate from beach clean-up totals; shown on the Beaches page card

`010` creates:

- `mesh_bag_dropoffs`
- RPCs: `create_mesh_bag_dropoff`, `list_recent_mesh_bag_dropoffs`
- RLS so visitors cannot read/write the table directly

Drop-offs stay visible on **How to clean** for **24 hours** from the logged drop-off time (rows are not deleted).

`009` creates:

- `cleanup_logs`
- RPCs: `create_cleanup_log`, `get_cleanup_stats`
- Spill start date enforced in SQL as **19 July 2026** (also in `data/spill.ts`)

### 3. Local environment variables

```bash
cp .env.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Optional — Google Sheet intake (clean-up logs + bag drop-offs)
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

`GOOGLE_SHEETS_WEBHOOK_URL` is **server-only**. Never prefix it with `NEXT_PUBLIC_`.

Restart `npm run dev`.

### 4. Google Sheet setup (bag drop-offs + clean-up logs)

The website (Supabase) is the source of truth. Sheets are a shared inbox (no sync back).

1. **Private spreadsheet** (Restricted): tab **Cleanup Logs** with header row:

   `ID | Submitted At | Cleanup Date | Beach ID | Beach Name | Duration Minutes | Volunteer Count | Estimated Weight Kg | Volunteer Name | Notes | Collected Volume`

2. On the **private** spreadsheet: **Extensions → Apps Script** — paste [`scripts/google-apps-script/mesh-bag-requests.gs`](scripts/google-apps-script/mesh-bag-requests.gs)
3. Optional: set `DROPOFFS_SPREADSHEET_ID` in the script if bag drop-offs should go to a separate spreadsheet
4. **Deploy → New deployment → Web app**
   - Execute as: Me
   - Who has access: Anyone
5. Put the web app `/exec` URL in `GOOGLE_SHEETS_WEBHOOK_URL` (local + Vercel) and redeploy

`doGet` returns `{ version: "private-v3-..." }` so you can confirm the live webhook is the new script.

Bag drop-offs are written to a **Bag Drop-offs** tab:

`ID | Submitted At | Quantity | Location ID | Location Label | Location Other | Dropped At | Maker Name`

### 5. Local testing checklist

1. Open `/beaches` (confirm `/volunteer-check-in` and `/beach-groups` redirect here)
2. Confirm the map loads (or the list still works if the map fails)
3. Tap **Check in** → optional first name → **Confirm check-in**
4. Confirm the card shows **You’re here**, with check-out / extend actions
5. Tap **Log your clean-up** → submit hours/minutes → totals update on the card and below the map
6. Open `/how-to-clean` → **Mesh filter bags** card → ⋯ → **Log a bag drop-off** → submit → list updates
7. If `GOOGLE_SHEETS_WEBHOOK_URL` is set, confirm Sheet rows appear on **Cleanup Logs** / **Bag Drop-offs**
8. Open a private window and confirm volunteer counts increase across sessions

### 6. Vercel deployment

In the Vercel project → **Settings → Environment Variables**, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_SHEETS_WEBHOOK_URL` (optional)

Redeploy after saving env vars. No paid map API key is required (OpenStreetMap + Leaflet).

Do **not** commit real keys. `.env.local` should stay local / gitignored.

## Scripts

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

## Notes

- Check-ins are approximate, anonymous (browser session ID in `localStorage`), and expire after two hours.
- Exact GPS location is never requested.
- Names are optional and are not shown as a public roster.
- Mesh bag drop-offs on How to clean expire from the public list after 24 hours.
