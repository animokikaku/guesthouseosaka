// The sync runs every hour; past this, its rooms are too old to show.
const MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000

/**
 * Whether a listing last synced at `checkedAt` (null: never) is recent enough
 * for the site to show its rooms. The Studio's Site Settings tell the same.
 */
export function isFresh(checkedAt: string | null) {
  return checkedAt !== null && Date.now() - Date.parse(checkedAt) <= MAX_AGE_MS
}

/** What a room's listing says about it: free now, free from `availableFrom`, or taken. */
export type RoomStatus = 'available' | 'upcoming' | 'occupied'

/** A room's latest state, shared by the scraper that writes it and the site that reads it. */
export interface Room {
  /** shares.house's property ID, the `10336` in `/a_detail/q_10336/`. */
  propertyId: string
  roomNumber: string
  status: RoomStatus
  /** `YYYY-MM-DD`, when the listing gives one (usually for `upcoming` rooms). */
  availableFrom: string | null
  areaM2: number | null
  /** Some listings give the size in tatami mats (畳) instead of m². */
  areaTatami: number | null
  /** Monthly, in yen, like the fees below. */
  rent: number | null
  deposit: number | null
  commonFee: number | null
}

/** The date in Japan (`YYYY-MM-DD`) at a time, now by default: when a room's `availableFrom` comes. */
export function dateInJapan(time: string | number = Date.now()) {
  const ms = typeof time === 'string' ? Date.parse(time) : time
  return new Date(ms + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}
