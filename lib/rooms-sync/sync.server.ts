import { properties, rooms as roomsTable, syncState } from '@/db/schema'
import { and, count, eq, sql, type DrizzleD1Database } from 'void/db'
import { parseListing, validateRooms } from './parse'
import { dateInJapan, type Room } from './room'

const TIMEOUT_MS = 15_000
const ATTEMPTS = 3
// Worth another try: the server or the network may recover within seconds.
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504])

/** A listing whose rooms couldn't be trusted; nothing was written for it. */
export class SyncError extends Error {
  override name = 'SyncError'
}

/** shares.house's property ID from a listing URL, the `10336` in `/a_detail/q_10336/`. */
export function propertyIdOf(url: string): string | null {
  return /\/a_detail\/q_(\d+)\//.exec(new URL(url).pathname)?.[1] ?? null
}

/** The listing's HTML, retried with backoff on timeouts, network errors and retryable statuses. */
export async function fetchListing(url: string): Promise<string> {
  let lastError: unknown
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    if (attempt > 1) await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 2)))
    try {
      // The timeout also covers reading the body.
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'ja', 'User-Agent': 'guesthouseosaka.com room sync' },
        signal: AbortSignal.timeout(TIMEOUT_MS)
      })
      if (response.ok) return await response.text()
      // shares.house is behind Cloudflare: the ray ID ends with the data center
      // that answered, and `cf-mitigated: challenge` marks its bot challenge,
      // which a Worker can't pass, from any other refusal.
      const details = ['cf-ray', 'cf-mitigated'].flatMap((name) => {
        const value = response.headers.get(name)
        return value ? [`${name} ${value}`] : []
      })
      lastError = new Error(
        `HTTP ${response.status}${details.length ? ` (${details.join(', ')})` : ''}`
      )
      if (!RETRYABLE_STATUSES.has(response.status)) break
    } catch (error) {
      lastError = error
    }
  }
  throw new SyncError(`Failed to fetch ${url}`, { cause: lastError })
}

/** The fields of a room the listing gives; a change to any of them moves its `updatedAt`. */
const ROOM_FIELDS = [
  'status',
  'availableFrom',
  'areaM2',
  'areaTatami',
  'rent',
  'deposit',
  'commonFee'
] as const satisfies (keyof Room)[]

/** `excluded.<column>`: the value an upsert tried to insert. */
const excluded = (column: (typeof roomsTable)[(typeof ROOM_FIELDS)[number]]) =>
  sql.raw(`excluded.${column.name}`)

/**
 * Writes a listing's validated rooms in one transaction and unlists the rooms
 * it no longer shows. Unless `force`d, refuses a listing with fewer than half
 * the rooms already listed: more likely a broken page than half a house gone.
 * @returns how many rooms changed.
 */
export async function writeRooms(
  db: DrizzleD1Database,
  url: string,
  propertyId: string,
  rooms: Room[],
  { now, force = false }: { now: string; force?: boolean }
) {
  const isListed = and(eq(roomsTable.propertyId, propertyId), eq(roomsTable.listed, 1))
  const [listed] = await db.select({ count: count() }).from(roomsTable).where(isListed)
  if (!force && rooms.length * 2 < (listed?.count ?? 0)) {
    throw new SyncError(
      `Found ${rooms.length} rooms where ${listed?.count} are listed; sync with ?force=1 if the listing shrank`
    )
  }

  const changed = { roomNumber: roomsTable.roomNumber }
  const [, ...results] = await db.batch([
    db
      .insert(properties)
      .values({ propertyId, url, checkedAt: now })
      .onConflictDoUpdate({ target: properties.propertyId, set: { url, checkedAt: now } }),
    // Unlists the rooms the page no longer shows, keeping their last known state.
    db
      .update(roomsTable)
      .set({ listed: 0, updatedAt: now })
      .where(
        and(
          isListed,
          sql`${roomsTable.roomNumber} NOT IN (SELECT value FROM json_each(${JSON.stringify(rooms.map((room) => room.roomNumber))}))`
        )
      )
      .returning(changed),
    // Rewrites a room only when a field differs, so `updatedAt` dates real
    // changes. `IS NOT` compares nulls as values.
    ...rooms.map((room) =>
      db
        .insert(roomsTable)
        .values({ ...room, propertyId, listed: 1, updatedAt: now })
        .onConflictDoUpdate({
          target: [roomsTable.propertyId, roomsTable.roomNumber],
          set: {
            ...Object.fromEntries(ROOM_FIELDS.map((field) => [field, excluded(roomsTable[field])])),
            listed: 1,
            updatedAt: now
          },
          setWhere: sql.join(
            [
              ...ROOM_FIELDS.map(
                (field) => sql`${roomsTable[field]} IS NOT ${excluded(roomsTable[field])}`
              ),
              sql`${roomsTable.listed} = 0`
            ],
            sql` OR `
          )
        })
        .returning(changed)
    )
  ])
  return results.reduce((total, rows) => total + rows.length, 0)
}

/** Fetches, parses, validates and stores one listing; throws `SyncError` without writing when any step fails. */
export async function syncListing(
  db: DrizzleD1Database,
  url: string,
  { now = new Date().toISOString(), force = false }: { now?: string; force?: boolean } = {}
) {
  const propertyId = propertyIdOf(url)
  if (!propertyId) throw new SyncError(`Not a shares.house listing URL: ${url}`)

  const html = await fetchListing(url)
  let parsed
  try {
    parsed = parseListing(html, propertyId)
  } catch (error) {
    throw new SyncError(`Failed to parse ${url}`, { cause: error })
  }
  const { rooms, problems } = validateRooms(parsed)
  if (problems.length > 0) throw new SyncError(`Invalid rooms: ${problems.join('; ')}`)

  const changed = await writeRooms(db, url, propertyId, rooms, { now, force })
  return { propertyId, rooms: rooms.length, changed }
}

/**
 * Whether the cached pages that show rooms are out of date at `now`: never
 * purged, a room changed since the last purge (a failed purge isn't recorded,
 * so the next run retries it), or the last purge was on an earlier day in
 * Japan, where an upcoming room may since have become available.
 */
export async function needsPurge(db: DrizzleD1Database, now: string) {
  const [state] = await db
    .select({
      purgedAt: syncState.purgedAt,
      changedAt: sql<string | null>`(SELECT MAX(${roomsTable.updatedAt}) FROM ${roomsTable})`
    })
    .from(syncState)
    .where(eq(syncState.id, 1))
  if (!state) return true
  return (
    (state.changedAt !== null && state.changedAt > state.purgedAt) ||
    dateInJapan(state.purgedAt) < dateInJapan(now)
  )
}

/** Records a purge that succeeded, taken at `at`: after the rooms it covers were written. */
export async function recordPurge(db: DrizzleD1Database, at: string) {
  await db
    .insert(syncState)
    .values({ id: 1, purgedAt: at })
    .onConflictDoUpdate({ target: syncState.id, set: { purgedAt: at } })
}
