import type { AvailabilityRoom } from '@/lib/availability'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { HouseAvailability } from '../house-availability'

const today = '2026-10-20'
const document = {
  _id: 'house-orange',
  _type: 'house',
  _updatedAt: '2026-10-19T23:30:00Z'
}

function room(number: string, availableFrom: string | null, rent = 46000): AvailabilityRoom {
  return { _key: number, number, availableFrom, style: 'japanese', size: 12, rent }
}

function renderAvailability(rooms: AvailabilityRoom[]) {
  return render(<HouseAvailability document={document} rooms={rooms} today={today} />)
}

const orange = [
  room('309', '2026-10-01'),
  room('311', '2026-10-20'),
  room('207', '2026-11-10'),
  room('106', '2026-11-27', 41000),
  room('208', '2026-12-11'),
  room('403', '2027-05-17', 58000),
  room('101', null)
]

describe('HouseAvailability', () => {
  it('sums up the free rooms, the lowest rent and the next openings', () => {
    renderAvailability(orange)

    const toggle = screen.getByRole('button', { name: /show or hide the rooms/i })
    expect(toggle).toHaveTextContent('2 rooms available now')
    expect(toggle).toHaveTextContent('from ¥46,000 / month')
    expect(toggle).toHaveTextContent(/Next openings\s*Nov 10\s*Nov 27\s*Dec 11\s*\+1/)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the rooms grouped by move-in period, with far-off dates under Later', () => {
    renderAvailability(orange)

    fireEvent.click(screen.getByRole('button', { name: /show or hide the rooms/i }))

    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(headings).toEqual(['Now', 'November', 'December', 'Later'])
    // Occupied rooms only appear in the building view
    expect(screen.queryByText('Room 101')).not.toBeInTheDocument()
  })

  it('shows every room on its floor and the details of the selected one', () => {
    renderAvailability(orange)

    fireEvent.click(screen.getByRole('button', { name: /show or hide the rooms/i }))
    fireEvent.click(screen.getByRole('tab', { name: 'By floor' }))

    // 3F labels the top floor, and the default selection (room 309) is on it too
    expect(screen.getAllByText('3F')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Room 101, Occupied' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Room 106, Nov 27' }))
    const details = screen.getByText('¥41,000').closest('[aria-live]')
    expect(details).not.toBeNull()
    expect(within(details as HTMLElement).getByText('Room 106')).toBeInTheDocument()
    expect(within(details as HTMLElement).getByText('1F')).toBeInTheDocument()
  })

  it('leads with the next opening when nothing is free today', () => {
    renderAvailability([room('201', '2026-11-11', 50000), room('202', '2026-12-15', 53000)])

    const toggle = screen.getByRole('button', { name: /show or hide the rooms/i })
    expect(toggle).toHaveTextContent('Next room opens Nov 11')
    expect(toggle).toHaveTextContent('2 rooms opening soon · from ¥50,000 / month')
    expect(toggle).toHaveTextContent(/Then\s*Dec 15/)
  })

  it('shows a plain notice when the house is full', () => {
    renderAvailability([room('101', null), room('102', null)])

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('Fully booked')).toBeInTheDocument()
    expect(screen.getByText('All 2 rooms are taken right now')).toBeInTheDocument()
  })

  it('renders nothing for a house without rooms', () => {
    const { container } = renderAvailability([])

    expect(container).toBeEmptyDOMElement()
  })
})
