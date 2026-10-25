import type { AmenityCategoryData, AmenityItemData, MapData } from '@/lib/types/components'
import { getGoogleMapsUrl } from '@/lib/google-maps-url'
import type { StegaAware } from '@/lib/types/stega'
import type { HouseQueryResult } from '@/sanity.types'
import { stegaClean } from '@sanity/client/stega'

type HouseMap = NonNullable<HouseQueryResult>['map']
type HouseAmenityCategories =
  | StegaAware<NonNullable<NonNullable<HouseQueryResult>['amenityCategories']>[number]>[]
  | null
type HouseFeaturedAmenity = StegaAware<
  NonNullable<NonNullable<HouseQueryResult>['featuredAmenities']>[number]
>

/** Returns null when the map has no coordinates, and drops an unsafe Google Maps URL. */
export function toMapData(map: HouseMap): MapData | null {
  if (!map) {
    return null
  }

  const { coordinates, placeId, placeImage, googleMapsUrl } = map

  if (!coordinates?.lat || !coordinates.lng) {
    return null
  }

  return {
    coordinates: { lat: coordinates.lat, lng: coordinates.lng },
    placeId,
    placeImage,
    googleMapsUrl: getGoogleMapsUrl(googleMapsUrl)
  }
}

/**
 * Flattens each category reference into the category itself. The query compacts
 * `items`, but the generated types still allow null, hence the fallback.
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
    items: (cat.items ?? []).map(toAmenityItem)
  }))
}

/** Cleans `note`, which is compared against literals. */
export function toAmenityItem({
  _key,
  label,
  icon,
  note
}: Pick<HouseFeaturedAmenity, '_key' | 'label' | 'icon' | 'note'>): AmenityItemData {
  return { _key, label, icon, note: note ? stegaClean(note) : null }
}
