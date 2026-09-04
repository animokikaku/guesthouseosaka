import { render, screen, fireEvent } from '@testing-library/react'
import { HouseAmenities } from '../house-amenities'
import { HouseProvider } from '../house-context'
import type { AmenityCategoryData, AmenityItemData } from '@/lib/types/components'

vi.mock('@/lib/icons', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />
}))

// The component takes the flattened shape the GROQ query already produces, so
// these build it directly rather than going through a Sanity document mock.
function amenity(label: string, icon = 'wifi', note: AmenityItemData['note'] = null) {
  return { _key: label, label, icon, note } satisfies AmenityItemData
}

function category(label: string, items: AmenityItemData[]) {
  return { _key: label, _id: label, label, icon: null, items } satisfies AmenityCategoryData
}

function numberedAmenities(count: number) {
  return Array.from({ length: count }, (_, index) => amenity(`Amenity ${index}`))
}

function renderAmenities(
  featuredAmenities: AmenityItemData[],
  amenityCategories: AmenityCategoryData[] = [category('Room', featuredAmenities)]
) {
  return render(
    <HouseProvider id="house-test" type="house" slug="orange">
      <HouseAmenities amenityCategories={amenityCategories} featuredAmenities={featuredAmenities} />
    </HouseProvider>
  )
}

describe('HouseAmenities', () => {
  describe('featured amenities display', () => {
    it('renders every featured amenity the query provides', () => {
      // The GROQ query caps the featured list at 10, and the category it comes
      // from stays larger, so this also pins that the grid ignores the categories.
      renderAmenities(numberedAmenities(10), [category('Room', numberedAmenities(15))])

      expect(screen.getAllByText(/Amenity \d+/)).toHaveLength(10)
    })

    it('displays only the featured amenities provided via prop', () => {
      const featured = [amenity('Featured 1'), amenity('Featured 2', 'utensils')]

      renderAmenities(featured, [
        category('Room', [featured[0], amenity('Not Featured', 'bed'), featured[1]])
      ])

      expect(screen.getByText('Featured 1')).toBeInTheDocument()
      expect(screen.getByText('Featured 2')).toBeInTheDocument()
      expect(screen.queryByText('Not Featured')).not.toBeInTheDocument()
    })
  })

  it('renders the section heading and show-all button from translation keys', () => {
    renderAmenities(numberedAmenities(10), [category('Room', numberedAmenities(25))])

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('heading')
    expect(screen.getByRole('button')).toHaveTextContent('show_all')
  })

  it('renders a translated badge for each amenity note', () => {
    renderAmenities([
      amenity('Wifi', 'wifi', 'shared'),
      amenity('Bath', 'bath', 'private'),
      amenity('Laundry', 'shirt', 'coin'),
      amenity('Kitchen', 'utensils')
    ])

    expect(screen.getByText('notes.shared')).toBeInTheDocument()
    expect(screen.getByText('notes.private')).toBeInTheDocument()
    expect(screen.getByText('notes.coin')).toBeInTheDocument()
  })

  it('renders the icon named by each amenity', () => {
    renderAmenities([amenity('Wifi', 'wifi'), amenity('Bed', 'bed')])

    expect(screen.getByTestId('icon-wifi')).toBeInTheDocument()
    expect(screen.getByTestId('icon-bed')).toBeInTheDocument()
  })

  it('keeps the section but drops the dialog when there is nothing to show', () => {
    renderAmenities([], [])

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('lists the categories in order inside the dialog', () => {
    renderAmenities(
      [amenity('Wifi'), amenity('Router', 'router'), amenity('Bed', 'bed')],
      [
        category('Internet', [amenity('Wifi'), amenity('Router', 'router')]),
        category('Bedroom', [amenity('Bed', 'bed')]),
        category('Kitchen', [amenity('Kitchen', 'utensils')])
      ]
    )

    fireEvent.click(screen.getByRole('button'))

    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    ).toEqual(['Internet', 'Bedroom', 'Kitchen'])
  })
})
