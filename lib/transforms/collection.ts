import type {
  CollectionHouseItem,
  ContactTypeItem,
  SanityImage
} from '@/lib/types/components'
import type { ContactPageQueryResult, HomePageQueryResult } from '@/sanity.types'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type HomePageHouses = NonNullable<HomePageQueryResult>['houses']
type HomePageHouse = NonNullable<HomePageHouses>[number]

type ContactPageContactTypes = NonNullable<NonNullable<ContactPageQueryResult>['contactTypes']>

// ============================================
// Collection Transformer
// ============================================

/**
 * Transforms Sanity image data to SanityImage interface
 */
function toSanityImage(image: HomePageHouse['image']): SanityImage {
  return {
    asset: image.asset
      ? {
          _id: image.asset._id,
          _ref: image.asset._id,
          _type: 'reference',
          url: image.asset.url
        }
      : null,
    hotspot: image.hotspot,
    crop: image.crop,
    alt: image.alt,
    preview: image.preview
  }
}

/**
 * Transforms houses from Sanity query to CollectionHouseItem array
 */
export function toCollectionHouses(houses: HomePageHouses): CollectionHouseItem[] {
  return houses.map((house) => ({
    _id: house._id,
    slug: house.slug,
    title: house.title,
    description: house.description,
    image: toSanityImage(house.image)
  }))
}

// ============================================
// Contact Types List Transformer
// ============================================

/**
 * Transforms contact types from Sanity query to ContactTypeItem array
 */
export function toContactTypes(contactTypes: ContactPageContactTypes): ContactTypeItem[] {
  return contactTypes.map((contactType) => ({
    _id: contactType._id,
    slug: contactType.slug,
    title: contactType.title,
    description: contactType.description
  }))
}
