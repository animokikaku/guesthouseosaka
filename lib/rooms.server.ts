import { db } from '@/db'
import { properties, rooms } from '@/db/schema'
import { dateInJapan, type Room } from '@/lib/rooms-sync/room'
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

// The sync runs every hour; past this, its rooms are too old to show.
const MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000

/** Whether a listing last synced at `checkedAt` is recent enough for the site to show its rooms. */
export function isFresh(checkedAt: string) {
  return Date.now() - Date.parse(checkedAt) <= MAX_AGE_MS
}

/** What the house page shows of a room. */
export type ListedRoom = Pick<Room, 'roomNumber' | 'availableFrom' | 'rent'>

/** A house's listed rooms that are free or freeing up, as of `today` in Japan. */
export interface RoomAvailability {
  /** `YYYY-MM-DD` in Japan when read, so the page formats dates against the same day it sorted them on. */
  today: string
  /** Free now, by room number. */
  available: ListedRoom[]
  /** Free from a later date, soonest first; rooms without a date come last. */
  upcoming: ListedRoom[]
}

const byRoomNumber = (a: ListedRoom, b: ListedRoom) =>
  a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })

const byDateThenRoomNumber = (a: ListedRoom, b: ListedRoom) => {
  if (a.availableFrom === b.availableFrom) return byRoomNumber(a, b)
  if (a.availableFrom === null) return 1
  if (b.availableFrom === null) return -1
  return a.availableFrom < b.availableFrom ? -1 : 1
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

    // An upcoming room whose date has come counts as available, by Japan's date.
    const today = dateInJapan()
    const availability: RoomAvailability = { today, available: [], upcoming: [] }
    for (const { status, ...room } of listed) {
      const free =
        status === 'available' || (room.availableFrom !== null && room.availableFrom <= today)
      availability[free ? 'available' : 'upcoming'].push(room)
    }
    availability.available.sort(byRoomNumber)
    availability.upcoming.sort(byDateThenRoomNumber)
    return availability
  } catch (error) {
    console.error('Failed to read room availability', error)
    return null
  }
}
