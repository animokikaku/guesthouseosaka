import { properties, rooms } from '@/db/schema'
import { dateInJapan } from '@/lib/rooms-sync/room'
import type { HouseIdentifier } from '@/lib/types'
import { and, db, eq, sql } from 'void/db'

/**
 * Each house's shares.house property ID, whose listing the room sync reads
 * (see docs/rooms.md). Add a house here to sync it.
 */
export const PROPERTY_IDS: Record<HouseIdentifier, string> = {
  orange: '10336',
  apple: '10698',
  lemon: '10333'
}

// The sync runs every hour; past this, its counts are too old to show.
const MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000

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
    // An upcoming room whose date has come counts as available, by Japan's date.
    const today = dateInJapan()
    const [row] = await db
      .select({
        checkedAt: properties.checkedAt,
        available: sql<number>`COUNT(CASE WHEN ${rooms.status} = 'available' OR (${rooms.status} = 'upcoming' AND ${rooms.availableFrom} <= ${today}) THEN 1 END)`,
        upcoming: sql<number>`COUNT(CASE WHEN ${rooms.status} = 'upcoming' AND (${rooms.availableFrom} IS NULL OR ${rooms.availableFrom} > ${today}) THEN 1 END)`
      })
      .from(properties)
      .leftJoin(rooms, and(eq(rooms.propertyId, properties.propertyId), eq(rooms.listed, 1)))
      .where(eq(properties.propertyId, PROPERTY_IDS[house]))
      .groupBy(properties.propertyId)
    if (!row || Date.now() - Date.parse(row.checkedAt) > MAX_AGE_MS) return null
    return { available: row.available, upcoming: row.upcoming }
  } catch (error) {
    console.error('Failed to read room counts', error)
    return null
  }
}
