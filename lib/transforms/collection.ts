import type {
  CollectionData,
  CollectionHouseItem,
  ContactTypeItem,
  ContactTypesListData,
  SanityImage
} from '@/lib/types/components'
import type { ContactPageQueryResult, HomePageQueryResult } from '@/sanity.types'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type HomePageHouses = NonNullable<NonNullable<HomePageQueryResult>['houses']>
type HomePageHouse = HomePageHouses[number]

type ContactPageContactTypes = NonNullable<NonNullable<ContactPageQueryResult>['contactTypes']>
type ContactPageContactType = ContactPageContactTypes[number]

// ============================================
// Collection Transformer
// ============================================

/**
 * Transforms a house item from Sanity query to CollectionHouseItem
 */
function toCollectionHouseItem(house: HomePageHouse): CollectionHouseItem {
  return {
    _key: house._key,
    slug: house.slug,
    title: house.title,
    description: house.description,
    image: toSanityImage(house.image)
  }
}

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
 * Transforms HomePage data to CollectionData
 * @param data - Raw homepage data from Sanity query (must include _id, _type, houses)
 */
export function toCollectionData(data: {
  _id: string
  _type: string
  houses: HomePageHouses
}): CollectionData {
  return {
    _id: data._id,
    _type: data._type,
    houses: data.houses.map(toCollectionHouseItem)
  }
}

// ============================================
// Contact Types List Transformer
// ============================================

/**
 * Transforms a contact type from Sanity query to ContactTypeItem
 */
function toContactTypeItem(contactType: ContactPageContactType): ContactTypeItem {
  return {
    _key: contactType._key,
    slug: contactType.slug,
    title: contactType.title,
    description: contactType.description
  }
}

/**
 * Transforms ContactPage data to ContactTypesListData
 * @param data - Raw contact page data from Sanity query (must include _id, _type, contactTypes)
 */
export function toContactTypesListData(data: {
  _id: string
  _type: string
  contactTypes: ContactPageContactTypes
}): ContactTypesListData {
  return {
    _id: data._id,
    _type: data._type,
    contactTypes: data.contactTypes.map(toContactTypeItem)
  }
}
