import type { LocationData, MapData } from '@/lib/types/components'
import { fireEvent, render, screen } from '@testing-library/react'
import { HouseLocation } from '../house-location'

// Google Maps can't run in jsdom; the stub shows where the map was asked to center.
vi.mock('next/dynamic', () => ({
  default: () =>
    function HouseMapStub({ map }: { map: MapData }) {
      return <figure aria-label={`Map at ${map.coordinates.lat},${map.coordinates.lng}`} />
    }
}))

const location: LocationData = {
  highlight: 'Five minutes from Tsuruhashi station',
  details: [
    {
      _type: 'block',
      _key: 'd1',
      style: 'normal',
      children: [{ _type: 'span', _key: 's1', text: 'Supermarket across the street', marks: [] }],
      markDefs: []
    }
  ]
}

const map: MapData = {
  coordinates: { lat: 34.6655, lng: 135.5306 },
  placeId: 'ChIJA9KNRIL-AGARZtCjpPbTMCs',
  placeImage: { asset: null, hotspot: null, crop: null, alt: null, preview: null },
  googleMapsUrl: 'https://maps.app.goo.gl/example'
}

describe('HouseLocation', () => {
  it('shows the highlight and a map centered on the house', () => {
    render(<HouseLocation location={location} map={map} />)

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Five minutes from Tsuruhashi station')).toBeInTheDocument()
    expect(screen.getByRole('figure', { name: 'Map at 34.6655,135.5306' })).toBeInTheDocument()
  })

  it('opens the neighborhood details on request', () => {
    render(<HouseLocation location={location} map={map} />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('dialog')).toHaveTextContent('Supermarket across the street')
  })

  it('keeps the section without a map', () => {
    render(<HouseLocation location={location} map={null} />)

    expect(screen.getByText('Five minutes from Tsuruhashi station')).toBeInTheDocument()
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })

  it('offers no details button when there are none', () => {
    render(<HouseLocation location={{ ...location, details: null }} map={map} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
