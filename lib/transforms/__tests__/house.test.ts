import { describe, expect, it } from 'vitest'
import {
  toAmenityItems,
  toBuildingData,
  toLocationData,
  toMapData,
  toPricingRows
} from '../house'
import {
  createAmenity,
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

describe('toAmenityItems', () => {
  it('transforms array of amenities preserving values', () => {
    const amenity1 = createAmenity()
    const amenity2 = createAmenity()
    const amenities = [amenity1, amenity2]

    const result = toAmenityItems(amenities)

    expect(result).toHaveLength(2)
    expect(result[0]._key).toBe(amenity1._key)
    expect(result[0].label).toBe(amenity1.label)
    expect(result[0].icon).toBe(amenity1.icon)
    expect(result[0].note).toBe(amenity1.note)
    expect(result[0].featured).toBe(amenity1.featured)
  })

  it('transforms amenity category', () => {
    const amenity = createAmenity()

    const result = toAmenityItems([amenity])

    expect(result[0].category._id).toBe(amenity.category._id)
    expect(result[0].category.key).toBe(amenity.category.key)
    expect(result[0].category.label).toBe(amenity.category.label)
    expect(result[0].category.order).toBe(amenity.category.order)
  })

  it('returns empty array for null amenities', () => {
    const result = toAmenityItems(null)

    expect(result).toEqual([])
  })

  it('returns empty array for empty amenities array', () => {
    const result = toAmenityItems([])

    expect(result).toEqual([])
  })

  it('handles amenities with null optional fields', () => {
    const amenity = createAmenity({
      label: null,
      note: null,
      featured: null,
      category: {
        _id: 'cat1',
        key: 'room',
        label: null,
        icon: null,
        order: 1
      }
    })

    const result = toAmenityItems([amenity])

    expect(result[0].label).toBeNull()
    expect(result[0].note).toBeNull()
    expect(result[0].featured).toBeNull()
    expect(result[0].category.label).toBeNull()
  })
})
