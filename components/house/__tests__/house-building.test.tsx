import type { BuildingData } from '@/lib/types/components'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { HouseBuilding } from '../house-building'
import { HouseProvider } from '../house-context'

function renderBuilding(building: BuildingData | null, hasPricing = true) {
  return render(
    <HouseProvider id="house-123" type="house" slug="orange">
      <HouseBuilding building={building} hasPricing={hasPricing} />
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

  it('does not link to a pricing section the page leaves out', () => {
    renderBuilding({ rooms: 12, floors: 3, startingPrice: 45000 }, false)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(figure(/\brent\b/i)).toBe('¥45,000')
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
})

describe('HouseBuilding floor plan', () => {
  it('opens the rooms by floor from the Rooms figure', () => {
    render(
      <HouseProvider id="house-123" type="house" slug="orange">
        <HouseBuilding
          building={{ rooms: 28, floors: 3, startingPrice: 41000 }}
          hasPricing
          floorPlan={<p>Floor grid</p>}
        />
      </HouseProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /28\s*rooms/i }))

    const dialog = screen.getByRole('dialog', { name: 'Rooms by floor' })
    expect(within(dialog).getByText('Floor grid')).toBeInTheDocument()
  })

  it('keeps the Rooms figure plain without a floor plan', () => {
    render(
      <HouseProvider id="house-123" type="house" slug="orange">
        <HouseBuilding
          building={{ rooms: 28, floors: 3, startingPrice: 41000 }}
          hasPricing={false}
        />
      </HouseProvider>
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
