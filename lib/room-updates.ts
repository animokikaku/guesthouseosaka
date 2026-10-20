import { routing } from '@/i18n/routing'
import type { RoomUpdateHousesQueryResult } from '@/sanity.types'
import { hasLocale, type Locale } from 'next-intl'
import { getRoomStatus } from './availability'
import { z } from './zod'

type HouseDocument = RoomUpdateHousesQueryResult[number]
type Room = NonNullable<HouseDocument['rooms']>[number]

/** A published house, with the room keys of its unpublished draft if it has one. */
export interface RoomUpdateHouse {
  _id: string
  slug: HouseDocument['slug']
  titles: HouseDocument['titles']
  rooms: Room[]
  /** The draft gets the same change, so publishing it later doesn't undo the update. */
  draftRoomKeys: string[]
}

/** Pairs each published house with its draft, from a `raw` perspective fetch. */
export function toRoomUpdateHouses(documents: RoomUpdateHousesQueryResult): RoomUpdateHouse[] {
  const drafts = new Map(documents.map((document) => [document._id, document]))
  return documents
    .filter((document) => !document._id.startsWith('drafts.'))
    .map(({ _id, slug, titles, rooms }) => ({
      _id,
      slug,
      titles,
      rooms: rooms ?? [],
      draftRoomKeys: drafts.get(`drafts.${_id}`)?.rooms?.map((room) => room._key) ?? []
    }))
}

/** For Agent Actions Prompt: the $variables come from {@link roomUpdateParams}. */
export const ROOM_UPDATE_INSTRUCTION = `You read LINE messages from the manager of share houses in Osaka, who reports when rooms become free.

Today in Osaka: $today
The houses, the names they go by and their room numbers, as JSON: $houses
The message: $message

Answer in JSON, shaped like {"language": "ja", "updates": [{"house": "orange", "room": "106", "availableFrom": "2026-11-27"}]}.
- language: the language of the message, one of "en", "ja", "fr", "zh-CN" or "zh-TW".
- updates: one entry per room the message gives news about. Leave it empty when the message is about something else.
- house: the id of the house, matched from any of its names, in any language or spelling. When no house matches, the name as written in the message.
- room: the room number. Include it even when the house has no such room, so the manager can be told.
- availableFrom: the date the room becomes free, as YYYY-MM-DD. Use today's date for a room that is free now, and null for a room that is occupied, rented or taken. A date without a year is the next one on or after today.`

export function roomUpdateParams(message: string, houses: RoomUpdateHouse[], today: string) {
  const list = houses.map(({ slug, titles, rooms }) => ({
    id: slug,
    names: [...new Set(titles.flatMap(({ value }) => (value ? [value] : [])))],
    rooms: rooms.map((room) => room.number)
  }))
  return { today, houses: JSON.stringify(list), message }
}

const responseSchema = z.object({
  language: z.optional(z.string()),
  updates: z.array(
    z.object({
      house: z.string(),
      room: z.union([z.string(), z.number()]),
      availableFrom: z.nullable(z.iso.date())
    })
  )
})

export interface RoomChange {
  house: RoomUpdateHouse
  room: Room
  availableFrom: string | null
  /** Already in that state, e.g. "free now" for a room whose date has passed: nothing to write. */
  unchanged: boolean
}

export interface RoomUpdates {
  /** The language to reply in */
  locale: Locale
  changes: RoomChange[]
  unknownHouses: string[]
  unknownRooms: { house: RoomUpdateHouse; number: string }[]
}

/**
 * Managers write in Japanese (their contact emails are too), so replies that
 * come before the message is read, or after it couldn't be, use Japanese.
 */
export const FALLBACK_LOCALE: Locale = 'ja'

/**
 * Checks the model's answer against the houses: only rooms that exist are
 * changed, and anything else is reported back instead of guessed at.
 * Returns null when the answer isn't the expected JSON.
 */
export function resolveRoomUpdates(
  response: unknown,
  houses: RoomUpdateHouse[],
  today: string
): RoomUpdates | null {
  const parsed = responseSchema.safeParse(response)
  if (!parsed.success) return null

  const { language, updates } = parsed.data
  const changes = new Map<string, RoomChange>()
  const unknownHouses: string[] = []
  const unknownRooms: RoomUpdates['unknownRooms'] = []

  for (const update of updates) {
    const house = houses.find((candidate) => candidate.slug === update.house)
    if (!house) {
      unknownHouses.push(update.house)
      continue
    }
    const number = String(update.room)
    const room = house.rooms.find((candidate) => candidate.number === number)
    if (!room) {
      unknownRooms.push({ house, number })
      continue
    }
    const { availableFrom } = update
    const before = getRoomStatus(room.availableFrom, today)
    const unchanged =
      room.availableFrom === availableFrom ||
      (before === 'available' && getRoomStatus(availableFrom, today) === 'available')
    // A room mentioned twice keeps its last update
    changes.set(`${house._id}/${room._key}`, { house, room, availableFrom, unchanged })
  }

  return {
    locale: language && hasLocale(routing.locales, language) ? language : FALLBACK_LOCALE,
    changes: [...changes.values()],
    unknownHouses,
    unknownRooms
  }
}
