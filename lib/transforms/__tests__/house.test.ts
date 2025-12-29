import { describe, expect, it } from 'vitest'
import {
  toAmenityItems,
  toBuildingData,
  toLocationData,
  toMapData,
  toPricingRows
} from '../house'

describe('toBuildingData', () => {
  it('transforms valid building data', () => {
    const building = {
      rooms: 10,
      floors: 3,
      startingPrice: 45000
    }

    const result = toBuildingData(building)

    expect(result).toEqual({
      rooms: 10,
      floors: 3,
      startingPrice: 45000
    })
  })

  it('returns empty object for null building', () => {
    const result = toBuildingData(null)

    expect(result).toEqual({})
  })

  it('handles partial building data', () => {
    const building = {
      rooms: 5
    }

    const result = toBuildingData(building as Parameters<typeof toBuildingData>[0])

    expect(result).toEqual({
      rooms: 5,
      floors: undefined,
      startingPrice: undefined
    })
  })
})

describe('toLocationData', () => {
  it('transforms valid location data', () => {
    const location = {
      highlight: 'Near train station',
      details: [{ _type: 'block', _key: '1', children: [] }]
    }

    const result = toLocationData(
      location as Parameters<typeof toLocationData>[0]
    )

    expect(result).toEqual({
      highlight: 'Near train station',
      details: [{ _type: 'block', _key: '1', children: [] }]
    })
  })

  it('returns null values for null location', () => {
    const result = toLocationData(null)

    expect(result).toEqual({
      highlight: null,
      details: null
    })
  })

  it('handles location with missing fields', () => {
    const location = {}

    const result = toLocationData(
      location as Parameters<typeof toLocationData>[0]
    )

    expect(result).toEqual({
      highlight: null,
      details: null
    })
  })
})

describe('toMapData', () => {
  it('transforms valid map data with coordinates', () => {
    const map = {
      coordinates: { lat: 34.6937, lng: 135.5023 },
      placeId: 'ChIJ123456',
      placeImage: {
        asset: { _ref: 'image-123-abc' },
        hotspot: { x: 0.5, y: 0.5 },
        crop: null,
        alt: 'Place image',
        preview: 'data:image/jpeg;base64,...'
      },
      googleMapsUrl: 'https://maps.google.com/?q=...'
    }

    const result = toMapData(map as Parameters<typeof toMapData>[0])

    expect(result).toEqual({
      coordinates: { lat: 34.6937, lng: 135.5023 },
      placeId: 'ChIJ123456',
      placeImage: {
        asset: {
          _id: 'image-123-abc',
          _ref: 'image-123-abc',
          _type: 'reference'
        },
        hotspot: { x: 0.5, y: 0.5 },
        crop: null,
        alt: 'Place image',
        preview: 'data:image/jpeg;base64,...'
      },
      googleMapsUrl: 'https://maps.google.com/?q=...'
    })
  })

  it('returns null for null map data', () => {
    const result = toMapData(null)

    expect(result).toBeNull()
  })

  it('returns null for map with missing coordinates', () => {
    const map = {
      placeId: 'ChIJ123456',
      placeImage: null,
      googleMapsUrl: null
    }

    const result = toMapData(map as Parameters<typeof toMapData>[0])

    expect(result).toBeNull()
  })

  it('returns null for map with partial coordinates (missing lat)', () => {
    const map = {
      coordinates: { lng: 135.5023 },
      placeId: 'ChIJ123456',
      placeImage: null,
      googleMapsUrl: null
    }

    const result = toMapData(map as Parameters<typeof toMapData>[0])

    expect(result).toBeNull()
  })

  it('returns null for map with partial coordinates (missing lng)', () => {
    const map = {
      coordinates: { lat: 34.6937 },
      placeId: 'ChIJ123456',
      placeImage: null,
      googleMapsUrl: null
    }

    const result = toMapData(map as Parameters<typeof toMapData>[0])

    expect(result).toBeNull()
  })

  it('handles map with no placeImage asset', () => {
    const map = {
      coordinates: { lat: 34.6937, lng: 135.5023 },
      placeId: 'ChIJ123456',
      placeImage: null,
      googleMapsUrl: null
    }

    const result = toMapData(map as Parameters<typeof toMapData>[0])

    expect(result).toEqual({
      coordinates: { lat: 34.6937, lng: 135.5023 },
      placeId: 'ChIJ123456',
      placeImage: {
        asset: null,
        hotspot: null,
        crop: null,
        alt: null,
        preview: null
      },
      googleMapsUrl: null
    })
  })
})

describe('toPricingRows', () => {
  it('transforms array of pricing rows', () => {
    const pricing = [
      {
        _key: '1',
        label: 'Monthly Rent',
        content: [{ _type: 'block', _key: 'c1', children: [] }]
      },
      {
        _key: '2',
        label: 'Deposit',
        content: [{ _type: 'block', _key: 'c2', children: [] }]
      }
    ]

    const result = toPricingRows(
      pricing as Parameters<typeof toPricingRows>[0]
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      _key: '1',
      label: 'Monthly Rent',
      content: [{ _type: 'block', _key: 'c1', children: [] }]
    })
    expect(result[1]).toEqual({
      _key: '2',
      label: 'Deposit',
      content: [{ _type: 'block', _key: 'c2', children: [] }]
    })
  })

  it('returns empty array for null pricing', () => {
    const result = toPricingRows(null)

    expect(result).toEqual([])
  })

  it('returns empty array for empty pricing array', () => {
    const result = toPricingRows([] as Parameters<typeof toPricingRows>[0])

    expect(result).toEqual([])
  })

  it('handles pricing rows with null label', () => {
    const pricing = [
      {
        _key: '1',
        label: null,
        content: null
      }
    ]

    const result = toPricingRows(
      pricing as Parameters<typeof toPricingRows>[0]
    )

    expect(result).toEqual([
      {
        _key: '1',
        label: null,
        content: null
      }
    ])
  })
})

describe('toAmenityItems', () => {
  it('transforms array of amenities', () => {
    const amenities = [
      {
        _key: 'a1',
        label: 'WiFi',
        icon: 'wifi',
        note: 'shared' as const,
        featured: true,
        category: {
          _id: 'cat1',
          key: 'internet',
          label: 'Internet',
          order: 1
        }
      },
      {
        _key: 'a2',
        label: 'Kitchen',
        icon: 'utensils',
        note: 'shared' as const,
        featured: false,
        category: {
          _id: 'cat2',
          key: 'facilities',
          label: 'Facilities',
          order: 2
        }
      }
    ]

    const result = toAmenityItems(
      amenities as Parameters<typeof toAmenityItems>[0]
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      _key: 'a1',
      label: 'WiFi',
      icon: 'wifi',
      note: 'shared',
      featured: true,
      category: {
        _id: 'cat1',
        key: 'internet',
        label: 'Internet',
        order: 1
      }
    })
  })

  it('returns empty array for null amenities', () => {
    const result = toAmenityItems(null)

    expect(result).toEqual([])
  })

  it('returns empty array for empty amenities array', () => {
    const result = toAmenityItems([] as Parameters<typeof toAmenityItems>[0])

    expect(result).toEqual([])
  })

  it('handles amenities with null optional fields', () => {
    const amenities = [
      {
        _key: 'a1',
        label: null,
        icon: 'bed',
        note: null,
        featured: null,
        category: {
          _id: 'cat1',
          key: 'room',
          label: null,
          order: 1
        }
      }
    ]

    const result = toAmenityItems(
      amenities as Parameters<typeof toAmenityItems>[0]
    )

    expect(result).toEqual([
      {
        _key: 'a1',
        label: null,
        icon: 'bed',
        note: null,
        featured: null,
        category: {
          _id: 'cat1',
          key: 'room',
          label: null,
          order: 1
        }
      }
    ])
  })
})
