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
