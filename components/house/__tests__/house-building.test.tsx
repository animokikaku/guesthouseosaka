import type { BuildingData } from '@/lib/types/components'
import { render, screen } from '@testing-library/react'
import { HouseBuilding } from '../house-building'
import { HouseProvider } from '../house-context'

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href
  }: {
    children: React.ReactNode
    href: { params: { house: string }; hash: string }
  }) => <a href={`/${href.params.house}${href.hash}`}>{children}</a>
}))

function renderBuilding(building: BuildingData | null) {
  return render(
    <HouseProvider id="house-123" type="house" slug="orange">
      <HouseBuilding building={building} />
    </HouseProvider>
  )
}

/** The figure shown above a label, e.g. `figure(/rooms/i)`. */
function figure(label: RegExp) {
  return screen.getByText(label).previousElementSibling?.textContent
}

describe('HouseBuilding', () => {
  it('summarizes rooms, floors and the starting rent in yen', () => {
    renderBuilding({ rooms: 12, floors: 3, startingPrice: 45000 })

    expect(figure(/rooms/i)).toBe('12')
    expect(figure(/floors/i)).toBe('3')
    expect(figure(/rent/i)).toBe('¥45,000')
  })

  it('links the starting rent to the pricing section', () => {
    renderBuilding({ rooms: 12, floors: 3, startingPrice: 45000 })

    expect(screen.getByRole('link')).toHaveAttribute('href', '/orange#pricing')
    expect(screen.getByRole('link')).toHaveTextContent(/rent/i)
  })

  it('shows zero for figures the house has not filled in', () => {
    renderBuilding({ rooms: 5 })

    expect(figure(/rooms/i)).toBe('5')
    expect(figure(/floors/i)).toBe('0')
    expect(figure(/rent/i)).toBe('¥0')
  })

  it('tags each figure for visual editing', () => {
    renderBuilding(null)

    expect(screen.getByText(/rooms/i).parentElement?.getAttribute('data-sanity')).toContain(
      'building.rooms'
    )
  })
})
