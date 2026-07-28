# North East Nurdle Spill — Volunteer Board

Mobile-first emergency information for community volunteers cleaning beaches around North Tyneside.

## Pages

- `/` — community organiser message + actions + scientific briefing
- `/announcements` — community announcements and updates
- `/beach-cleanup` — what to bring, how to collect, videos, cleanup techniques, FAQs
- `/beach-groups` — beaches needing help + WhatsApp links
- `/volunteer-check-in` — where volunteers are cleaning (approximate live check-in counts)
- `/community-images` — volunteer photos

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Update content

Edit **`data/content.ts`** for most site copy. Beach check-in locations live in **`data/checkin-beaches.ts`**.

## Volunteer Beach Check-in (Supabase)

This feature needs a Supabase project. Counts stay at zero / show a “not configured” note until env vars are set.

### 1. Create a Supabase project

1. Sign in at [https://supabase.com](https://supabase.com)
2. Create a project
3. Open **Project Settings → API** and copy:
   - Project URL
   - `anon` `public` key

### 2. Run the SQL migration

In the Supabase dashboard open **SQL → New query**, paste the contents of:

`supabase/migrations/001_volunteer_checkins.sql`

Run it. This creates:

- `beaches` + seed rows for the North Tyneside check-in locations
- `volunteer_checkins`
- RPC functions for aggregated counts, check-in, check-out, and extend
- Row Level Security so visitors cannot read raw check-in rows

### 3. Local environment variables

```bash
cp .env.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Restart `npm run dev`.

### 4. Local testing checklist

1. Open `/volunteer-check-in`
2. Confirm the map loads (or the list still works if the map fails)
3. Tap **Check in here** → optional first name → **Confirm check-in**
4. Confirm the card shows **You’re here**, with check-out / extend actions
5. Open a private window (different session) and confirm the count increased
6. Check out / wait for expiry behaviour (expiry is 2 hours; use SQL to shorten `expires_at` while testing if needed)
7. Check into a second beach and confirm the first session check-in ends

### 5. Vercel deployment

In the Vercel project → **Settings → Environment Variables**, add the same two `NEXT_PUBLIC_…` values for Production (and Preview if you want).

Redeploy after saving env vars. No paid map API key is required (OpenStreetMap + Leaflet).

Do **not** commit real keys. `.env.local` should stay local / gitignored.

## Scripts

```bash
npm run lint
npm run build
npm test
```

## Notes

- Check-ins are approximate, anonymous (browser session ID in `localStorage`), and expire after two hours.
- Exact GPS location is never requested.
- Names are optional and are not shown as a public roster.
