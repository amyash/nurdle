# North East Nurdle Spill — Volunteer Board

Mobile-first emergency information for community volunteers cleaning beaches around North Tyneside.

## Pages

- `/` — community organiser message + actions + scientific briefing
- `/announcements` — community announcements and updates
- `/beach-cleanup` — what to bring, how to collect, videos, cleanup techniques, FAQs
- `/beach-groups` — beach hub: map, volunteer check-in, WhatsApp links, mesh bag requests
- `/collection-points` — official North Tyneside Council bag collection points (map + list)
- `/press-release` — press / media information
- `/volunteer-check-in` — redirects to `/beach-groups`
- `/community-images` — volunteer photos

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Update content

Edit **`data/content.ts`** for most site copy. Beach hub locations + WhatsApp links live in **`data/checkin-beaches.ts`**.

## Beach groups hub (Supabase)

Check-in counts and mesh bag requests need a Supabase project. Features show a “not configured” note until env vars are set.

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
3. `supabase/migrations/007_mesh_bag_requests.sql` (mesh bag requests + RPCs)

`007` creates:

- `mesh_bag_requests`
- RPCs: create, list visible, mark delivered, cancel
- RLS so visitors cannot read/write the table directly

Delivered requests stay visible on the public hub for **10 hours**, then drop from the list (rows are not deleted).

### 3. Local environment variables

```bash
cp .env.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Optional — sewing team Google Sheet intake
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

`GOOGLE_SHEETS_WEBHOOK_URL` is **server-only**. Never prefix it with `NEXT_PUBLIC_`.

Restart `npm run dev`.

### 4. Google Sheet setup (mesh bag requests)

The website is the source of truth. The Sheet is a shared inbox for the sewing team (no sync back).

1. Create a Google Sheet with a tab named **Requests** (or use the first sheet)
2. Add header row:

   `Request ID | Submitted | Beach | Quantity | Needed | Requester | Notes | Status | Claimed by | ETA | Delivered`

3. **Extensions → Apps Script**
4. Paste the contents of [`scripts/google-apps-script/mesh-bag-requests.gs`](scripts/google-apps-script/mesh-bag-requests.gs)
5. **Deploy → New deployment → Web app**
   - Execute as: Me
   - Who has access: Anyone
6. Copy the web app URL into `GOOGLE_SHEETS_WEBHOOK_URL`

On each successful Supabase create, the API route `POST /api/mesh-bag-requests` appends a row. If the Sheet webhook fails, the volunteer still sees success (the error is logged server-side).

The last three columns (**Claimed by**, **ETA**, **Delivered**) are for the sewing team to fill manually.

### 5. Local testing checklist

1. Open `/beach-groups` (confirm `/volunteer-check-in` redirects here)
2. Confirm the map loads (or the list still works if the map fails)
3. Tap **Check in** → optional first name → **Confirm check-in**
4. Confirm the card shows **You’re here**, with check-out / extend actions
5. Tap **Request mesh bags** → submit ASAP or scheduled → success message
6. Open the bag summary / ⋯ menu → mark delivered / cancel with confirm
7. If `GOOGLE_SHEETS_WEBHOOK_URL` is set, confirm a new Sheet row appears
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
- Multiple mesh bag requests per beach are allowed; the card shows an aggregated summary.
