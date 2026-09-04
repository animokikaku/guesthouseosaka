import type {
  AmenityCategoryData,
  AmenityItemData,
  LocationData,
  MapData,
  PricingRowData,
  SanityImage
} from '@/lib/types/components'
import { getGoogleMapsUrl } from '@/lib/google-maps-url'
import type { StegaAware } from '@/lib/types/stega'
import type { HouseQueryResult } from '@/sanity.types'
import { stegaClean } from 'next-sanity'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type HouseLocation = NonNullable<HouseQueryResult>['location']
type HouseMap = NonNullable<HouseQueryResult>['map']
type HousePricing = NonNullable<HouseQueryResult>['pricing']
type HouseAmenityCategories =
  | StegaAware<NonNullable<NonNullable<HouseQueryResult>['amenityCategories']>[number]>[]
  | null
type HouseFeaturedAmenities =
  | StegaAware<NonNullable<NonNullable<HouseQueryResult>['featuredAmenities']>[number]>[]
  | null

// ============================================
// Location Transformer
// ============================================

/**
 * Supplies the null object HouseLocation destructures. Both fields are already
 * nullable in the query result, so an absent `location` is the only case to
 * normalize.
 */
export function toLocationData(location: HouseLocation): LocationData {
  return location ?? { highlight: null, details: null }
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
    googleMapsUrl: getGoogleMapsUrl(googleMapsUrl)
  }
}

// ============================================
// Pricing Transformer
// ============================================

/**
 * PricingRowData already mirrors the query row, so this only supplies the empty
 * array HousePricing checks the length of.
 */
export function toPricingRows(pricing: HousePricing): PricingRowData[] {
  return pricing ?? []
}

// ============================================
// Amenities Transformer
// ============================================

/**
 * Transforms house amenity categories to AmenityCategoryData array
 * Note: GROQ query uses array::compact so items won't be null at runtime,
 * but generated types (from schema) still require the fallback for type safety
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
    _id: cat.category._id,
    label: cat.category.label,
    icon: cat.category.icon,
    items: (cat.items ?? []).map((item) => ({
      _key: item._key,
      label: item.label,
      icon: item.icon,
      note: item.note ? stegaClean(item.note) : null
    }))
  }))
}

/**
 * Transforms featured amenities from the GROQ query to AmenityItemData array
 * Note: GROQ already filters [featured == true], so no need to set featured here
 * @param featuredAmenities - Raw featured amenities from Sanity query
 * @returns Array of AmenityItemData for display
 */
export function toFeaturedAmenities(featuredAmenities: HouseFeaturedAmenities): AmenityItemData[] {
  if (!featuredAmenities) {
    return []
  }

  return featuredAmenities.map((item) => ({
    _key: item._key,
    label: item.label,
    icon: item.icon,
    note: item.note ? stegaClean(item.note) : null
  }))
}
