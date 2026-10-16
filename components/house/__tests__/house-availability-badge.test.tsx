import { render, screen } from '@testing-library/react'
import { HouseAvailabilityBadge } from '../house-availability-badge'

describe('HouseAvailabilityBadge', () => {
  it.each([
    [1, 7, '1 room available now'],
    [2, 0, '2 rooms available now'],
    [0, 3, '3 rooms opening soon']
  ])(
    'links %i free and %i upcoming rooms to the availability section',
    (available, upcoming, label) => {
      render(
        <HouseAvailabilityBadge slug="orange" availableCount={available} upcomingCount={upcoming} />
      )

      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        '/en/orange#availability'
      )
    }
  )

  it('is hidden when the house is full', () => {
    const { container } = render(
      <HouseAvailabilityBadge slug="orange" availableCount={0} upcomingCount={0} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
