import type { LocationData, MapData } from '@/lib/types/components'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { HouseLocation } from '../house-location'

// Google Maps can't run in jsdom; the stub shows where the map was asked to center.
vi.mock('@/components/house/house-map', () => ({
  HouseMap: function HouseMapStub({ map }: { map: MapData }) {
    return <figure aria-label={`Map at ${map.coordinates.lat},${map.coordinates.lng}`} />
  }
}))

function block(
  key: string,
  text: string,
  style: 'normal' | 'h3' = 'normal',
  listItem?: 'bullet' | 'number'
): NonNullable<LocationData['details']>[number] {
  return {
    _type: 'block',
    _key: key,
    style,
    ...(listItem && { listItem, level: 1 }),
    children: [{ _type: 'span', _key: `${key}-text`, text, marks: [] }],
    markDefs: []
  }
}

// Shaped like an editor writes it: a section heading, a list of nearby places
// and numbered directions.
const location: LocationData = {
  highlight: 'Five minutes from Tsuruhashi station',
  details: [
    block('nearby', 'Nearby', 'h3'),
    block('shop', 'Supermarket across the street', 'normal', 'bullet'),
    block('laundry', 'Coin laundry', 'normal', 'bullet'),
    block('directions', 'From the station', 'h3'),
    block('exit', 'Take exit 7', 'normal', 'number'),
    block('turn', 'Turn left at the bakery', 'normal', 'number')
  ]
}

const map: MapData = {
  coordinates: { lat: 34.6655, lng: 135.5306 },
  placeId: 'ChIJA9KNRIL-AGARZtCjpPbTMCs',
  placeImage: { asset: null, hotspot: null, crop: null, alt: null, preview: null },
  googleMapsUrl: 'https://maps.app.goo.gl/example'
}

describe('HouseLocation', () => {
  it('shows the highlight and a map centered on the house', async () => {
    render(<HouseLocation location={location} map={map} />)

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Five minutes from Tsuruhashi station')).toBeInTheDocument()
    // The map is code-split, so it appears once its chunk loads.
    expect(
      await screen.findByRole('figure', { name: 'Map at 34.6655,135.5306' })
    ).toBeInTheDocument()
  })

  it('opens the neighborhood details on request', () => {
    render(<HouseLocation location={location} map={map} />)

    fireEvent.click(screen.getByRole('button'))

    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Nearby',
      'From the station'
    ])
    const [nearby, directions] = dialog.getAllByRole('list')
    expect(
      within(nearby)
        .getAllByRole('listitem')
        .map((li) => li.textContent)
    ).toEqual(['Supermarket across the street', 'Coin laundry'])
    expect(directions.tagName).toBe('OL')
    expect(within(directions).getAllByRole('listitem')).toHaveLength(2)
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
