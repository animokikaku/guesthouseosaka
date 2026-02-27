import { describe, expect, it } from 'vitest'
import {
  toAboutContent,
  toAmenityCategories,
  toBuildingData,
  toFeaturedAmenities,
  toLocationData,
  toMapData,
  toPricingRows
} from '../house'
import {
  createAmenityCategory,
  createAmenityItem,
  createBuilding,
  createLocation,
  createMap,
  createPricingRow
} from './mocks'

describe('toBuildingData', () => {
  it('transforms building data preserving all values', () => {
    const building = createBuilding()

    const result = toBuildingData(building)

    expect(result.rooms).toBe(building.rooms)
    expect(result.floors).toBe(building.floors)
    expect(result.startingPrice).toBe(building.startingPrice)
  })

  it('returns empty object for null building', () => {
    const result = toBuildingData(null)

    expect(result).toEqual({})
  })
})

describe('toLocationData', () => {
  it('transforms location data preserving values', () => {
    const location = createLocation()

    const result = toLocationData(location)

    expect(result.highlight).toBe(location.highlight)
    expect(result.details).toEqual(location.details)
  })

  it('returns null values for null location', () => {
    const result = toLocationData(null)

    expect(result).toEqual({
      highlight: null,
      details: null
    })
  })

  it('handles location with undefined fields', () => {
    const location = createLocation({
      highlight: undefined,
      details: undefined
    })

    const result = toLocationData(location)

    expect(result.highlight).toBeNull()
    expect(result.details).toBeNull()
  })
})

describe('toMapData', () => {
  it('transforms map data with coordinates and image', () => {
    const map = createMap()

    const result = toMapData(map)

    expect(result).not.toBeNull()
    expect(result?.coordinates.lat).toBe(map.coordinates.lat)
    expect(result?.coordinates.lng).toBe(map.coordinates.lng)
    expect(result?.placeId).toBe(map.placeId)
    expect(result?.googleMapsUrl).toBe(map.googleMapsUrl)
  })

  it('transforms placeImage asset reference', () => {
    const map = createMap()

    const result = toMapData(map)

    expect(result?.placeImage.asset).toEqual({
      _id: map.placeImage.asset!._ref,
      _ref: map.placeImage.asset!._ref,
      _type: 'reference'
    })
    expect(result?.placeImage.alt).toBe(map.placeImage.alt)
    expect(result?.placeImage.preview).toBe(map.placeImage.preview)
  })

  it('returns null for null map data', () => {
    const result = toMapData(null)

    expect(result).toBeNull()
  })

  it('returns null for map with missing coordinates', () => {
    const map = createMap({
      coordinates: undefined as unknown as typeof map.coordinates
    })

    const result = toMapData(map)

    expect(result).toBeNull()
  })

  it('returns null for map with partial coordinates (missing lat)', () => {
    const map = createMap({
      coordinates: { _type: 'geopoint', lng: 135.5023 }
    })

    const result = toMapData(map)

    expect(result).toBeNull()
  })

  it('returns null for map with partial coordinates (missing lng)', () => {
    const map = createMap({
      coordinates: { _type: 'geopoint', lat: 34.6937 }
    })

    const result = toMapData(map)

    expect(result).toBeNull()
  })

  it('handles map with no placeImage asset', () => {
    const map = createMap({
      placeImage: {
        asset: null,
        hotspot: null,
        crop: null,
        alt: null,
        preview: null
      }
    })

    const result = toMapData(map)

    expect(result?.placeImage.asset).toBeNull()
  })
})

describe('toPricingRows', () => {
  it('transforms array of pricing rows preserving values', () => {
    const row1 = createPricingRow()
    const row2 = createPricingRow()
    const pricing = [row1, row2]

    const result = toPricingRows(pricing)

    expect(result).toHaveLength(2)
    expect(result[0]._key).toBe(row1._key)
    expect(result[0].label).toBe(row1.label)
    expect(result[0].content).toEqual(row1.content)
    expect(result[1]._key).toBe(row2._key)
  })

  it('returns empty array for null pricing', () => {
    const result = toPricingRows(null)

    expect(result).toEqual([])
  })

  it('returns empty array for empty pricing array', () => {
    const result = toPricingRows([])

    expect(result).toEqual([])
  })

  it('handles pricing rows with null label', () => {
    const row = createPricingRow({ label: null, content: null })

    const result = toPricingRows([row])

    expect(result[0].label).toBeNull()
    expect(result[0].content).toBeNull()
  })
})

describe('toAmenityCategories', () => {
  it('transforms array of amenity categories preserving values', () => {
    const cat1 = createAmenityCategory()
    const cat2 = createAmenityCategory()
    const categories = [cat1, cat2]

    const result = toAmenityCategories(categories)

    expect(result).toHaveLength(2)
    expect(result[0]._key).toBe(cat1._key)
    expect(result[0]._id).toBe(cat1.category._id)
    expect(result[0].label).toBe(cat1.category.label)
    expect(result[0].icon).toBe(cat1.category.icon)
  })

  it('transforms amenity items within categories', () => {
    const item1 = createAmenityItem({
      _key: 'item1',
      label: 'Wifi',
      icon: 'wifi'
    })
    const item2 = createAmenityItem({
      _key: 'item2',
      label: 'Bed',
      icon: 'bed'
    })
    const cat = createAmenityCategory({ items: [item1, item2] })

    const result = toAmenityCategories([cat])

    expect(result[0].items).toHaveLength(2)
    expect(result[0].items[0]._key).toBe('item1')
    expect(result[0].items[0].label).toBe('Wifi')
    expect(result[0].items[0].icon).toBe('wifi')
    expect(result[0].items[1]._key).toBe('item2')
  })

  it('returns empty array for null amenity categories', () => {
    const result = toAmenityCategories(null)

    expect(result).toEqual([])
  })

  it('returns empty array for empty categories array', () => {
    const result = toAmenityCategories([])

    expect(result).toEqual([])
  })

  it('handles categories with null optional fields', () => {
    const cat = createAmenityCategory({
      category: {
        _id: 'cat1',
        label: null,
        icon: null,
        orderRank: '0|a00000:'
      },
      items: [
        createAmenityItem({
          label: null,
          note: null,
          featured: null
        })
      ]
    })

    const result = toAmenityCategories([cat])

    expect(result[0].label).toBeNull()
    expect(result[0].icon).toBeNull()
    expect(result[0].items[0].label).toBeNull()
    expect(result[0].items[0].note).toBeNull()
  })

  it('handles category with empty items array', () => {
    const cat = createAmenityCategory({ items: [] })

    const result = toAmenityCategories([cat])

    expect(result[0].items).toEqual([])
  })
})

describe('toFeaturedAmenities', () => {
  it('transforms featured amenities preserving values', () => {
    const items = [
      createAmenityItem({ _key: 'wifi', label: 'Wifi', icon: 'wifi', note: 'shared' }),
      createAmenityItem({ _key: 'bed', label: 'Bed', icon: 'bed', note: null })
    ]

    const result = toFeaturedAmenities(items)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ _key: 'wifi', label: 'Wifi', icon: 'wifi', note: 'shared' })
    expect(result[1]).toEqual({ _key: 'bed', label: 'Bed', icon: 'bed', note: null })
  })

  it('returns empty array for null input', () => {
    const result = toFeaturedAmenities(null)

    expect(result).toEqual([])
  })

  it('returns empty array for empty array', () => {
    const result = toFeaturedAmenities([])

    expect(result).toEqual([])
  })
})

describe('toAboutContent', () => {
  it('returns content as PortableTextBlock array', () => {
    const blocks = [{ _type: 'block' as const, _key: 'b1', children: [], style: 'normal' as const }]

    const result = toAboutContent(blocks)

    expect(result).toEqual(blocks)
  })

  it('returns null for null input', () => {
    const result = toAboutContent(null)

    expect(result).toBeNull()
  })

  it('returns null for empty array', () => {
    const result = toAboutContent([])

    expect(result).toBeNull()
  })
})
