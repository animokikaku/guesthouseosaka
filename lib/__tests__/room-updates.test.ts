// @vitest-environment node

import type { RoomUpdateHousesQueryResult } from '@/sanity.types'
import {
  FALLBACK_LOCALE,
  resolveRoomUpdates,
  roomUpdateParams,
  toRoomUpdateHouses
} from '../room-updates'

const today = '2026-10-20'

const documents: RoomUpdateHousesQueryResult = [
  {
    _id: 'orange-id',
    slug: 'orange',
    titles: [
      { language: 'en', value: 'Orange House' },
      { language: 'ja', value: 'オレンジハウス' },
      { language: 'fr', value: 'Orange House' }
    ],
    rooms: [
      { _key: 'room-106', number: '106', availableFrom: null },
      { _key: 'room-201', number: '201', availableFrom: '2026-10-01' },
      { _key: 'room-202', number: '202', availableFrom: '2026-11-30' }
    ]
  },
  {
    _id: 'drafts.orange-id',
    slug: 'orange',
    titles: [],
    rooms: [{ _key: 'room-106', number: '106', availableFrom: null }]
  },
  {
    _id: 'lemon-id',
    slug: 'lemon',
    titles: [{ language: 'en', value: 'Lemon House' }],
    rooms: null
  }
]

const houses = toRoomUpdateHouses(documents)
const [orange] = houses

describe('toRoomUpdateHouses', () => {
  it('keeps the published houses and notes the rooms their drafts have', () => {
    expect(houses.map((house) => [house._id, house.draftRoomKeys])).toEqual([
      ['orange-id', ['room-106']],
      ['lemon-id', []]
    ])
    expect(houses[1].rooms).toEqual([])
  })
})

describe('roomUpdateParams', () => {
  it('lists each house by id, with its names once and its room numbers', () => {
    const params = roomUpdateParams('Orange 106 free', houses, today)
    expect(params.today).toBe(today)
    expect(params.message).toBe('Orange 106 free')
    expect(JSON.parse(params.houses)).toEqual([
      { id: 'orange', names: ['Orange House', 'オレンジハウス'], rooms: ['106', '201', '202'] },
      { id: 'lemon', names: ['Lemon House'], rooms: [] }
    ])
  })
})

describe('resolveRoomUpdates', () => {
  const update = (room: string | number, availableFrom: string | null, house = 'orange') => ({
    house,
    room,
    availableFrom
  })

  it('matches each update to its room', () => {
    const result = resolveRoomUpdates(
      { language: 'en', updates: [update('106', '2026-11-27'), update(202, null)] },
      houses,
      today
    )
    expect(result?.locale).toBe('en')
    expect(
      result?.changes.map(({ room, availableFrom, unchanged }) => [
        room.number,
        availableFrom,
        unchanged
      ])
    ).toEqual([
      ['106', '2026-11-27', false],
      ['202', null, false]
    ])
  })

  it('reports houses and rooms that do not exist instead of guessing', () => {
    const result = resolveRoomUpdates(
      { language: 'ja', updates: [update('999', null), update('101', null, 'banana')] },
      houses,
      today
    )
    expect(result?.changes).toEqual([])
    expect(result?.unknownRooms).toEqual([{ house: orange, number: '999' }])
    expect(result?.unknownHouses).toEqual(['banana'])
  })

  // Room 201 has been free since Oct 1; writing today's date would only move it
  it('leaves a room alone when it is already in the reported state', () => {
    const result = resolveRoomUpdates(
      { language: 'en', updates: [update('201', today), update('106', null)] },
      houses,
      today
    )
    expect(result?.changes.map((change) => change.unchanged)).toEqual([true, true])
  })

  it('keeps the last update for a room mentioned twice', () => {
    const result = resolveRoomUpdates(
      { language: 'en', updates: [update('106', '2026-11-01'), update('106', '2026-11-27')] },
      houses,
      today
    )
    expect(result?.changes.map((change) => change.availableFrom)).toEqual(['2026-11-27'])
  })

  it('puts a room given without a house in the only house that has it', () => {
    const result = resolveRoomUpdates(
      { language: 'en', updates: [update('106', today, '')] },
      houses,
      today
    )
    expect(result?.changes.map(({ house, room }) => [house.slug, room.number])).toEqual([
      ['orange', '106']
    ])
    expect(result?.unplacedRooms).toEqual([])
  })

  it('asks for the house when none or several of the houses have the room', () => {
    const apple = { ...orange, _id: 'apple-id', slug: 'apple' as const }
    const result = resolveRoomUpdates(
      { language: 'en', updates: [update('106', today, ''), update('999', null, '')] },
      [orange, apple],
      today
    )
    expect(result?.changes).toEqual([])
    expect(result?.unplacedRooms).toEqual([
      { number: '106', houses: [orange, apple] },
      { number: '999', houses: [] }
    ])
  })

  it('replies in the fallback language when the language is missing or unsupported', () => {
    expect(resolveRoomUpdates({ updates: [] }, houses, today)?.locale).toBe(FALLBACK_LOCALE)
    expect(resolveRoomUpdates({ language: 'de', updates: [] }, houses, today)?.locale).toBe(
      FALLBACK_LOCALE
    )
  })

  it.each([
    ['a string', 'Orange 106 is free'],
    ['a missing updates list', { language: 'en' }],
    ['an invalid date', { updates: [update('106', 'Nov 27')] }]
  ])('returns null for %s', (_, response) => {
    expect(resolveRoomUpdates(response, houses, today)).toBeNull()
  })
})
