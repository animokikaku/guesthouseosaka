import type { Room } from '@/lib/rooms-sync/room'
import { isHouseIdentifier, type HouseIdentifier } from '@/lib/types'

/** What the site shows of a room. */
export interface ListedRoom extends Pick<Room, 'roomNumber' | 'availableFrom'> {
  /**
   * What the room costs a month, in yen: its rent plus its management and
   * common fee. Null when the listing gives either none, as the rent alone
   * would pass for the total.
   */
  price: number | null
}

/** A house's listed rooms that are free or freeing up, as of `today` in Japan. */
export interface RoomAvailability {
  /** `YYYY-MM-DD` in Japan when read, so the page formats dates against the same day it sorted them on. */
  today: string
  /** Free now, by room number. */
  available: ListedRoom[]
  /** Free from a later date, soonest first; rooms without a date come last. */
  upcoming: ListedRoom[]
}

/** Each house's rooms, for the pages that show every house's; null where they aren't known. */
export type RoomsByHouse = Record<HouseIdentifier, RoomAvailability | null>

const byRoomNumber = (a: ListedRoom, b: ListedRoom) =>
  a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })

const byDateThenRoomNumber = (a: ListedRoom, b: ListedRoom) => {
  if (a.availableFrom === b.availableFrom) return byRoomNumber(a, b)
  if (a.availableFrom === null) return 1
  if (b.availableFrom === null) return -1
  return a.availableFrom < b.availableFrom ? -1 : 1
}

/**
 * Splits a house's rooms into those free now and those free later, leaving
 * out occupied ones. An upcoming room whose date has come counts as free now,
 * by `today` (`YYYY-MM-DD` in Japan).
 */
export function toRoomAvailability(
  listed: Array<Pick<Room, 'roomNumber' | 'availableFrom' | 'status' | 'rent' | 'commonFee'>>,
  today: string
): RoomAvailability {
  const availability: RoomAvailability = { today, available: [], upcoming: [] }
  for (const { status, rent, commonFee, roomNumber, availableFrom } of listed) {
    if (status === 'occupied') continue
    const price = rent === null || commonFee === null ? null : rent + commonFee
    const free = status === 'available' || (availableFrom !== null && availableFrom <= today)
    availability[free ? 'available' : 'upcoming'].push({ roomNumber, availableFrom, price })
  }
  availability.available.sort(byRoomNumber)
  availability.upcoming.sort(byDateThenRoomNumber)
  return availability
}

/**
 * Whether the house has rooms to list: a fully booked house's badge links
 * nowhere, and its section says so in place of the rooms.
 */
export function hasRooms({ available, upcoming }: RoomAvailability) {
  return available.length + upcoming.length > 0
}

/**
 * A room across the houses, as `orange-208`: how the move-in form holds the
 * rooms a visitor chose, and how a room's link names it (`?room=orange-208`).
 */
export function roomKey(house: HouseIdentifier, roomNumber: string) {
  return `${house}-${roomNumber}`
}

/** The house and room number of a {@link roomKey}, or null when it isn't one. */
export function parseRoomKey(key: string) {
  const separator = key.indexOf('-')
  const house = key.slice(0, separator)
  const roomNumber = key.slice(separator + 1)
  if (separator === -1 || !isHouseIdentifier(house) || roomNumber === '') return null
  return { house, roomNumber }
}

/** A room to choose in the move-in form. */
export interface RoomOption extends ListedRoom {
  key: string
  house: HouseIdentifier
  /** Free now, rather than from `availableFrom` (null: from a date to come). */
  free: boolean
  /** The day its house's rooms were read (see `RoomAvailability`), to format its date against. */
  today: string
}

/**
 * The rooms of `houses` a visitor can ask for, house by house in that order;
 * a house whose rooms aren't known, or that is fully booked, has none.
 */
export function toRoomOptions(rooms: RoomsByHouse, houses: readonly HouseIdentifier[]) {
  return houses.map((house) => {
    const availability = rooms[house]
    if (!availability) return { house, rooms: [] }
    const toOption = (room: ListedRoom, free: boolean): RoomOption => ({
      ...room,
      key: roomKey(house, room.roomNumber),
      house,
      free,
      today: availability.today
    })
    return {
      house,
      rooms: [
        ...availability.available.map((room) => toOption(room, true)),
        ...availability.upcoming.map((room) => toOption(room, false))
      ]
    }
  })
}
