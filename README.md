# North East Nurdle Spill — Volunteer Board

Single-page, mobile-first emergency information for community volunteers. Readable in under 30 seconds before leaving home.

## Run

```bash
npm install
npm run dev
```

## Update content

Edit **`data/content.ts`** only:

1. `whatsappCommunity` — pinned WhatsApp join link
2. `organiserMessage` — leading organiser message at the top
3. `latestUpdate` — short status alert
4. `beachesNeedingHelp` — which beaches need people
5. `whatToBring` — kit list
6. `howToCollect` — short steps
7. `trainingVideos` — three video links (`url: null` until ready)
8. `faqs` — short answers

No CMS, login or backend. Deploy to Vercel as a standard Next.js app.
