# Room Availability

The site copies the room tables of the houses' shares.house listings into a D1
database, `guesthouseosaka-rooms` (bound as `ROOMS_DB`), and shows them on the
house pages. Nothing else stores rooms.

## How a sync works

`POST /api/sync-rooms` (`app/routes/api/sync-rooms.ts`), with
`Authorization: Bearer <SYNC_TOKEN>`, syncs every house in `PROPERTY_IDS`
(`lib/rooms.server.ts`), then purges the cached pages. An EventBridge rule in
AWS Tokyo calls it every six hours (see [Schedule](#schedule)).

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

EventBridge in `ap-northeast-1` (AWS account `902236706846`), all named
`guesthouseosaka-rooms-sync`:

- Rule `cron(7 */6 * * ? *)` (UTC), targeting the API destination with up to
  two retries within an hour. EventBridge retries a 5xx, so a failed run is
  tried again.
- API destination: `POST https://guesthouseosaka.com/api/sync-rooms`.
- Connection: sends `Authorization: Bearer <SYNC_TOKEN>`.
- IAM role `guesthouseosaka-rooms-sync-scheduler`, which lets the rule invoke
  the API destination.

EventBridge waits 5 s for a response, then retries. A run usually takes 1–2 s,
and a slower one still finishes (`waitUntil`). A retry only syncs again, which
changes nothing.

It costs $0.20 per million calls, about 120 a month, so it's billed $0.00;
the connection's secret is included. A failed run shows in the Worker's logs
(`listing_sync_failed`) and in the rule's `FailedInvocations` metric in
CloudWatch.

`SYNC_TOKEN` is a site secret (`bunx void secret put SYNC_TOKEN`; the value is
in `.env`). Worker Previews don't have it, so they refuse to sync. After
rotating it, update the connection too:

```bash
aws events update-connection --region ap-northeast-1 --name guesthouseosaka-rooms-sync \
  --authorization-type API_KEY \
  --auth-parameters "ApiKeyAuthParameters={ApiKeyName=Authorization,ApiKeyValue=Bearer $SYNC_TOKEN}"
```

## Schema

The site owns the database's schema: `db/schema.ts` (Drizzle, read through
`void/db`) and the SQL in `db/migrations/`, which `void deploy` applies to
production and `bun dev` to the local database. Production records them in
`d1_migrations`, as Wrangler did.

## Running it

```bash
bun dev  # Then, with SYNC_TOKEN from .env (writes the local database in .void/):
curl -X POST -H "Authorization: Bearer $SYNC_TOKEN" localhost:3000/api/sync-rooms

# Deployed, on demand (from Japan):
curl -X POST -H "Authorization: Bearer $SYNC_TOKEN" https://guesthouseosaka.com/api/sync-rooms
```

The route answers with each listing's result and whether the purge landed, and
with 502 if anything failed. A listing that really lost more than half its rooms
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
`lib/cache-control.ts`) and tagged `rooms` as well as `sanity`. At the end of
every run, the sync purges the `rooms` tag. Purging on every run rather than
only on changes re-renders a few pages every six hours, and in return a missed
purge, a page rendered while D1 failed, or counts that have since aged out
never last longer than one run. A failed purge fails the run.

The dev server has no Workers Cache, so locally there's nothing to purge.
