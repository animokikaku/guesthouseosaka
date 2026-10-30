# Room Availability

The site copies the room tables of the houses' shares.house listings into a D1
database, `guesthouseosaka-rooms` (bound as `ROOMS_DB`), and shows them on the
house pages. Nothing else stores rooms.

## How a sync works

`POST /api/sync-rooms` (`app/routes/api/sync-rooms.ts`), with
`Authorization: Bearer <SYNC_TOKEN>`, syncs every house in `PROPERTY_IDS`
(`lib/rooms.server.ts`), then purges the cached pages. An EventBridge rule in
AWS Tokyo calls it every hour (see [Schedule](#schedule)).

shares.house answers 403 to requests from outside Japan, and what counts is
where the request that started the run came from, not the data center the
Worker runs in: a Cloudflare cron got 403 on every run, even when it reached
shares.house through Tokyo (`cf-ray …-NRT`), while the same sync started from
Japan succeeded. So there's no Cloudflare cron.

For each house, `lib/rooms-sync/` does the following:

1. Fetch the listing's Japanese page (`https://shares.house/a_detail/q_<id>/`):
   a 15 s timeout and three attempts, retrying network errors, 408, 425, 429 and
   5xx. Its dates are numeric; the English page's are typed by hand in any
   format.
2. Parse the "all rooms" (全て) table (`parse.ts`). The column headers are
   checked first, so a layout change fails the parse instead of reading the wrong
   column.
3. Validate every row: a known status, a plausible room number, no duplicates,
   amounts and areas in range. One bad row rejects the whole listing.
4. In one D1 batch (a transaction): upsert each room, rewriting it only when a
   field changed; mark rooms the page no longer shows `listed = 0`; record the
   listing's `checked_at`. A page with fewer than half the rooms already listed
   is refused as incomplete.

A failure at any step leaves that listing's rows as they were and moves on to the
next. It's logged as `listing_sync_failed`, and the route answers 502. An error
status carries shares.house's `cf-ray`, which ends with the data center that
answered, and its `cf-mitigated` header when set
(`HTTP 403 (cf-ray …-NRT, cf-mitigated challenge)`). `cf-mitigated challenge`
means Cloudflare served its bot challenge, which a Worker can't pass, even from
Tokyo.

Statuses are normalized from either language into `available` (空室),
`upcoming` (空室予定, with `available_from`) and `occupied` (入居中, "N/A").
Missing or unreadable values are `null`. Some listings give sizes in tatami
mats (畳), stored in `area_tatami` rather than converted, because the English
pages don't convert them consistently.

To add a house's listing, add its property ID to `PROPERTY_IDS`.

## Schedule

`aws/rooms-sync.yaml`, a CloudFormation stack in `ap-northeast-1` (Tokyo),
holds the whole schedule. Its resources are named after the stack,
`guesthouseosaka-rooms-sync`:

- A rule, `cron(7 * * * ? *)`: every hour at :07 (UTC).
- An API destination that sends `POST https://guesthouseosaka.com/api/sync-rooms`.
- A connection that adds `Authorization: Bearer <SYNC_TOKEN>`.
- A role that lets the rule call the API destination.

To create it, in any AWS account (signed in with `aws login`), or to apply a
change to the template or to `SYNC_TOKEN` in `.env`:

```bash
bun run rooms:schedule:deploy
```

It deploys from `.env`'s `SYNC_TOKEN`, which must match the site's secret
(`bunx void secret put SYNC_TOKEN`). Worker Previews don't have that secret, so
they refuse to sync. To remove the schedule:
`aws cloudformation delete-stack --region ap-northeast-1 --stack-name guesthouseosaka-rooms-sync`.

EventBridge waits 5 s for a response. A run usually takes 1–2 s, and a slower
one still finishes (`waitUntil`). EventBridge retries a timeout or a 5xx (the
route answers 502 when a listing failed) up to twice within half an hour. A
retry only syncs again, which changes nothing.

The API destination costs $0.20 per million calls. At about 750 a month, that's
billed $0.00, and the connection's secret is included. A failed run shows in
the site's logs (`listing_sync_failed`) and in the rule's `FailedInvocations`
metric in CloudWatch.

## Schema

The site owns the database's schema: `db/schema.ts` (Drizzle, read through
`void/db`) and the SQL in `db/migrations/`, which `void deploy` applies to
production and `bun dev` to the local database. Production records them in
`d1_migrations`, as Wrangler did.

## Running it

In the Studio, **Site Settings** has a **Sync now** button under the social
links (`sanity/components/room-sync-input.tsx`), for showing a change before
the next hourly run. It's the input of a `roomSync` field that never stores a
value. The
Studio can't hold `SYNC_TOKEN`, so the button works like Presentation: the
signed-in user creates a preview secret in the dataset (valid for an hour),
and sends it as the request's text body. The route checks it with
`validatePreviewUrl` and the read token. A text body with no custom header
needs no CORS preflight, and the route lets the hosted Studios and
`sanity dev` read its answer. The button calls the site that shows the
Studio's dataset: production, or `localhost:3000` for the development Studio.
The request starts in the editor's browser, so like any sync it only gets
through from Japan.

From a terminal:

```bash
bun dev  # Then, with SYNC_TOKEN from .env (writes the local database in .void/):
curl -X POST -H "Authorization: Bearer $SYNC_TOKEN" localhost:3000/api/sync-rooms

# Deployed, on demand (from Japan):
curl -X POST -H "Authorization: Bearer $SYNC_TOKEN" https://guesthouseosaka.com/api/sync-rooms
```

The route answers with each listing's result and its purge (`purged`,
`skipped` or `failed`), and with 502 if anything failed. A listing that really lost more than half its rooms
is refused as incomplete on every run until synced once with `?force=1`.

## Reading rooms in the site

`getRoomCounts(house)` in `lib/rooms.server.ts` maps the house to its property
ID and counts its available and upcoming rooms, which the house page shows as a
badge (`components/house/house-availability.tsx`). It counts an upcoming room
whose date has come (in Japan) as available, and returns null, hiding the
badge, when the listing has never synced, last synced over two days ago, or D1
fails.

## Cache

House pages and their data responses are cached for a day (see
`lib/cache-control.ts`) and tagged `rooms` as well as `sanity`. After syncing,
a run purges the `rooms` tag only when the cached pages may be out of date
(`needsPurge` in `lib/rooms-sync/sync.server.ts`):

- No purge has been recorded yet.
- A room changed since the last purge (its `updated_at` is later).
- The last purge was on an earlier day in Japan. An upcoming room may have
  become available since, so the first run after midnight in Japan purges.

On most days that's once or twice, though the sync runs every hour. The time
of each successful purge is kept in `sync_state`, in its one row. A failed
purge isn't recorded, which fails the run (EventBridge retries it), and the
next run purges again. A page rendered while D1 failed stays until the next
purge or its cache expires.

The dev server has no Workers Cache, so locally a purge only records its time.
