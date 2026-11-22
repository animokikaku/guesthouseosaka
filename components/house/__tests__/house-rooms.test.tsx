import type { ListedRoom, RoomAvailability } from '@/lib/rooms'
import { render, screen, within } from '@testing-library/react'
import { HouseRooms } from '../house-rooms'

const NOTE = 'Monthly prices include management and common fees.'

function room(roomNumber: string, availableFrom: string | null, price: number | null = 58000) {
  return { roomNumber, availableFrom, price } satisfies ListedRoom
}

function renderRooms(rooms: Partial<RoomAvailability>, note?: string | null) {
  return render(
    <HouseRooms
      house="orange"
      rooms={{ today: '2026-11-02', available: [], upcoming: [], ...rooms }}
      note={note}
    />
  )
}

function section() {
  return screen.getByRole('region', { name: 'Upcoming Vacancies' })
}

/** Each timeline step's text as shown, e.g. `['Available now', 'Room 106', '¥53,000~']`. */
function steps() {
  return within(section())
    .getAllByRole('listitem')
    .filter((item) => item.parentElement?.tagName === 'OL')
    .map((step) => {
      const label = step.querySelector('[data-slot=timeline-date]')
      return [
        // A date's label also holds its sentence for screen readers.
        label?.querySelector('[aria-hidden]') ?? label,
        ...step.querySelectorAll('ul > li > a > :not(svg)')
      ].map((element) => element?.textContent)
    })
}

describe('HouseRooms', () => {
  it('puts rooms free now first, then one step per date, undated last', () => {
    renderRooms({
      available: [room('106', null, 53000), room('201', null)],
      upcoming: [room('208', '2026-12-11'), room('209', '2026-12-11'), room('309', null)]
    })

    expect(steps()).toEqual([
      ['Available now', 'Room 106', '¥53,000~', 'Room 201', '¥58,000~'],
      ['Dec 11', 'Room 208', '¥58,000~', 'Room 209', '¥58,000~'],
      ['Date TBC', 'Room 309', '¥58,000~']
    ])
  })

  it('says what the prices include, in Site Settings’ words', () => {
    renderRooms({ available: [room('106', null)] }, NOTE)

    expect(within(section()).getByText(NOTE)).toBeInTheDocument()
  })

  it.each([null, ''])('has only its title over the timeline without a note (%j)', (note) => {
    renderRooms({ available: [room('106', null)] }, note)

    expect(section().querySelector('p')).not.toBeInTheDocument()
    expect(steps()).toEqual([['Available now', 'Room 106', '¥58,000~']])
  })

  it('gives the year only for a date in another year', () => {
    renderRooms({ upcoming: [room('204', '2026-12-22'), room('309', '2027-02-01')] })

    expect(steps().map(([date]) => date)).toEqual(['Dec 22', 'Feb 1, 2027'])
  })

  it('tells screen readers a date is when the rooms free up', () => {
    renderRooms({ upcoming: [room('309', '2027-02-01')] })

    const date = screen.getByText('Available from Feb 1, 2027').closest('time')
    expect(date).toHaveAttribute('datetime', '2027-02-01')
  })

  it('links each room to the move-in form, asking for that room', () => {
    renderRooms({ upcoming: [room('208', '2026-12-11')] })

    expect(screen.getByRole('link', { name: /Room 208/ })).toHaveAttribute(
      'href',
      '/en/contact/move-in?room=orange-208#tabs'
    )
  })

  it('leaves out a price the listing does not give', () => {
    renderRooms({ upcoming: [room('204', '2026-12-22', null)] })

    expect(steps()).toEqual([['Dec 22', 'Room 204']])
  })

  it('says a fully booked house is, in place of the timeline and the note', () => {
    renderRooms({}, NOTE)

    expect(within(section()).getByText('Currently fully booked')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument()
  })
})
