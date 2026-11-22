# Room Availability

The site copies the room tables of the houses' shares.house listings into a D1
database, `guesthouseosaka-rooms` (bound as `ROOMS_DB`), and shows them on the
house pages, the home page and the move-in form (see
[Reading rooms in the site](#reading-rooms-in-the-site)). Nothing else stores
rooms.

## How a sync works

`POST /api/sync-rooms` (`app/routes/api/sync-rooms.ts`), with
`Authorization: Bearer <SYNC_TOKEN>`, syncs every house in `PROPERTY_IDS`
(`lib/rooms.server.ts`), then purges the cached pages. An EventBridge rule in
AWS Tokyo calls it every hour (see [Schedule](#schedule)).

Site Settings' **Room Availability** field, in the **Vacancies** tab, turns the
feature on and off, from its "…" menu (**Show on the site** / **Hide from the
site**).
While it's off in the published Site Settings, the site shows no rooms,
and the hourly call does nothing (it answers `{"skipped": true}`). If it can't
read Site Settings, it syncs anyway, which does no harm. The Studio's **Sync
now** always syncs (see [Running it](#running-it)).

The schedule lives in AWS rather than a Cloudflare cron because shares.house
answers 403 unless the run was started from Japan, wherever the Worker runs: a
cron trigger is refused even when it reaches shares.house through Tokyo.

For each house, `lib/rooms-sync/` does the following:

1. Fetch the listing's Japanese page (`https://shares.house/a_detail/q_<id>/`):
   a 15 s timeout and three attempts (through `ky`), retrying timeouts, network errors, 408, 425, 429 and
   5xx. Its dates are numeric; the English page's are typed by hand in any
   format.
2. Parse the "all rooms" (全て) table (`parse.ts`). The column headers are
   checked first, so a layout change fails the parse instead of reading the wrong
   column.
3. Validate every row: a known status, a plausible room number, no duplicates,
   amounts and areas in range. One bad row rejects the whole listing.
4. In one D1 batch (a transaction, through Drizzle): upsert each room,
   rewriting it only when a field changed; mark rooms the page no longer shows
   `listed = 0`; record the listing's `checked_at`. A page with fewer than half
   the rooms already listed is refused as incomplete.

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
(`bunx wrangler secret put SYNC_TOKEN`). Worker Previews don't have that secret, so
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

The site owns the database's schema: `db/schema.ts` (Drizzle; the site reads
and the sync writes through `db` from `db/index.ts`, which always uses the
primary, so a page rendered after a purge can't cache rooms from a replica
that hasn't caught up) and the SQL in `db/migrations/`, which
`bun run deploy` applies to production and `bun dev` to the local database.
Wrangler records them in `d1_migrations`.

To change the schema, edit `db/schema.ts` and run `bun run db:generate`, then
add `STRICT` to any new table in the generated SQL.

## Running it

In the Studio, **Site Settings** heads the **Room Availability** field, in its
**Vacancies** tab, as it heads the others
(`studio/components/room-availability-input.tsx`). Its **…**
menu (`studio/actions/room-availability-actions.ts`, ahead of the Studio's
copy and paste) has:

- **Show on the site / Hide from the site:** sets the field in the draft, so
  Presentation previews it before it's published. Showing also syncs when a
  house's rooms are over two days old (see below).
- **Sync now,** on or off: syncs before the next hourly run, even if the
  published field is off, so a draft previews fresh rooms. A draft left
  unpublished over two days needs it again: the schedule still skips.

A card under the header lists each house as the Studio lists documents: its
hero image and title, its listed rooms, and a dot whose tooltip says when it
last synced; clicking a house opens it. The dot is red when the house never
synced or last synced over two days ago, which hides its rooms; it tells only
the sync's age, so it stays green while Room Availability is off. The statuses
reload when the editor comes back to the tab. They come from a public
`GET /api/sync-rooms` (`{"houses": [{"house", "syncedAt", "rooms"}]}`); the
Studio tells the age with `isFresh` (`lib/rooms-sync/room.ts`), as the site
does. After a sync, each house also shows what changed, or why it failed
(`studio/components/room-sync.ts` holds that sync's state, and
`studio/components/room-status.ts` words each row). The route and the Studio
share both responses' shapes (`lib/rooms-sync/api.ts`).

The Studio can't hold `SYNC_TOKEN`, so **Sync now** works like
Presentation: the signed-in user creates a preview secret in the dataset
(valid for an hour), and sends it as the request's text body. The route checks
the body's length and shape first, then the secret with `validatePreviewUrl`
and the read token. A text body with no custom header needs no CORS preflight,
and the route lets the hosted Studios and `sanity dev` read its answer.
**Sync now** calls the site that shows the Studio's dataset: production, or
`localhost:3000` for the development Studio. The request starts in the
editor's browser, so like any sync it only gets through from Japan.

From a terminal:

```bash
bun dev  # Then, with SYNC_TOKEN from .env (writes the local database in .wrangler/):
curl -X POST -H "Authorization: Bearer $SYNC_TOKEN" localhost:3000/api/sync-rooms

# Deployed, on demand (from Japan):
curl -X POST -H "Authorization: Bearer $SYNC_TOKEN" https://guesthouseosaka.com/api/sync-rooms
```

The route answers with each listing's result and its purge (`purged`,
`skipped` or `failed`), and with 502 if anything failed. A listing that really lost more than half its rooms
is refused as incomplete on every run until synced once with `?force=1`.

## Reading rooms in the site

`getRoomAvailability(house)` in `lib/rooms.server.ts` maps the house to its
property ID and reads its listed rooms that are available or upcoming (the site
doesn't show occupied ones). `getRoomsByHouse()` reads every house's in one go,
for the pages that show them all. `toRoomAvailability` (`lib/rooms.ts`) splits a
house's rooms into those free now and those free later, counting an upcoming
room whose date has come (in Japan) as free now, and prices each at its rent
plus its management and common fee (no price when the listing gives either
none). A house's rooms are null when its listing has never synced, last synced
over two days ago, or D1 fails.

Three places show them, each only while **Room Availability** is on in Site
Settings, which their routes read with the layout's settings, so Presentation
previews it from a draft before publishing:

- **The house page** has a badge with the counts
  (`components/house/house-availability.tsx`), linking to its "Upcoming
  Vacancies" section, `#availability` (`components/house/house-rooms.tsx`): a
  timeline of when the rooms free up, one step per date, each step headed by an
  icon and "Available now" or the date. Under the title, a sentence says what
  the prices include: Site Settings' **Note** (`roomAvailabilityNote`, in the
  **Vacancies** tab), required there, one per language, English standing in for
  a language without one. The site has no wording of its own for it: until a
  note is published, the title stands alone. The title itself is the site's, as
  the other sections' are. A fully booked house's section says so
  in place of the timeline, and its "Fully booked" badge links nowhere. Null
  hides both.
- **The home page** shows the same badge under each house
  (`components/home/collection.tsx`); a house whose rooms are null has none.
- **The move-in form** has an optional "Rooms" field
  (`components/forms/fields/rooms-field.tsx`) offering the rooms of the houses
  selected in "Places": a combobox on a wide screen, a sheet from the bottom on
  a phone. It's hidden when those houses have no rooms to offer. Each room on a
  house page's timeline links to the form as `?room=orange-208` (`roomKey`),
  which selects the house and the room, and sets the move-in date to the room's
  when it isn't free yet; a room that isn't on offer is ignored. The form sends
  the chosen rooms as keys, without those of a house unselected since, and the
  staff email lists them (`MoveInRequestEmail`).

## Cache

The house pages, the home page and the contact forms, and their data responses,
are cached for a day (see `lib/cache-control.ts`) and tagged `rooms` as well as
with their Sanity types. After syncing,
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
