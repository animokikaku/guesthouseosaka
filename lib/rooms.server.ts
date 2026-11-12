import { db } from '@/db'
import { properties, rooms } from '@/db/schema'
import { toRoomAvailability, type RoomAvailability } from '@/lib/rooms'
import { dateInJapan, isFresh } from '@/lib/rooms-sync/room'
import type { HouseIdentifier } from '@/lib/types'
import { and, eq, ne } from 'drizzle-orm'

/**
 * Each house's shares.house property ID, whose listing the room sync reads
 * (see docs/rooms.md). Add a house here to sync it.
 */
export const PROPERTY_IDS: Record<HouseIdentifier, string> = {
  orange: '10336',
  apple: '10698',
  lemon: '10333'
}

/**
 * A house's free and upcoming rooms (the site doesn't show occupied ones), or
 * null when they aren't known: never synced, last synced too long ago, or D1
 * failed. Null hides the badge and the timeline rather than showing a wrong
 * "Fully booked".
 */
export async function getRoomAvailability(
  house: HouseIdentifier
): Promise<RoomAvailability | null> {
  try {
    const propertyId = PROPERTY_IDS[house]
    const [[property], listed] = await Promise.all([
      db
        .select({ checkedAt: properties.checkedAt })
        .from(properties)
        .where(eq(properties.propertyId, propertyId)),
      db
        .select({
          roomNumber: rooms.roomNumber,
          status: rooms.status,
          availableFrom: rooms.availableFrom,
          rent: rooms.rent
        })
        .from(rooms)
        .where(
          and(eq(rooms.propertyId, propertyId), eq(rooms.listed, 1), ne(rooms.status, 'occupied'))
        )
    ])
    if (!property || !isFresh(property.checkedAt)) return null

    return toRoomAvailability(listed, dateInJapan())
  } catch (error) {
    console.error('Failed to read room availability', error)
    return null
  }
}
