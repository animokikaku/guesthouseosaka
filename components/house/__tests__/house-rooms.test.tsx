import type { ListedRoom, RoomAvailability } from '@/lib/rooms.server'
import { render, screen, within } from '@testing-library/react'
import { HouseRooms } from '../house-rooms'

function room(roomNumber: string, availableFrom: string | null, rent: number | null = 46000) {
  return { roomNumber, availableFrom, rent } satisfies ListedRoom
}

function renderRooms(rooms: Partial<RoomAvailability>) {
  return render(
    <HouseRooms rooms={{ today: '2026-11-02', available: [], upcoming: [], ...rooms }} />
  )
}

/** Each timeline step's text, e.g. `['Now', 'Room 106', '¥41,000']`. */
function steps() {
  const timeline = screen.getByRole('region', { name: /room availability/i })
  return within(timeline)
    .getAllByRole('listitem')
    .filter((item) => item.parentElement?.tagName === 'OL')
    .map((step) =>
      [
        step.querySelector('[data-slot=timeline-date]'),
        ...step.querySelectorAll('ul > li > *')
      ].map((element) => element?.textContent)
    )
}

describe('HouseRooms', () => {
  it('puts rooms free now first, then one step per date, undated last', () => {
    renderRooms({
      available: [room('106', null, 41000), room('201', null)],
      upcoming: [room('208', '2026-12-11'), room('209', '2026-12-11'), room('309', null)]
    })

    expect(steps()).toEqual([
      ['Now', 'Room 106', '¥41,000', 'Room 201', '¥46,000'],
      ['Dec 11', 'Room 208', '¥46,000', 'Room 209', '¥46,000'],
      ['Date TBC', 'Room 309', '¥46,000']
    ])
  })

  it('gives the year only for a date in another year', () => {
    renderRooms({ upcoming: [room('204', '2026-12-22'), room('309', '2027-02-01')] })

    expect(steps().map(([date]) => date)).toEqual(['Dec 22', 'Feb 1, 2027'])
    expect(screen.getByText('Feb 1, 2027')).toHaveAttribute('datetime', '2027-02-01')
  })

  it('leaves out a rent the listing does not give', () => {
    renderRooms({ upcoming: [room('204', '2026-12-22', null)] })

    expect(steps()).toEqual([['Dec 22', 'Room 204']])
  })

  it('renders nothing for a fully booked house', () => {
    const { container } = renderRooms({})

    expect(container).toBeEmptyDOMElement()
  })
})
