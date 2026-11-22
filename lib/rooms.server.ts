import { db } from '@/db'
import { properties, rooms } from '@/db/schema'
import { toRoomAvailability, type RoomAvailability, type RoomsByHouse } from '@/lib/rooms'
import { dateInJapan, isFresh } from '@/lib/rooms-sync/room'
import { HouseIdentifierValues, type HouseIdentifier } from '@/lib/types'
import { and, eq, inArray, ne } from 'drizzle-orm'

/**
 * Each house's shares.house property ID, whose listing the room sync reads
 * (see docs/rooms.md). Add a house here to sync it.
 */
export const PROPERTY_IDS: Record<HouseIdentifier, string> = {
  orange: '10336',
  apple: '10698',
  lemon: '10333'
}

/** The rooms of `houses`, by house, each null when they aren't known; throws when D1 fails. */
async function readRooms(houses: readonly HouseIdentifier[]) {
  const propertyIds = houses.map((house) => PROPERTY_IDS[house])
  const [synced, listed] = await Promise.all([
    db
      .select({ propertyId: properties.propertyId, checkedAt: properties.checkedAt })
      .from(properties)
      .where(inArray(properties.propertyId, propertyIds)),
    db
      .select({
        propertyId: rooms.propertyId,
        roomNumber: rooms.roomNumber,
        status: rooms.status,
        availableFrom: rooms.availableFrom,
        rent: rooms.rent,
        commonFee: rooms.commonFee
      })
      .from(rooms)
      .where(
        and(
          inArray(rooms.propertyId, propertyIds),
          eq(rooms.listed, 1),
          ne(rooms.status, 'occupied')
        )
      )
  ])
  const today = dateInJapan()
  return new Map(
    houses.map((house): [HouseIdentifier, RoomAvailability | null] => {
      const propertyId = PROPERTY_IDS[house]
      const property = synced.find((row) => row.propertyId === propertyId)
      if (!property || !isFresh(property.checkedAt)) return [house, null]
      const ofHouse = listed.filter((room) => room.propertyId === propertyId)
      return [house, toRoomAvailability(ofHouse, today)]
    })
  )
}

/**
 * A house's free and upcoming rooms (the site doesn't show occupied ones), or
 * null when they aren't known: never synced, last synced too long ago, or D1
 * failed. Null hides the badge and the section rather than showing a wrong
 * "Fully booked".
 */
export async function getRoomAvailability(
  house: HouseIdentifier
): Promise<RoomAvailability | null> {
  try {
    const byHouse = await readRooms([house])
    return byHouse.get(house) ?? null
  } catch (error) {
    console.error('Failed to read room availability', error)
    return null
  }
}

/** Every house's rooms (see `getRoomAvailability`), in one read, for the pages that show them all. */
export async function getRoomsByHouse(): Promise<RoomsByHouse> {
  const byHouse = await readRooms(HouseIdentifierValues).catch((error: unknown) => {
    console.error('Failed to read room availability', error)
    return new Map<HouseIdentifier, RoomAvailability | null>()
  })
  return {
    orange: byHouse.get('orange') ?? null,
    apple: byHouse.get('apple') ?? null,
    lemon: byHouse.get('lemon') ?? null
  }
}
