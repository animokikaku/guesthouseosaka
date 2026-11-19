import type { ListedRoom, RoomAvailability } from '@/lib/rooms'
import { render, screen } from '@testing-library/react'
import { HouseAvailability } from '../house-availability'

function rooms(available: number, upcoming: number): RoomAvailability {
  const room = (index: number): ListedRoom => ({
    roomNumber: `${100 + index}`,
    availableFrom: null,
    rent: 46000
  })
  return {
    today: '2026-11-02',
    available: Array.from({ length: available }, (_, index) => room(index)),
    upcoming: Array.from({ length: upcoming }, (_, index) => room(available + index))
  }
}

describe('HouseAvailability', () => {
  it('links the rooms free now to the timeline', () => {
    render(<HouseAvailability house="orange" rooms={rooms(2, 3)} />)

    expect(screen.getByRole('link', { name: '2 rooms available now' })).toHaveAttribute(
      'href',
      '/en/orange#availability'
    )
  })

  it('links the rooms opening soon when none is free now', () => {
    render(<HouseAvailability house="orange" rooms={rooms(0, 1)} />)

    expect(screen.getByRole('link', { name: '1 room opening soon' })).toHaveAttribute(
      'href',
      '/en/orange#availability'
    )
  })

  it('shows a fully booked house without a link, as it has no timeline', () => {
    render(<HouseAvailability house="lemon" rooms={rooms(0, 0)} />)

    expect(screen.getByText('Fully booked')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
