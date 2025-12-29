import { faker } from '@faker-js/faker'
import type { ContactTypeQueryResult, HouseQueryResult } from '@/sanity.types'

// ============================================
// Type Aliases for Readability
// ============================================

type ContactTypeFields = NonNullable<ContactTypeQueryResult>['fields']

type HouseBuilding = NonNullable<HouseQueryResult>['building']
type HouseLocation = NonNullable<HouseQueryResult>['location']
type HouseMap = NonNullable<HouseQueryResult>['map']
type HousePricing = NonNullable<HouseQueryResult>['pricing']
type HouseAmenities = NonNullable<HouseQueryResult>['amenities']
type HouseAmenity = NonNullable<HouseAmenities>[number]
type HousePricingRow = NonNullable<HousePricing>[number]

// ============================================
// Contact Type Fields Mock Factory
// ============================================

export function createContactTypeFields(
  overrides: Partial<ContactTypeFields> = {}
): ContactTypeFields {
  return {
    places: { label: faker.word.noun(), placeholder: null, description: null },
    date: { label: faker.word.noun(), placeholder: null, description: null },
    hour: { label: faker.word.noun(), placeholder: null, description: null },
    stayDuration: { label: faker.word.noun(), placeholder: faker.lorem.words(2), description: null },
    name: { label: faker.word.noun(), placeholder: faker.lorem.words(2), description: null },
    age: { label: faker.word.noun(), placeholder: faker.lorem.words(2), description: null },
    gender: { label: faker.word.noun(), placeholder: faker.lorem.words(2), description: null },
    nationality: { label: faker.word.noun(), placeholder: faker.lorem.words(2), description: null },
    email: { label: faker.word.noun(), placeholder: faker.lorem.words(2), description: null },
    phone: { label: faker.word.noun(), placeholder: faker.lorem.words(2), description: null },
    message: { label: faker.word.noun(), placeholder: faker.lorem.words(2), description: null },
    ...overrides
  }
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
// House Building Mock Factory
// ============================================

export function createBuilding(
  overrides: Partial<NonNullable<HouseBuilding>> = {}
): NonNullable<HouseBuilding> {
  return {
    rooms: faker.number.int({ min: 1, max: 20 }),
    floors: faker.number.int({ min: 1, max: 5 }),
    startingPrice: faker.number.int({ min: 30000, max: 80000 }),
    ...overrides
  }
}

// ============================================
// House Location Mock Factory
// ============================================

export function createLocation(
  overrides: Partial<NonNullable<HouseLocation>> = {}
): NonNullable<HouseLocation> {
  return {
    highlight: faker.lorem.sentence(),
    details: [{ _type: 'block', _key: faker.string.nanoid(), children: [], style: 'normal' }],
    ...overrides
  }
}

// ============================================
// House Map Mock Factory
// ============================================

export function createMap(
  overrides: Partial<NonNullable<HouseMap>> = {}
): NonNullable<HouseMap> {
  const imageRef = `image-${faker.string.nanoid()}`
  return {
    coordinates: {
      _type: 'geopoint',
      lat: faker.location.latitude(),
      lng: faker.location.longitude()
    },
    placeId: `ChIJ${faker.string.alphanumeric(10)}`,
    placeImage: {
      asset: { _ref: imageRef, _type: 'reference' },
      hotspot: { _type: 'sanity.imageHotspot', x: 0.5, y: 0.5, width: 1, height: 1 },
      crop: null,
      alt: faker.lorem.words(3),
      preview: `data:image/jpeg;base64,${faker.string.alphanumeric(20)}`
    },
    googleMapsUrl: faker.internet.url(),
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
// House Pricing Row Mock Factory
// ============================================

export function createPricingRow(
  overrides: Partial<HousePricingRow> = {}
): HousePricingRow {
  return {
    _key: faker.string.nanoid(),
    label: faker.commerce.productName(),
    content: [{ _type: 'block', _key: faker.string.nanoid(), children: [], style: 'normal' }],
    ...overrides
  }
}

// ============================================
// House Amenity Mock Factory
// ============================================

export function createAmenity(
  overrides: Partial<HouseAmenity> = {}
): HouseAmenity {
  return {
    _key: faker.string.nanoid(),
    label: faker.word.noun(),
    icon: faker.helpers.arrayElement(['wifi', 'bed', 'utensils', 'bath', 'tv']),
    note: faker.helpers.arrayElement(['shared', 'private', 'coin', null]),
    featured: faker.datatype.boolean(),
    category: {
      _id: faker.string.uuid(),
      key: faker.word.noun(),
      label: faker.word.noun(),
      icon: faker.helpers.arrayElement(['globe', 'home', 'star', null]),
      order: faker.number.int({ min: 1, max: 10 })
    },
    ...overrides
  }
}
