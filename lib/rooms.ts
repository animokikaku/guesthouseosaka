import type { Room } from '@/lib/rooms-sync/room'

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
 * Splits a house's rooms into those free now and those free later, leaving
 * out occupied ones. An upcoming room whose date has come counts as free now,
 * by `today` (`YYYY-MM-DD` in Japan).
 */
export function toRoomAvailability(
  listed: Array<ListedRoom & Pick<Room, 'status'>>,
  today: string
): RoomAvailability {
  const availability: RoomAvailability = { today, available: [], upcoming: [] }
  for (const { status, ...room } of listed) {
    if (status === 'occupied') continue
    const free =
      status === 'available' || (room.availableFrom !== null && room.availableFrom <= today)
    availability[free ? 'available' : 'upcoming'].push(room)
  }
  availability.available.sort(byRoomNumber)
  availability.upcoming.sort(byDateThenRoomNumber)
  return availability
}

/**
 * Whether the house has a timeline (`#availability`) for its badge to link
 * to: a fully booked house has none.
 */
export function hasRooms({ available, upcoming }: RoomAvailability) {
  return available.length + upcoming.length > 0
}
