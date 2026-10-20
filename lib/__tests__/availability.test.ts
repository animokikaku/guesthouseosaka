// @vitest-environment node

import {
  getRoomStatus,
  groupByDate,
  groupByFloor,
  openingDateFormat,
  summarizeAvailability,
  tokyoToday,
  type AvailabilityRoom
} from '../availability'

function room(number: string, availableFrom: string | null = null): AvailabilityRoom {
  return { _key: number, number, availableFrom, style: 'western', size: 12, rent: 45000 }
}

describe('tokyoToday', () => {
  it('uses the date in Osaka, not UTC', () => {
    // 20:00 UTC on Oct 16 is already Oct 17 in Tokyo
    expect(tokyoToday(new Date('2026-10-16T20:00:00Z'))).toBe('2026-10-17')
    expect(tokyoToday(new Date('2026-10-16T10:00:00Z'))).toBe('2026-10-16')
  })
})

describe('openingDateFormat', () => {
  it('adds the year only for dates outside the current one', () => {
    expect(openingDateFormat('2026-11-30', '2026-10-20')).toEqual({
      month: 'short',
      day: 'numeric'
    })
    expect(openingDateFormat('2027-05-17', '2026-10-20').year).toBe('numeric')
  })
})

describe('getRoomStatus', () => {
  const today = '2026-10-16'

  it.each([
    [null, 'occupied'],
    ['2026-10-01', 'available'],
    ['2026-10-16', 'available'],
    ['2026-10-17', 'upcoming']
  ] as const)('reads %s as %s', (availableFrom, status) => {
    expect(getRoomStatus(availableFrom, today)).toBe(status)
  })
})

describe('summarizeAvailability', () => {
  const today = '2026-10-16'

  it('lists free rooms first, then upcoming ones by opening date, and only counts occupied ones', () => {
    const summary = summarizeAvailability(
      [
        room('311', '2026-10-20'),
        room('101'),
        room('309', '2026-10-01'),
        room('207', '2026-11-10'),
        room('102', '2026-10-16'),
        room('208', '2026-10-20')
      ],
      today
    )

    expect(summary.rooms.map((r) => [r.number, r.status])).toEqual([
      ['102', 'available'],
      ['309', 'available'],
      ['208', 'upcoming'],
      ['311', 'upcoming'],
      ['207', 'upcoming']
    ])
    expect(summary).toMatchObject({ availableCount: 2, upcomingCount: 3, occupiedCount: 1 })
  })

  it('sorts room numbers numerically', () => {
    const summary = summarizeAvailability(
      [room('1001', today), room('905', today), room('99', today)],
      today
    )

    expect(summary.rooms.map((r) => r.number)).toEqual(['99', '905', '1001'])
  })

  it('handles a house without rooms', () => {
    expect(summarizeAvailability(null, today)).toEqual({
      rooms: [],
      availableCount: 0,
      upcomingCount: 0,
      occupiedCount: 0
    })
  })
})

describe('groupByDate', () => {
  it('keeps free rooms first, then one group per opening date', () => {
    const { rooms } = summarizeAvailability(
      [room('108', '2026-11-30'), room('309', '2026-10-01'), room('201', '2026-11-30')],
      '2026-10-20'
    )

    expect(groupByDate(rooms).map((g) => [g.key, g.rooms.map((r) => r.number)])).toEqual([
      ['now', ['309']],
      ['2026-11-30', ['108', '201']]
    ])
  })
})

describe('groupByFloor', () => {
  it('lists every room on its floor, top floor first', () => {
    const floors = groupByFloor(
      [room('1002', null), room('101', '2026-10-01'), room('205'), room('102', '2026-12-01')],
      '2026-10-20'
    )

    expect(floors.map((f) => [f.floor, f.rooms.map((r) => [r.number, r.status])])).toEqual([
      ['10', [['1002', 'occupied']]],
      ['2', [['205', 'occupied']]],
      [
        '1',
        [
          ['101', 'available'],
          ['102', 'upcoming']
        ]
      ]
    ])
  })
})
