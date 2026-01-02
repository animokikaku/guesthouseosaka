import { LocationData } from '@/lib/types/components'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HouseLocation } from '../house-location'

// Mock next/dynamic to render synchronously
vi.mock('next/dynamic', () => ({
  default: () => {
    // Return a mock HouseMap component
    return function MockHouseMap(props: {
      center: { lat: number; lng: number }
      placeId: string | null
    }) {
      return (
        <div
          data-testid="house-map"
          data-lat={props.center.lat}
          data-lng={props.center.lng}
          data-place-id={props.placeId}
        >
          HouseMap Mock
        </div>
      )
    }
  }
}))

// Mock HouseLocationModal - matches real component behavior
vi.mock('@/components/house/house-location-modal', () => ({
  HouseLocationModal: ({
    children,
    details
  }: {
    children: React.ReactNode
    details: LocationData['details']
  }) => {
    if (!details) return null
    return (
      <div
        data-testid="location-modal"
        data-details-count={details.length}
      >
        {children}
      </div>
    )
  }
}))

const mockPlaceImage = {
  asset: { _ref: 'image-test-123', _type: 'reference' as const },
  hotspot: null,
  crop: null,
  alt: 'Place image',
  preview: null
}

const mockDetails = [
  {
    _type: 'block' as const,
    _key: 'd1',
    style: 'normal' as const,
    children: [
      {
        _type: 'span' as const,
        _key: 's1',
        text: 'Near train station',
        marks: []
      }
    ],
    markDefs: []
  }
]

const baseProps = {
  location: {
    highlight: 'Great location near the station',
    details: mockDetails
  },
  map: {
    coordinates: { lat: 34.6937, lng: 135.5023 },
    placeId: 'ChIJA9KNRIL-AGARZtCjpPbTMCs',
    placeImage: mockPlaceImage,
    googleMapsUrl: 'https://maps.google.com/...'
  }
}

describe('HouseLocation', () => {
  describe('section structure', () => {
    it('renders section with heading', () => {
      render(<HouseLocation {...baseProps} />)

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    })

    it('renders highlight text', () => {
      render(<HouseLocation {...baseProps} />)

      expect(
        screen.getByText('Great location near the station')
      ).toBeInTheDocument()
    })
  })

  describe('HouseMap integration', () => {
    it('renders HouseMap when map data exists', () => {
      render(<HouseLocation {...baseProps} />)

      const map = screen.getByTestId('house-map')
      expect(map).toBeInTheDocument()
      expect(map).toHaveAttribute('data-lat', '34.6937')
      expect(map).toHaveAttribute('data-lng', '135.5023')
    })

    it('passes placeId to HouseMap', () => {
      render(<HouseLocation {...baseProps} />)

      const map = screen.getByTestId('house-map')
      expect(map).toHaveAttribute(
        'data-place-id',
        'ChIJA9KNRIL-AGARZtCjpPbTMCs'
      )
    })

    it('does not render HouseMap when map is null', () => {
      const props = {
        ...baseProps,
        map: null
      }

      render(<HouseLocation {...props} />)

      expect(screen.queryByTestId('house-map')).not.toBeInTheDocument()
    })

    it('still renders section content when map is null', () => {
      const props = {
        ...baseProps,
        map: null
      }

      render(<HouseLocation {...props} />)

      // Section heading and highlight text should still be visible
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(
        screen.getByText('Great location near the station')
      ).toBeInTheDocument()
      // Modal trigger should still be available
      expect(screen.getByTestId('location-modal')).toBeInTheDocument()
    })
  })

  describe('HouseLocationModal integration', () => {
    it('renders modal with trigger button', () => {
      render(<HouseLocation {...baseProps} />)

      expect(screen.getByTestId('location-modal')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders modal with empty details', () => {
      const props = {
        ...baseProps,
        location: {
          ...baseProps.location,
          details: []
        }
      }

      render(<HouseLocation {...props} />)

      expect(screen.getByTestId('location-modal')).toBeInTheDocument()
    })

    it('does not render modal when details is null', () => {
      const props = {
        ...baseProps,
        location: {
          ...baseProps.location,
          details: null as unknown as typeof baseProps.location.details
        }
      }

      render(<HouseLocation {...props} />)

      expect(screen.queryByTestId('location-modal')).not.toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('applies heading styles', () => {
      render(<HouseLocation {...baseProps} />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveClass('text-2xl', 'font-semibold', 'mb-6')
    })

    it('renders highlight with proper styling', () => {
      render(<HouseLocation {...baseProps} />)

      const paragraph = screen.getByText('Great location near the station')
      expect(paragraph.tagName).toBe('P')
      expect(paragraph).toHaveClass('text-foreground', 'text-base')
    })
  })
})
