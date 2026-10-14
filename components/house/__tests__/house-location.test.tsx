import type { LocationData, MapData } from '@/lib/types/components'
import { render, screen } from '@testing-library/react'

// `next/dynamic` is replaced with a synchronous stub so the map renders inline,
// and the loading fallback it was given is captured for its own assertion.
const { dynamicOptions } = vi.hoisted(() => ({
  dynamicOptions: { loading: null as (() => React.ReactNode) | null }
}))

vi.mock('next/dynamic', () => ({
  default: (_importFn: () => Promise<unknown>, options?: { loading?: () => React.ReactNode }) => {
    dynamicOptions.loading = options?.loading ?? null

    return function MockHouseMap({ map }: { map: MapData }) {
      return (
        <div
          data-testid="house-map"
          data-lat={map.coordinates.lat}
          data-lng={map.coordinates.lng}
          data-place-id={map.placeId}
        />
      )
    }
  }
}))

// Mirrors the real modal, which renders nothing without details
vi.mock('@/components/house/house-location-modal', () => ({
  HouseLocationModal: ({
    children,
    details
  }: {
    children: React.ReactNode
    details: LocationData['details']
  }) => (details ? <div data-testid="location-modal">{children}</div> : null)
}))

import { HouseLocation } from '../house-location'

const baseProps = {
  location: {
    highlight: 'Great location near the station',
    details: [
      {
        _type: 'block' as const,
        _key: 'd1',
        style: 'normal' as const,
        children: [{ _type: 'span' as const, _key: 's1', text: 'Near train station', marks: [] }],
        markDefs: []
      }
    ]
  },
  map: {
    coordinates: { lat: 34.6937, lng: 135.5023 },
    placeId: 'ChIJA9KNRIL-AGARZtCjpPbTMCs',
    placeImage: {
      asset: { _ref: 'image-test-123', _type: 'reference' as const },
      hotspot: null,
      crop: null,
      alt: 'Place image',
      preview: null
    },
    googleMapsUrl: 'https://maps.google.com/...'
  }
}

describe('HouseLocation', () => {
  it('renders the heading, highlight, and map for a complete location', () => {
    render(<HouseLocation {...baseProps} />)

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Great location near the station')).toBeInTheDocument()

    const map = screen.getByTestId('house-map')
    expect(map).toHaveAttribute('data-lat', '34.6937')
    expect(map).toHaveAttribute('data-lng', '135.5023')
    expect(map).toHaveAttribute('data-place-id', 'ChIJA9KNRIL-AGARZtCjpPbTMCs')
  })

  it('keeps the section and the modal when there is no map', () => {
    render(<HouseLocation {...baseProps} map={null} />)

    expect(screen.queryByTestId('house-map')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Great location near the station')).toBeInTheDocument()
    expect(screen.getByTestId('location-modal')).toBeInTheDocument()
  })

  it('keeps the heading but drops the modal when there is no location', () => {
    render(<HouseLocation {...baseProps} location={null} />)

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.queryByText('Great location near the station')).not.toBeInTheDocument()
    expect(screen.queryByTestId('location-modal')).not.toBeInTheDocument()
  })

  it.each<[string, LocationData['details'], boolean]>([
    ['details are present', baseProps.location.details, true],
    ['details are empty', [], true],
    ['details are null', null, false]
  ])('%s: modal rendered = %s', (_name, details, isRendered) => {
    render(<HouseLocation {...baseProps} location={{ ...baseProps.location, details }} />)

    expect(screen.queryByTestId('location-modal') !== null).toBe(isRendered)
  })

  it('falls back to a skeleton while the map chunk loads', () => {
    render(<HouseLocation {...baseProps} />)
    expect(dynamicOptions.loading).not.toBeNull()

    const { container } = render(<>{dynamicOptions.loading?.()}</>)

    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(1)
  })
})
