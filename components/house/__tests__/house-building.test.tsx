import type { BuildingData } from '@/lib/types/components'
import { render, screen } from '@testing-library/react'
import { HouseBuilding } from '../house-building'
import { HouseProvider } from '../house-context'

function renderBuilding(
  building: BuildingData | null,
  availability?: React.ComponentProps<typeof HouseBuilding>['availability']
) {
  return render(
    <HouseProvider id="house-123" type="house" slug="orange">
      <HouseBuilding building={building} availability={availability} />
    </HouseProvider>
  )
}

/** The figure shown above a label, e.g. `figure(/\brooms\b/i)`. */
function figure(label: RegExp) {
  return screen.getByText(label).previousElementSibling?.textContent
}

describe('HouseBuilding', () => {
  it('summarizes rooms, floors and the starting rent in yen', () => {
    renderBuilding({ rooms: 12, floors: 3, startingPrice: 45000 })

    expect(figure(/\brooms\b/i)).toBe('12')
    expect(figure(/\bfloors\b/i)).toBe('3')
    expect(figure(/\brent\b/i)).toBe('¥45,000')
  })

  it('links the starting rent to the pricing section', () => {
    renderBuilding({ rooms: 12, floors: 3, startingPrice: 45000 })

    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/orange#pricing')
    expect(screen.getByRole('link')).toHaveTextContent(/\brent\b/i)
  })

  it('shows zero for figures the house has not filled in', () => {
    renderBuilding({ rooms: 5 })

    expect(figure(/\brooms\b/i)).toBe('5')
    expect(figure(/\bfloors\b/i)).toBe('0')
    expect(figure(/\brent\b/i)).toBe('¥0')
  })

  it('tags each figure for visual editing', () => {
    renderBuilding(null)

    expect(screen.getByText(/\brooms\b/i).parentElement?.getAttribute('data-sanity')).toContain(
      'building.rooms'
    )
  })

  it.each([
    [{ availableCount: 1, upcomingCount: 7 }, '1 room available now'],
    [{ availableCount: 0, upcomingCount: 3 }, '3 rooms opening soon'],
    [{ availableCount: 0, upcomingCount: 0 }, 'Fully occupied']
  ])('links the rooms figure to availability, labelled %o', (availability, label) => {
    renderBuilding({ rooms: 28, floors: 3, startingPrice: 41000 }, availability)

    const link = screen.getByRole('link', { name: new RegExp(label) })
    expect(link).toHaveAttribute('href', '/en/orange#availability')
    expect(link).toHaveTextContent(/28\s*rooms/i)
  })
})
