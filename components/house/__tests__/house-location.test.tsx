import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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

// Mock HouseLocationModal
vi.mock('@/components/house/house-location-modal', () => ({
  HouseLocationModal: ({
    children,
    details
  }: {
    children: React.ReactNode
    details: unknown
  }) => (
    <div data-testid="location-modal" data-details-count={Array.isArray(details) ? details.length : 0}>
      {children}
    </div>
  )
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
    children: [{ _type: 'span' as const, _key: 's1', text: 'Near train station', marks: [] }],
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

      expect(screen.getByText('Great location near the station')).toBeInTheDocument()
    })
  })

  describe('HouseMap integration', () => {
    it('renders HouseMap when coordinates exist', () => {
      render(<HouseLocation {...baseProps} />)

      const map = screen.getByTestId('house-map')
      expect(map).toBeInTheDocument()
      expect(map).toHaveAttribute('data-lat', '34.6937')
      expect(map).toHaveAttribute('data-lng', '135.5023')
    })

    it('passes placeId to HouseMap', () => {
      render(<HouseLocation {...baseProps} />)

      const map = screen.getByTestId('house-map')
      expect(map).toHaveAttribute('data-place-id', 'ChIJA9KNRIL-AGARZtCjpPbTMCs')
    })

    it('does not render HouseMap when lat is undefined', () => {
      const props = {
        ...baseProps,
        map: {
          ...baseProps.map,
          coordinates: { lat: undefined as unknown as number, lng: 135.5023 }
        }
      }

      render(<HouseLocation {...props} />)

      expect(screen.queryByTestId('house-map')).not.toBeInTheDocument()
    })

    it('does not render HouseMap when lng is undefined', () => {
      const props = {
        ...baseProps,
        map: {
          ...baseProps.map,
          coordinates: { lat: 34.6937, lng: undefined as unknown as number }
        }
      }

      render(<HouseLocation {...props} />)

      expect(screen.queryByTestId('house-map')).not.toBeInTheDocument()
    })
  })

  describe('HouseLocationModal integration', () => {
    it('renders modal with trigger button', () => {
      render(<HouseLocation {...baseProps} />)

      expect(screen.getByTestId('location-modal')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('disables button when details is empty', () => {
      const props = {
        ...baseProps,
        location: {
          ...baseProps.location,
          details: []
        }
      }

      render(<HouseLocation {...props} />)

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('disables button when details is null', () => {
      const props = {
        ...baseProps,
        location: {
          ...baseProps.location,
          details: null as unknown as typeof baseProps.location.details
        }
      }

      render(<HouseLocation {...props} />)

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('enables button when details has items', () => {
      render(<HouseLocation {...baseProps} />)

      expect(screen.getByRole('button')).not.toBeDisabled()
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
