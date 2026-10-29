import type { D1Database } from './d1'
import { parseListing, validateRooms } from './parse'
import type { Room } from './room'

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
      // that answered, which tells a refusal by location from one by the site.
      const ray = response.headers.get('cf-ray')
      lastError = new Error(`HTTP ${response.status}${ray ? ` (cf-ray ${ray})` : ''}`)
      if (!RETRYABLE_STATUSES.has(response.status)) break
    } catch (error) {
      lastError = error
    }
  }
  throw new SyncError(`Failed to fetch ${url}`, { cause: lastError })
}

// Rewrites a room only when a field differs, so `updated_at` dates real changes.
// `IS NOT` compares nulls as values.
const UPSERT_ROOM = `
  INSERT INTO rooms (property_id, room_number, status, available_from, area_m2, area_tatami, rent, deposit, common_fee, listed, updated_at)
  VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 1, ?10)
  ON CONFLICT (property_id, room_number) DO UPDATE SET
    status = excluded.status,
    available_from = excluded.available_from,
    area_m2 = excluded.area_m2,
    area_tatami = excluded.area_tatami,
    rent = excluded.rent,
    deposit = excluded.deposit,
    common_fee = excluded.common_fee,
    listed = 1,
    updated_at = excluded.updated_at
  WHERE rooms.status IS NOT excluded.status
    OR rooms.available_from IS NOT excluded.available_from
    OR rooms.area_m2 IS NOT excluded.area_m2
    OR rooms.area_tatami IS NOT excluded.area_tatami
    OR rooms.rent IS NOT excluded.rent
    OR rooms.deposit IS NOT excluded.deposit
    OR rooms.common_fee IS NOT excluded.common_fee
    OR rooms.listed = 0`

const UNLIST_MISSING_ROOMS = `
  UPDATE rooms SET listed = 0, updated_at = ?3
  WHERE property_id = ?1 AND listed = 1
    AND room_number NOT IN (SELECT value FROM json_each(?2))`

const TOUCH_PROPERTY = `
  INSERT INTO properties (property_id, url, checked_at) VALUES (?1, ?2, ?3)
  ON CONFLICT (property_id) DO UPDATE SET url = excluded.url, checked_at = excluded.checked_at`

/**
 * Writes a listing's validated rooms in one transaction and unlists the rooms
 * it no longer shows. Unless `force`d, refuses a listing with fewer than half
 * the rooms already listed: more likely a broken page than half a house gone.
 * @returns how many rooms changed.
 */
export async function writeRooms(
  db: D1Database,
  url: string,
  propertyId: string,
  rooms: Room[],
  { now, force = false }: { now: string; force?: boolean }
) {
  const listed = await db
    .prepare('SELECT COUNT(*) AS count FROM rooms WHERE property_id = ? AND listed = 1')
    .bind(propertyId)
    .first<{ count: number }>()
  if (!force && rooms.length * 2 < (listed?.count ?? 0)) {
    throw new SyncError(
      `Found ${rooms.length} rooms where ${listed?.count} are listed; sync with ?force=1 if the listing shrank`
    )
  }

  const results = await db.batch([
    ...rooms.map((room) =>
      db
        .prepare(UPSERT_ROOM)
        .bind(
          propertyId,
          room.roomNumber,
          room.status,
          room.availableFrom,
          room.areaM2,
          room.areaTatami,
          room.rent,
          room.deposit,
          room.commonFee,
          now
        )
    ),
    db
      .prepare(UNLIST_MISSING_ROOMS)
      .bind(propertyId, JSON.stringify(rooms.map((room) => room.roomNumber)), now),
    db.prepare(TOUCH_PROPERTY).bind(propertyId, url, now)
  ])
  // Every statement but the last touches rooms.
  return results.slice(0, -1).reduce((changed, result) => changed + result.meta.changes, 0)
}

/** Fetches, parses, validates and stores one listing; throws `SyncError` without writing when any step fails. */
export async function syncListing(
  db: D1Database,
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
