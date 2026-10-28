import type { HouseIdentifier } from '@/lib/types'
import { env } from 'cloudflare:workers'

/**
 * Each house's shares.house property ID, which the `guesthouseosaka-rooms`
 * Worker syncs from `LISTING_URLS` (see docs/rooms.md); a test keeps the two in step.
 */
export const PROPERTY_IDS: Record<HouseIdentifier, string> = {
  orange: '10336',
  apple: '10698',
  lemon: '10333'
}

// The sync runs every six hours; past this, its counts are too old to show.
const MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000

function todayInJapan() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export interface RoomCounts {
  available: number
  upcoming: number
}

/**
 * How many of a house's listed rooms are free now and opening soon, or null
 * when they aren't known: never synced, last synced too long ago, or D1 failed.
 * Null hides the badge rather than showing a wrong "Fully booked".
 */
export async function getRoomCounts(house: HouseIdentifier): Promise<RoomCounts | null> {
  try {
    const row = await env.ROOMS_DB.prepare(
      `SELECT p.checked_at AS checkedAt,
         COUNT(CASE WHEN r.status = 'available' OR (r.status = 'upcoming' AND r.available_from <= ?2) THEN 1 END) AS available,
         COUNT(CASE WHEN r.status = 'upcoming' AND (r.available_from IS NULL OR r.available_from > ?2) THEN 1 END) AS upcoming
       FROM properties p
       LEFT JOIN rooms r ON r.property_id = p.property_id AND r.listed = 1
       WHERE p.property_id = ?1
       GROUP BY p.property_id`
    )
      // An upcoming room whose date has come counts as available, by Japan's date.
      .bind(PROPERTY_IDS[house], todayInJapan())
      .first<RoomCounts & { checkedAt: string }>()
    if (!row || Date.now() - Date.parse(row.checkedAt) > MAX_AGE_MS) return null
    return { available: row.available, upcoming: row.upcoming }
  } catch (error) {
    console.error('Failed to read room counts', error)
    return null
  }
}
