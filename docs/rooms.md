# Room Availability

The `guesthouseosaka-rooms` Worker (`workers/rooms/`) copies the room tables of
the houses' shares.house listings into a D1 database, `guesthouseosaka-rooms`.
The site reads that database through its own binding. Nothing else stores
rooms.

## How a sync works

Every six hours (and on `POST /sync`), for each URL in `LISTING_URLS`:

1. Fetch the Japanese page: a 15 s timeout and three attempts, retrying network
   errors, 408, 425, 429 and 5xx. Its dates are numeric; the English page's are
   typed by hand in any format.
2. Parse the "all rooms" (全て) table (`src/parse.ts`). The column headers are
   checked first, so a layout change fails the parse instead of reading the wrong
   column.
3. Validate every row: a known status, a plausible room number, no duplicates,
   amounts and areas in range. One bad row rejects the whole listing.
4. In one D1 batch (a transaction): upsert each room, rewriting it only when a
   field changed; mark rooms the page no longer shows `listed = 0`; record the
   listing's `checked_at`. A page with fewer than half the rooms already listed
   is refused as incomplete.

A failure at any step leaves that listing's rows as they were and moves on to the
next. It's logged as `listing_sync_failed`, and a failed cron run shows as an
error in the Worker's dashboard.

Statuses are normalized from either language into `available` (空室),
`upcoming` (空室予定, with `available_from`) and `occupied` (入居中, "N/A").
Missing or unreadable values are `null`. Some listings give sizes in tatami
mats (畳), stored in `area_tatami` rather than converted, because the English
pages don't convert them consistently.

## Deploying

Workers Builds deploys the rooms Worker with `bun run rooms:deploy` (pending D1
migrations, then the Worker) when a push to `main` touches `workers/rooms/`. It
has its own build trigger, next to the site's; there are no preview builds for
it, since a preview never runs the cron. To deploy by hand, run the same
command.

Secrets, already set (values in `.env.local`):

| Secret                    | Set on                       | Used for                                 |
| ------------------------- | ---------------------------- | ---------------------------------------- |
| `SYNC_TOKEN`              | `guesthouseosaka-rooms`      | Bearer token for `POST /sync`            |
| `ROOMS_REVALIDATE_SECRET` | both Workers, the same value | Bearer token for `/api/revalidate-rooms` |

To rotate one: `bunx wrangler secret put <NAME> -c workers/rooms/wrangler.jsonc`,
and for the site `bunx wrangler secret put ROOMS_REVALIDATE_SECRET --env production`.

To add a listing, append its Japanese URL (`https://shares.house/a_detail/q_<id>/`)
to `LISTING_URLS`, and its house's ID to `PROPERTY_IDS` in `lib/rooms.server.ts`.

## Running it

```bash
bun run rooms:migrate  # Apply migrations to the local database the site's dev server also uses
bun run rooms:dev      # Worker at localhost:8787
curl "localhost:8787/__scheduled?cron=7+*/6+*+*+*"   # Run the cron once

# Deployed, on demand:
curl -X POST -H "Authorization: Bearer $SYNC_TOKEN" https://guesthouseosaka-rooms.animokikaku.workers.dev/sync
```

`/sync` answers with each listing's result and whether the purge landed, and
with 502 if anything failed. A listing that really lost more than half its rooms
is refused as incomplete on every run until synced once with `/sync?force=1`.

## Reading rooms in the site

The site binds the same database as `ROOMS_DB` (read-only by convention) and
queries it server-side: `getRoomCounts(house)` in `lib/rooms.server.ts` maps the
house to its property ID and counts its available and upcoming rooms, which the
house page shows as a badge (`components/house/house-availability.tsx`). It
counts an upcoming room whose date has come (in Japan) as available, and
returns null, hiding the badge, when the listing has never synced, last synced
over two days ago, or D1 fails. There's no API in between. Locally, both Workers persist to `.wrangler/state`,
so `bun dev` reads what `bun run rooms:dev` synced.

## Cache

House pages and their data responses are cached for a day (see
`lib/cache-control.ts`) and tagged `rooms` as well as `sanity`. At the end of
every run, the rooms Worker posts to the site's `/api/revalidate-rooms` through
its `SITE` service binding, with `ROOMS_REVALIDATE_SECRET` as a bearer token,
and the site purges the `rooms` tag. Purging on every run rather than only on
changes re-renders a few pages every six hours, and in return a missed purge,
a page rendered while D1 failed, or counts that have since aged out never last
longer than one run. Each purge is tried three times; a failure fails the run.

Locally the purge reaches the site's preview server, whose host check answers
403; the deployed binding calls the Worker directly.
