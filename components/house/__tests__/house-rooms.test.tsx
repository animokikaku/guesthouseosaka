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

/** Each room as shown: its name, when it's free, and its price if it has one. */
function items() {
  return within(section())
    .getAllByRole('listitem')
    .map((item) => {
      const when = item.querySelector('[data-slot=item-description]')
      return [
        // The title holds the price after the name.
        item.querySelector('[data-slot=item-title]')?.firstChild,
        // A date also holds its sentence for screen readers.
        when?.querySelector('[aria-hidden]:not(svg)') ?? when,
        ...item.querySelectorAll('[data-slot=room-price]')
      ].map((node) => node?.textContent)
    })
}

describe('HouseRooms', () => {
  it('lists rooms free now first, then the others as given, each with when it is free', () => {
    renderRooms({
      available: [room('106', null, 53000), room('201', null)],
      upcoming: [room('208', '2026-12-11'), room('209', '2026-12-11'), room('309', null)]
    })

    expect(items()).toEqual([
      ['Room 106', 'Available now', '¥53,000'],
      ['Room 201', 'Available now', '¥58,000'],
      ['Room 208', 'Dec 11', '¥58,000'],
      ['Room 209', 'Dec 11', '¥58,000'],
      ['Room 309', 'Date TBC', '¥58,000']
    ])
  })

  it('says what the prices include, in Site Settings’ words', () => {
    renderRooms({ available: [room('106', null)] }, NOTE)

    expect(within(section()).getByText(NOTE)).toBeInTheDocument()
  })

  it.each([null, ''])('has only its title over the rooms without a note (%j)', (note) => {
    renderRooms({ available: [room('106', null)] }, note)

    expect(section().querySelector(':scope > div > p')).not.toBeInTheDocument()
    expect(items()).toEqual([['Room 106', 'Available now', '¥58,000']])
  })

  it('gives the year only for a date in another year', () => {
    renderRooms({ upcoming: [room('204', '2026-12-22'), room('309', '2027-02-01')] })

    expect(items().map(([, when]) => when)).toEqual(['Dec 22', 'Feb 1, 2027'])
  })

  it('tells screen readers a date is when the room frees up', () => {
    renderRooms({ upcoming: [room('309', '2027-02-01')] })

    const date = screen.getByText('Available from Feb 1, 2027').closest('time')
    expect(date).toHaveAttribute('datetime', '2027-02-01')
  })

  it('makes each room a link to the move-in form, asking for that room', () => {
    renderRooms({ upcoming: [room('208', '2026-12-11')] })

    expect(screen.getByRole('link', { name: /Room 208/ })).toHaveAttribute(
      'href',
      '/en/contact/move-in?room=orange-208#tabs'
    )
  })

  it('leaves out a price the listing does not give', () => {
    renderRooms({ upcoming: [room('204', '2026-12-22', null)] })

    expect(items()).toEqual([['Room 204', 'Dec 22']])
  })

  it('says a fully booked house is, in place of the rooms and the note', () => {
    renderRooms({}, NOTE)

    expect(within(section()).getByText('Currently fully booked')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument()
  })
})
