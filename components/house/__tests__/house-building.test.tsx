import { message } from '@/lib/__tests__/utils/messages'
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

/** The figure shown above a label, e.g. `figure(message('HouseBuilding.rooms_label'))`. */
function figure(label: string) {
  return screen.getByText(label).previousElementSibling?.textContent
}

describe('HouseBuilding', () => {
  it('summarizes rooms, floors and the starting rent in yen', () => {
    renderBuilding({ rooms: 12, floors: 3, startingPrice: 45000 })

    expect(figure(message('HouseBuilding.rooms_label'))).toBe('12')
    expect(figure(message('HouseBuilding.floors_label'))).toBe('3')
    expect(figure(message('HouseBuilding.min_rent_label'))).toBe('¥45,000')
  })

  it('links the starting rent to the pricing section', () => {
    renderBuilding({ rooms: 12, floors: 3, startingPrice: 45000 })

    expect(screen.getByRole('link')).toHaveAttribute('href', '/orange#pricing')
    expect(screen.getByRole('link')).toHaveTextContent(message('HouseBuilding.min_rent_label'))
  })

  it('shows zero for figures the house has not filled in', () => {
    renderBuilding({ rooms: 5 })

    expect(figure(message('HouseBuilding.rooms_label'))).toBe('5')
    expect(figure(message('HouseBuilding.floors_label'))).toBe('0')
    expect(figure(message('HouseBuilding.min_rent_label'))).toBe('¥0')
  })

  it('tags each figure for visual editing', () => {
    renderBuilding(null)

    expect(
      screen
        .getByText(message('HouseBuilding.rooms_label'))
        .parentElement?.getAttribute('data-sanity')
    ).toContain('building.rooms')
  })
})
