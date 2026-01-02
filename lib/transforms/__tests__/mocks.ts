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
type HouseAmenityCategories = NonNullable<HouseQueryResult>['amenityCategories']
type HouseAmenityCategory = NonNullable<HouseAmenityCategories>[number]
type HouseAmenityItem = NonNullable<HouseAmenityCategory['items']>[number]
type HousePricingRow = NonNullable<HousePricing>[number]
type HouseGalleryCategories = NonNullable<HouseQueryResult>['galleryCategories']
type HouseGalleryCategory = NonNullable<HouseGalleryCategories>[number]
type HouseGalleryItem = NonNullable<HouseGalleryCategory['items']>[number]

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
// House Amenity Mock Factories
// ============================================

export function createAmenityItem(
  overrides: Partial<HouseAmenityItem> = {}
): HouseAmenityItem {
  return {
    _key: faker.string.nanoid(),
    label: faker.word.noun(),
    icon: faker.helpers.arrayElement(['wifi', 'bed', 'utensils', 'bath', 'tv']),
    note: faker.helpers.arrayElement(['shared', 'private', 'coin', null]),
    featured: faker.datatype.boolean(),
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
      key: faker.word.noun(),
      label: faker.word.noun(),
      icon: faker.helpers.arrayElement(['globe', 'home', 'star', null]),
      orderRank: `0|${String.fromCharCode(97 + faker.number.int({ min: 0, max: 9 }))}00000:`
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
  const imageRef = `image-${faker.string.nanoid()}-1920x1080-jpg`
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

export function createGalleryItem(
  overrides: Partial<HouseGalleryItem> = {}
): HouseGalleryItem {
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
      key: faker.word.noun(),
      label: faker.word.words(2),
      orderRank: `${faker.number.int({ min: 1, max: 10 }).toString().padStart(5, '0')}|`
    },
    items: [createGalleryItem(), createGalleryItem()],
    ...overrides
  }
}


// ============================================
// Form Data Mock Factories
// ============================================

export function createTourFormData(overrides: Record<string, unknown> = {}) {
  const futureDate = faker.date.future()
  return {
    places: [faker.helpers.arrayElement(['imazato', 'taisho', 'tsuruhashi'])],
    date: futureDate.toISOString().split('T')[0],
    hour: `${faker.number.int({ min: 10, max: 19 })}:00`,
    account: {
      name: faker.person.fullName(),
      age: String(faker.number.int({ min: 18, max: 65 })),
      gender: faker.helpers.arrayElement(['male', 'female', 'other', 'prefer-not-to-say']),
      nationality: faker.location.country(),
      email: faker.internet.email(),
      phone: faker.phone.number()
    },
    message: faker.lorem.paragraph(),
    privacyPolicy: true,
    ...overrides
  }
}

export function createMoveInFormData(overrides: Record<string, unknown> = {}) {
  const futureDate = faker.date.future()
  return {
    places: [faker.helpers.arrayElement(['imazato', 'taisho', 'tsuruhashi'])],
    date: futureDate.toISOString().split('T')[0],
    stayDuration: faker.helpers.arrayElement(['1-month', '3-months', 'long-term']),
    account: {
      name: faker.person.fullName(),
      age: String(faker.number.int({ min: 18, max: 65 })),
      gender: faker.helpers.arrayElement(['male', 'female', 'other', 'prefer-not-to-say']),
      nationality: faker.location.country(),
      email: faker.internet.email(),
      phone: faker.phone.number()
    },
    message: faker.lorem.paragraph(),
    privacyPolicy: true,
    ...overrides
  }
}

export function createGeneralInquiryData(overrides: Record<string, unknown> = {}) {
  return {
    account: {
      name: faker.person.fullName(),
      email: faker.internet.email()
    },
    message: faker.lorem.paragraphs(2),
    privacyPolicy: true,
    ...overrides
  }
}
