import type { PortableTextBlock } from '@portabletext/types'
import type { HouseQueryResult } from '@/sanity.types'
import type {
  AmenityCategoryData,
  AmenityItemData,
  BuildingData,
  LocationData,
  MapData,
  PricingRowData,
  SanityImage
} from '@/lib/types/components'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type HouseBuilding = NonNullable<HouseQueryResult>['building']
type HouseLocation = NonNullable<HouseQueryResult>['location']
type HouseMap = NonNullable<HouseQueryResult>['map']
type HousePricing = NonNullable<HouseQueryResult>['pricing']
type HouseAmenityCategories = NonNullable<HouseQueryResult>['amenityCategories']
type HouseFeaturedAmenities = NonNullable<HouseQueryResult>['featuredAmenities']
type HouseAbout = NonNullable<HouseQueryResult>['about']

// ============================================
// Building Transformer
// ============================================

/**
 * Transforms house building data to BuildingData interface
 * @param building - Raw building data from Sanity query
 * @returns BuildingData with rooms, floors, and startingPrice
 */
export function toBuildingData(building: HouseBuilding): BuildingData {
  if (!building) {
    return {}
  }
  return {
    rooms: building.rooms,
    floors: building.floors,
    startingPrice: building.startingPrice
  }
}

// ============================================
// Location Transformer
// ============================================

/**
 * Transforms house location data to LocationData interface
 * @param location - Raw location data from Sanity query
 * @returns LocationData with highlight and details
 */
export function toLocationData(location: HouseLocation): LocationData {
  if (!location) {
    return {
      highlight: null,
      details: null
    }
  }
  return {
    highlight: location.highlight ?? null,
    details: (location.details as PortableTextBlock[]) ?? null
  }
}

// ============================================
// Map Transformer
// ============================================

/**
 * Transforms house map data to MapData interface
 * @param map - Raw map data from Sanity query
 * @returns MapData with coordinates, placeId, placeImage, and googleMapsUrl
 *          Returns null if map data is missing or incomplete
 */
export function toMapData(map: HouseMap): MapData | null {
  if (!map) {
    return null
  }

  const { coordinates, placeId, placeImage, googleMapsUrl } = map

  // Coordinates are required for map functionality
  if (!coordinates?.lat || !coordinates?.lng) {
    return null
  }

  const sanityImage: SanityImage = {
    asset: placeImage?.asset
      ? {
          _id: placeImage.asset._ref,
          _ref: placeImage.asset._ref,
          _type: 'reference'
        }
      : null,
    hotspot: placeImage?.hotspot ?? null,
    crop: placeImage?.crop ?? null,
    alt: placeImage?.alt ?? null,
    preview: placeImage?.preview ?? null
  }

  return {
    coordinates: {
      lat: coordinates.lat,
      lng: coordinates.lng
    },
    placeId,
    placeImage: sanityImage,
    googleMapsUrl: googleMapsUrl ?? undefined
  }
}

// ============================================
// Pricing Transformer
// ============================================

/**
 * Transforms house pricing array to PricingRowData array
 * @param pricing - Raw pricing data from Sanity query
 * @returns Array of PricingRowData with _key, label, and content
 */
export function toPricingRows(pricing: HousePricing): PricingRowData[] {
  if (!pricing) {
    return []
  }

  return pricing.map((row) => ({
    _key: row._key,
    label: row.label ?? null,
    content: (row.content as PortableTextBlock[]) ?? null
  }))
}

// ============================================
// Amenities Transformer
// ============================================

/**
 * Transforms house amenity categories to AmenityCategoryData array
 * @param amenityCategories - Raw amenity categories from Sanity query (nested structure)
 * @returns Array of AmenityCategoryData with category info and items
 */
export function toAmenityCategories(
  amenityCategories: HouseAmenityCategories
): AmenityCategoryData[] {
  if (!amenityCategories) {
    return []
  }

  return amenityCategories.map((cat) => ({
    _key: cat._key,
    category: {
      _id: cat.category._id,
      key: cat.category.key,
      label: cat.category.label ?? null,
      icon: cat.category.icon ?? null,
      orderRank: cat.category.orderRank
    },
    items: (cat.items ?? []).map((item) => ({
      _key: item._key,
      label: item.label ?? null,
      icon: item.icon,
      note: item.note ?? null,
      featured: item.featured ?? null
    }))
  }))
}

/**
 * Transforms featured amenities from the GROQ query to AmenityItemData array
 * @param featuredAmenities - Raw featured amenities from Sanity query
 * @returns Array of AmenityItemData for display
 */
export function toFeaturedAmenities(
  featuredAmenities: HouseFeaturedAmenities
): AmenityItemData[] {
  if (!featuredAmenities) {
    return []
  }

  return featuredAmenities
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map((item) => ({
      _key: item._key,
      label: item.label ?? null,
      icon: item.icon,
      note: item.note ?? null,
      featured: true
    }))
}

// ============================================
// About Content Transformer
// ============================================

/**
 * Transforms house about content to PortableTextBlock array
 *
 * The Sanity-generated type is structurally compatible with PortableTextBlock
 * but TypeScript doesn't recognize them as the same due to literal types.
 * This transformer handles the type narrowing explicitly.
 *
 * @param about - Raw about content from Sanity query
 * @returns PortableTextBlock array or null
 */
export function toAboutContent(about: HouseAbout): PortableTextBlock[] | null {
  if (!about || about.length === 0) {
    return null
  }
  // Sanity block content is structurally compatible with PortableTextBlock
  return about as PortableTextBlock[]
}
