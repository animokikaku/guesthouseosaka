import { summarizeAvailability, type AvailabilityRoom } from '@/lib/availability'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { HouseAvailability } from '../house-availability'

const today = '2026-10-16'
const document = {
  _id: 'house-orange',
  _type: 'house',
  _updatedAt: '2026-10-15T09:00:00Z'
}

function room(number: string, availableFrom: string | null, rent = 46000): AvailabilityRoom {
  return { _key: number, number, availableFrom, style: 'japanese', size: 12, rent }
}

function renderAvailability(rooms: AvailabilityRoom[], doc: typeof document | null = document) {
  return render(
    <HouseAvailability document={doc} summary={summarizeAvailability(rooms, today)} today={today} />
  )
}

/** Opens the modal from its badge, whatever it says, and returns it. */
function openAvailability(rooms: AvailabilityRoom[]) {
  renderAvailability(rooms)
  fireEvent.click(screen.getByRole('button'))
  return screen.getByRole('dialog', { name: 'Availability' })
}

describe('HouseAvailability', () => {
  it('lists free and upcoming rooms with their status, details and rent', () => {
    const dialog = openAvailability([
      room('309', '2026-10-01'),
      room('311', '2026-10-20'),
      room('101', null)
    ])

    expect(dialog).toHaveAccessibleDescription('Last updated: October 15, 2026')
    const rows = within(within(dialog).getAllByRole('rowgroup')[1]).getAllByRole('row')
    expect(rows).toHaveLength(2)

    expect(rows[0]).toHaveTextContent(/309/)
    expect(within(rows[0]).getByText('Available now')).toBeInTheDocument()
    expect(rows[0]).toHaveTextContent(/Japanese/)
    expect(rows[0]).toHaveTextContent(/¥46,000/)

    expect(within(rows[1]).getByText(/Available from Oct 20/)).toBeInTheDocument()
  })

  it.each([
    ['1 room available now', [room('309', today), room('311', '2026-10-20')]],
    ['2 rooms available now', [room('309', today), room('310', today)]],
    ['2 rooms opening soon', [room('311', '2026-10-20'), room('312', '2026-11-01')]]
  ])('opens from a "%s" badge', (label, rooms) => {
    renderAvailability(rooms)

    fireEvent.click(screen.getByRole('button', { name: label }))

    expect(screen.getByRole('dialog', { name: 'Availability' })).toBeInTheDocument()
  })

  it('leaves occupied rooms out of the list', () => {
    const dialog = openAvailability([room('101', null), room('309', today)])

    expect(within(dialog).queryByText(/\b101\b/)).not.toBeInTheDocument()
  })

  it('shows the year only for dates in another year', () => {
    const dialog = openAvailability([room('403', '2027-05-17')])

    expect(within(dialog).getByText(/Available from May 17, 2027/)).toBeInTheDocument()
  })

  it('shows a plain "Fully booked" badge when every room is occupied', () => {
    renderAvailability([room('101', null), room('102', null)])

    expect(screen.getByText('Fully booked')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders nothing without an availability document or rooms', () => {
    const { container: noDocument } = renderAvailability([room('309', today)], null)
    expect(noDocument).toBeEmptyDOMElement()

    const { container: noRooms } = renderAvailability([])
    expect(noRooms).toBeEmptyDOMElement()
  })
})
