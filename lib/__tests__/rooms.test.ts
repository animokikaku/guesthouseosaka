import { hasRooms, toRoomAvailability } from '../rooms'
import type { RoomStatus } from '../rooms-sync/room'

const TODAY = '2026-11-02'

function room(
  roomNumber: string,
  status: RoomStatus,
  availableFrom: string | null = null,
  fees: { rent: number | null; commonFee: number | null } = { rent: 46000, commonFee: 12000 }
) {
  return { roomNumber, status, availableFrom, ...fees }
}

/** The room numbers of each list, in order. */
function numbers(listed: Array<ReturnType<typeof room>>) {
  const { available, upcoming } = toRoomAvailability(listed, TODAY)
  return {
    available: available.map(({ roomNumber }) => roomNumber),
    upcoming: upcoming.map(({ roomNumber }) => roomNumber)
  }
}

describe('toRoomAvailability', () => {
  it('counts an upcoming room as free now once its date has come', () => {
    expect(
      numbers([
        room('101', 'upcoming', '2026-11-01'),
        room('102', 'upcoming', TODAY),
        room('103', 'upcoming', '2026-11-03')
      ])
    ).toEqual({ available: ['101', '102'], upcoming: ['103'] })
  })

  it('keeps an upcoming room without a date upcoming', () => {
    expect(numbers([room('101', 'upcoming')])).toEqual({ available: [], upcoming: ['101'] })
  })

  it('leaves out occupied rooms', () => {
    expect(numbers([room('101', 'occupied'), room('102', 'occupied', '2026-10-01')])).toEqual({
      available: [],
      upcoming: []
    })
  })

  it('sorts rooms free now by room number, as numbers', () => {
    expect(
      numbers([room('1001', 'available'), room('201', 'available'), room('99', 'available')])
        .available
    ).toEqual(['99', '201', '1001'])
  })

  it('sorts upcoming rooms soonest first, then by room number, undated last', () => {
    expect(
      numbers([
        room('104', 'upcoming'),
        room('103', 'upcoming', '2026-12-01'),
        room('102', 'upcoming', '2026-11-20'),
        room('101', 'upcoming', '2026-12-01')
      ]).upcoming
    ).toEqual(['102', '101', '103', '104'])
  })

  it('gives the rooms without their status, and the day it split them on', () => {
    expect(toRoomAvailability([room('101', 'available')], TODAY)).toEqual({
      today: TODAY,
      available: [{ roomNumber: '101', availableFrom: null, price: 58000 }],
      upcoming: []
    })
  })

  it('prices a room at its rent plus its common fee, or not at all without either', () => {
    const { available } = toRoomAvailability(
      [
        room('101', 'available', null, { rent: 41000, commonFee: 12000 }),
        room('102', 'available', null, { rent: 41000, commonFee: null }),
        room('103', 'available', null, { rent: null, commonFee: 12000 })
      ],
      TODAY
    )

    expect(available.map(({ price }) => price)).toEqual([53000, null, null])
  })
})

describe('hasRooms', () => {
  it('is false only for a fully booked house', () => {
    expect(hasRooms(toRoomAvailability([], TODAY))).toBe(false)
    expect(hasRooms(toRoomAvailability([room('101', 'available')], TODAY))).toBe(true)
    expect(hasRooms(toRoomAvailability([room('101', 'upcoming')], TODAY))).toBe(true)
  })
})
