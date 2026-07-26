import { HouseAmenities } from '@/components/house/house-amenities'
import { HouseProvider } from '@/components/house/house-context'
import type { AmenityCategoryData, AmenityItemData } from '@/lib/types/components'
import messages from '@/messages/en.json'
import { NextIntlClientProvider } from 'next-intl'

const featuredAmenities = Array.from({ length: 10 }, (_, index) => ({
  _key: `featured-${index}`,
  label: `Amenity ${index + 1}`,
  icon: index % 2 === 0 ? 'wifi' : 'bed',
  note: index === 0 ? 'shared' : null
})) satisfies AmenityItemData[]

const amenityCategories = [
  {
    _key: 'internet',
    _id: 'internet',
    label: 'Internet',
    icon: null,
    items: [
      featuredAmenities[0],
      {
        _key: 'router',
        label: 'Router',
        icon: 'router',
        note: 'shared'
      }
    ]
  },
  {
    _key: 'bedroom',
    _id: 'bedroom',
    label: 'Bedroom',
    icon: null,
    items: [
      featuredAmenities[1],
      {
        _key: 'linen',
        label: 'Bed linen',
        icon: 'bed',
        note: 'private'
      }
    ]
  }
] satisfies AmenityCategoryData[]

export function Populated() {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <HouseProvider id="house-story" type="house" slug="orange">
        <main className="mx-auto max-w-3xl p-6">
          <HouseAmenities
            amenityCategories={amenityCategories}
            featuredAmenities={featuredAmenities}
          />
        </main>
      </HouseProvider>
    </NextIntlClientProvider>
  )
}
