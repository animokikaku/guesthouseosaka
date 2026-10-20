import type { AvailabilityRoom } from '@/lib/availability'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { HouseFloorPlan } from '../house-floor-plan'

const today = '2026-10-20'

function room(number: string, availableFrom: string | null, rent = 46000): AvailabilityRoom {
  return { _key: number, number, availableFrom, style: 'japanese', size: 12, rent }
}

function renderFloorPlan(rooms: AvailabilityRoom[]) {
  return render(
    <HouseFloorPlan
      document={{ _id: 'house-orange', _type: 'house' }}
      rooms={rooms}
      today={today}
    />
  )
}

/** The details strip under the grid. */
const details = () => screen.getByText(/^Room \d+$/).closest('[aria-live]') as HTMLElement

describe('HouseFloorPlan', () => {
  const rooms = [
    room('101', null),
    room('106', '2026-11-27', 41000),
    room('205', null),
    room('309', '2026-10-01'),
    room('311', '2026-12-11')
  ]

  it('lays every room out on its floor, top floor first', () => {
    renderFloorPlan(rooms)

    const floorLabels = screen.getAllByText(/^\dF$/).filter((el) => !el.closest('[aria-live]'))
    expect(floorLabels.map((el) => el.textContent)).toEqual(['3F', '2F', '1F'])
    expect(screen.getByRole('button', { name: 'Room 101, Occupied' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Room 106, Nov 27' })).toBeInTheDocument()
  })

  it('starts on a free room and shows the details of the room picked', () => {
    renderFloorPlan(rooms)

    expect(screen.getByRole('button', { name: 'Room 309, Now' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(within(details()).getByText('Room 309')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Room 106, Nov 27' }))

    expect(within(details()).getByText('Room 106')).toBeInTheDocument()
    expect(details()).toHaveTextContent('Japanese · 12 m² · 1F')
    expect(details()).toHaveTextContent('¥41,000/mo')
  })

  it('starts on the next opening when nothing is free', () => {
    renderFloorPlan([room('101', null), room('311', '2026-12-11'), room('106', '2026-11-27')])

    expect(screen.getByRole('button', { name: 'Room 106, Nov 27' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('renders nothing for a house without rooms', () => {
    const { container } = renderFloorPlan([])

    expect(container).toBeEmptyDOMElement()
  })
})
