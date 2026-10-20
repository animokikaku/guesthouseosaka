import { timeZone } from '@/i18n/formats'

export type RoomStatus = 'available' | 'upcoming' | 'occupied'

/** A room as stored in a house's `rooms` array. */
export interface AvailabilityRoom {
  _key: string
  number: string | null
  availableFrom: string | null
  style: 'western' | 'japanese' | null
  size: number | null
  rent: number | null
}

export interface ListedRoom extends AvailabilityRoom {
  /** Always set: a room without a date is occupied, and occupied rooms aren't listed. */
  availableFrom: string
  status: Exclude<RoomStatus, 'occupied'>
}

export interface AvailabilitySummary {
  /** Free today, then upcoming by opening date. Occupied rooms are only counted. */
  rooms: ListedRoom[]
  availableCount: number
  upcomingCount: number
  occupiedCount: number
}

// `en-CA` formats dates as YYYY-MM-DD, the same shape as a Sanity `date` field.
const tokyoDateFormat = new Intl.DateTimeFormat('en-CA', { timeZone })

/** Today's date in Osaka as YYYY-MM-DD, whatever the server's or browser's time zone. */
export function tokyoToday(now: Date = new Date()) {
  return tokyoDateFormat.format(now)
}

/** A Sanity `date` read as midnight in Osaka, so formatting in Tokyo time keeps the same day. */
export const tokyoMidnight = (date: string) => new Date(`${date}T00:00:00+09:00`)

/** "Nov 30", with the year only when the date isn't in the current one. */
export function openingDateFormat(date: string, today: string) {
  const otherYear = date.slice(0, 4) !== today.slice(0, 4)
  return { month: 'short', day: 'numeric', year: otherYear ? 'numeric' : undefined } as const
}

/**
 * The status follows from the date alone, so there is nothing else to keep in
 * sync: no date means occupied, today or earlier means available, later means upcoming.
 */
export function getRoomStatus(availableFrom: string | null | undefined, today: string): RoomStatus {
  if (!availableFrom) return 'occupied'
  return availableFrom <= today ? 'available' : 'upcoming'
}

const byNumber = (a: AvailabilityRoom, b: AvailabilityRoom) =>
  (a.number ?? '').localeCompare(b.number ?? '', undefined, { numeric: true })

export function summarizeAvailability(
  rooms: AvailabilityRoom[] | null | undefined,
  today: string
): AvailabilitySummary {
  const available: ListedRoom[] = []
  const upcoming: ListedRoom[] = []
  let occupiedCount = 0

  for (const room of rooms ?? []) {
    const { availableFrom } = room
    const status = getRoomStatus(availableFrom, today)
    // `!availableFrom` repeats the occupied check so TypeScript knows the date is set below
    if (!availableFrom || status === 'occupied') occupiedCount++
    else (status === 'available' ? available : upcoming).push({ ...room, availableFrom, status })
  }

  available.sort(byNumber)
  upcoming.sort((a, b) => a.availableFrom.localeCompare(b.availableFrom) || byNumber(a, b))

  return {
    rooms: [...available, ...upcoming],
    availableCount: available.length,
    upcomingCount: upcoming.length,
    occupiedCount
  }
}

export interface DateGroup {
  /** `now`, or the opening date as YYYY-MM-DD */
  key: string
  rooms: ListedRoom[]
}

/** Rows for the availability timeline: rooms free now, then one row per opening date. */
export function groupByDate(rooms: ListedRoom[]): DateGroup[] {
  const groups: DateGroup[] = []
  for (const room of rooms) {
    const key = room.status === 'available' ? 'now' : room.availableFrom
    const group = groups.find((g) => g.key === key)
    if (group) group.rooms.push(room)
    else groups.push({ key, rooms: [room] })
  }
  return groups
}

export interface FloorRoom extends AvailabilityRoom {
  number: string
  status: RoomStatus
}

export interface Floor {
  floor: string
  rooms: FloorRoom[]
}

/** Every room of the house on its floor, top floor first. The floor is the room number minus its last two digits. */
export function groupByFloor(rooms: AvailabilityRoom[] | null | undefined, today: string): Floor[] {
  const floors = new Map<string, FloorRoom[]>()
  for (const room of rooms ?? []) {
    const { number } = room
    if (!number) continue
    const floor = number.length > 2 ? number.slice(0, -2) : number
    const floorRoom = { ...room, number, status: getRoomStatus(room.availableFrom, today) }
    floors.set(floor, [...(floors.get(floor) ?? []), floorRoom])
  }
  return [...floors]
    .toSorted(([a], [b]) => b.localeCompare(a, undefined, { numeric: true }))
    .map(([floor, floorRooms]) => ({ floor, rooms: floorRooms.toSorted(byNumber) }))
}
