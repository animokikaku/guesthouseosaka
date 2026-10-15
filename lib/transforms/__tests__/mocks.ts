import type {
  ContactTypeQueryResult,
  HouseGalleryQueryResult,
  HouseQueryResult
} from '@/sanity.types'
import { faker } from '@faker-js/faker'

// ============================================
// Type Aliases for Readability
// ============================================

type ContactTypeFields = NonNullable<ContactTypeQueryResult>['fields']

type HouseMap = NonNullable<HouseQueryResult>['map']
type HouseAmenityCategories = NonNullable<HouseQueryResult>['amenityCategories']
type HouseAmenityCategory = NonNullable<HouseAmenityCategories>[number]
type HouseAmenityItem = NonNullable<HouseAmenityCategory['items']>[number]
type HouseGalleryCategories = NonNullable<HouseGalleryQueryResult>['galleryCategories']
type HouseGalleryCategory = NonNullable<HouseGalleryCategories>[number]
type HouseGalleryItem = NonNullable<HouseGalleryCategory['items']>[number]

// ============================================
// Contact Type Fields Mock Factory
// ============================================

/** Pickers that editors leave without a placeholder; every other field has one. */
const FIELDS_WITHOUT_PLACEHOLDER = ['places', 'date', 'hour'] as const

const FIELDS_WITH_PLACEHOLDER = [
  'stayDuration',
  'name',
  'age',
  'gender',
  'nationality',
  'email',
  'phone',
  'message'
] as const

export function createContactTypeFields(
  overrides: Partial<ContactTypeFields> = {}
): ContactTypeFields {
  const field = (placeholder: string | null) => ({
    label: faker.word.noun(),
    placeholder,
    description: null
  })

  // The two key lists together cover every field.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return {
    ...Object.fromEntries(FIELDS_WITHOUT_PLACEHOLDER.map((key) => [key, field(null)])),
    ...Object.fromEntries(FIELDS_WITH_PLACEHOLDER.map((key) => [key, field(faker.lorem.words(2))])),
    ...overrides
  } as ContactTypeFields
}

// ============================================
// Contact Type Mock Factory
// ============================================

export function createContactType(
  overrides: Partial<NonNullable<ContactTypeQueryResult>> = {}
): NonNullable<ContactTypeQueryResult> {
  return {
    _id: faker.string.uuid(),
    _type: 'contactType',
    slug: faker.helpers.arrayElement(['tour', 'move-in', 'other'] as const),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    fields: createContactTypeFields(),
    ...overrides
  }
}

// ============================================
// House Map Mock Factory
// ============================================

export function createMap(overrides: Partial<NonNullable<HouseMap>> = {}): NonNullable<HouseMap> {
  const imageRef = `image-${faker.string.alphanumeric(24)}-600x400-jpg`
  return {
    coordinates: {
      _type: 'geopoint',
      lat: faker.location.latitude(),
      lng: faker.location.longitude()
    },
    placeId: `ChIJ${faker.string.alphanumeric(10)}`,
    placeImage: {
      asset: { _ref: imageRef, _type: 'reference' },
      hotspot: {
        _type: 'sanity.imageHotspot',
        x: 0.5,
        y: 0.5,
        width: 1,
        height: 1
      },
      crop: null,
      alt: faker.lorem.words(3),
      preview: `data:image/jpeg;base64,${faker.string.alphanumeric(20)}`
    },
    googleMapsUrl: `https://maps.app.goo.gl/${faker.string.alphanumeric(17)}`,
    address: {
      _type: 'address',
      streetAddress: faker.location.streetAddress(),
      locality: faker.location.city(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country()
    },
    ...overrides
  }
}

// ============================================
// House Amenity Mock Factories
// ============================================

export function createAmenityItem(overrides: Partial<HouseAmenityItem> = {}): HouseAmenityItem {
  return {
    _key: faker.string.nanoid(),
    label: faker.word.noun(),
    icon: faker.helpers.arrayElement(['wifi', 'bed', 'utensils', 'bath', 'tv']),
    note: faker.helpers.arrayElement(['shared', 'private', 'coin', null]),
    ...overrides
  }
}

export function createAmenityCategory(
  overrides: Partial<HouseAmenityCategory> = {}
): HouseAmenityCategory {
  return {
    _key: faker.string.nanoid(),
    category: {
      _id: faker.string.uuid(),
      label: faker.word.noun(),
      icon: faker.helpers.arrayElement(['globe', 'home', 'star', null])
    },
    items: [createAmenityItem(), createAmenityItem()],
    ...overrides
  }
}

// ============================================
// Sanity Image Mock Factory
// ============================================

export function createSanityImage(
  overrides: Partial<NonNullable<HouseGalleryItem['image']>> = {}
): NonNullable<HouseGalleryItem['image']> {
  const imageRef = `image-${faker.string.alphanumeric(24)}-1920x1080-jpg`
  return {
    asset: {
      _ref: imageRef,
      _type: 'reference'
    },
    hotspot: null,
    crop: null,
    alt: faker.lorem.words(3),
    preview: `data:image/jpeg;base64,${faker.string.alphanumeric(20)}`,
    ...overrides
  }
}

// ============================================
// Gallery Item Mock Factory (for items within a category)
// ============================================

export function createGalleryItem(overrides: Partial<HouseGalleryItem> = {}): HouseGalleryItem {
  return {
    _key: faker.string.nanoid(),
    image: createSanityImage(),
    ...overrides
  }
}

// ============================================
// Gallery Category Mock Factory (container with items)
// ============================================

export function createGalleryCategory(
  overrides: Partial<HouseGalleryCategory> = {}
): HouseGalleryCategory {
  return {
    _key: faker.string.nanoid(),
    category: {
      _id: faker.string.uuid(),
      label: faker.word.words(2),
      orderRank: `${faker.number.int({ min: 1, max: 10 }).toString().padStart(5, '0')}|`
    },
    items: [createGalleryItem(), createGalleryItem()],
    ...overrides
  }
}
