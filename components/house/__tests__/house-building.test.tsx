import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HouseBuilding } from '../house-building'
import type { BuildingData } from '@/lib/types/components'

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

const defaultProps = {
  _id: 'house-123',
  _type: 'house',
  slug: 'osaka-house'
}

describe('HouseBuilding', () => {
  it('renders building information', () => {
    render(<HouseBuilding {...defaultProps} building={mockBuildingData} />)

    // Check that the values are rendered (formatted as numbers)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders translation keys for labels', () => {
    render(<HouseBuilding {...defaultProps} building={mockBuildingData} />)

    // The mock useTranslations returns the key
    expect(screen.getByText('rooms_label')).toBeInTheDocument()
    expect(screen.getByText('floors_label')).toBeInTheDocument()
    expect(screen.getByText('min_rent_label')).toBeInTheDocument()
  })

  it('renders with null building data (shows 0 values)', () => {
    render(<HouseBuilding {...defaultProps} building={null} />)

    // Should show 0 for rooms, floors, and price (formatted as currency)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThanOrEqual(2)
  })

  it('renders link to pricing section', () => {
    render(<HouseBuilding {...defaultProps} building={mockBuildingData} />)

    const link = screen.getByTestId('pricing-link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/osaka-house#pricing')
  })

  it('renders icons for rooms and floors', () => {
    render(<HouseBuilding {...defaultProps} building={mockBuildingData} />)

    // The icons are SVGs, check they exist by checking for svg elements
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThanOrEqual(2)
  })

  it('handles partial building data', () => {
    const partialBuilding: BuildingData = {
      rooms: 5
    }

    render(<HouseBuilding {...defaultProps} building={partialBuilding} />)

    expect(screen.getByText('5')).toBeInTheDocument()
    // floors and price should default to 0
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1)
  })

  it('renders three feature items in a grid', () => {
    render(<HouseBuilding {...defaultProps} building={mockBuildingData} />)

    // Check for the grid container
    const grid = document.querySelector('.grid-cols-3')
    expect(grid).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<HouseBuilding {...defaultProps} building={mockBuildingData} />)

    // Check for the main container styling
    const container = document.querySelector('.grid.grid-cols-3')
    expect(container).toBeInTheDocument()
    expect(container).toHaveClass('text-center')
    expect(container).toHaveClass('text-xs')
  })

  it('renders with different slug values', () => {
    render(
      <HouseBuilding
        {...defaultProps}
        slug="another-house"
        building={mockBuildingData}
      />
    )

    const link = screen.getByTestId('pricing-link')
    expect(link).toHaveAttribute('href', '/another-house#pricing')
  })
})
