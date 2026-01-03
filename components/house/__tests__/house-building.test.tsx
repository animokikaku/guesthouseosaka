import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HouseBuilding } from '../house-building'
import { HouseProvider } from '../house-context'
import type { BuildingData } from '@/lib/types/components'
import type { HouseIdentifier } from '@/lib/types'

// Mock next-sanity
vi.mock('next-sanity', () => ({
  createDataAttribute: () => (path: string) => `data-sanity-${path}`
}))

// Mock the i18n navigation Link
vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href
  }: {
    children: React.ReactNode
    href: { pathname: string; params: { house: string }; hash: string }
  }) => (
    <a
      href={`${href.pathname.replace('[house]', href.params.house)}${href.hash}`}
      data-testid="pricing-link"
    >
      {children}
    </a>
  )
}))

const mockBuildingData: BuildingData = {
  rooms: 10,
  floors: 3,
  startingPrice: 45000
}

const providerProps: {
  id: string
  type: string
  slug: HouseIdentifier
} = {
  id: 'house-123',
  type: 'house',
  slug: 'orange'
}

function renderWithProvider(
  ui: React.ReactElement,
  overrideProviderProps?: Partial<typeof providerProps>
) {
  return render(
    <HouseProvider {...providerProps} {...overrideProviderProps}>
      {ui}
    </HouseProvider>
  )
}

describe('HouseBuilding', () => {
  it('renders building information', () => {
    renderWithProvider(<HouseBuilding building={mockBuildingData} />)

    // Check that the values are rendered (formatted as numbers)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders translation keys for labels', () => {
    renderWithProvider(<HouseBuilding building={mockBuildingData} />)

    // The mock useTranslations returns the key
    expect(screen.getByText('rooms_label')).toBeInTheDocument()
    expect(screen.getByText('floors_label')).toBeInTheDocument()
    expect(screen.getByText('min_rent_label')).toBeInTheDocument()
  })

  it('renders with null building data (shows 0 values)', () => {
    renderWithProvider(<HouseBuilding building={null} />)

    // Should show 0 for rooms, floors, and price (formatted as currency)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(2)
  })

  it('renders link to pricing section', () => {
    renderWithProvider(<HouseBuilding building={mockBuildingData} />)

    const link = screen.getByTestId('pricing-link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/orange#pricing')
  })

  it('handles partial building data', () => {
    const partialBuilding: BuildingData = {
      rooms: 5
    }

    renderWithProvider(<HouseBuilding building={partialBuilding} />)

    expect(screen.getByText('5')).toBeInTheDocument()
    // floors and price should default to 0
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1)
  })
})
