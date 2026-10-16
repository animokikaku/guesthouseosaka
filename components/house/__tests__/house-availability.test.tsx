import { summarizeAvailability, type AvailabilityRoom } from '@/lib/availability'
import { render, screen, within } from '@testing-library/react'
import { HouseAvailability } from '../house-availability'

const today = '2026-10-16'
const document = {
  _id: 'houseAvailability-orange',
  _type: 'houseAvailability',
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

describe('HouseAvailability', () => {
  it('lists free and upcoming rooms with their status, details and rent', () => {
    renderAvailability([room('309', '2026-10-01'), room('311', '2026-10-20'), room('101', null)])

    expect(screen.getByRole('heading', { level: 2, name: /availability/i })).toBeInTheDocument()
    const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')
    expect(rows).toHaveLength(2)

    expect(rows[0]).toHaveTextContent(/309/)
    expect(within(rows[0]).getByText('Available now')).toBeInTheDocument()
    expect(rows[0]).toHaveTextContent(/Japanese/)
    expect(rows[0]).toHaveTextContent(/¥46,000/)

    expect(within(rows[1]).getByText(/Available from Oct 20/)).toBeInTheDocument()
  })

  it('leaves occupied rooms out of the list', () => {
    renderAvailability([room('101', null), room('309', today)])

    expect(screen.queryByText(/\b101\b/)).not.toBeInTheDocument()
  })

  it('shows the year only for dates in another year', () => {
    renderAvailability([room('403', '2027-05-17')])

    expect(screen.getByText(/Available from May 17, 2027/)).toBeInTheDocument()
  })

  it('points to the contact page when every room is occupied', () => {
    renderAvailability([room('101', null), room('102', null)])

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/en/contact')
  })

  it('renders nothing without an availability document or rooms', () => {
    const { container: noDocument } = renderAvailability([room('309', today)], null)
    expect(noDocument).toBeEmptyDOMElement()

    const { container: noRooms } = renderAvailability([])
    expect(noRooms).toBeEmptyDOMElement()
  })
})
