// @vitest-environment node

import { toAmenityCategories, toAmenityItem, toMapData } from '../house'
import { createAmenityCategory, createAmenityItem, createMap } from './mocks'

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

  it('passes placeImage through unchanged', () => {
    const map = createMap()

    const result = toMapData(map)

    expect(result?.placeImage).toBe(map.placeImage)
  })

  it('accepts a Google Maps URL', () => {
    const googleMapsUrl = 'https://maps.google.com/?q=Guest+House+Osaka'
    const map = createMap({ googleMapsUrl })

    const result = toMapData(map)

    expect(result?.googleMapsUrl).toBe(googleMapsUrl)
  })

  it.each([
    'javascript:alert(document.domain)',
    'data:text/html,<script>alert(document.domain)</script>',
    '//maps.app.goo.gl/example',
    'https://example.com/maps',
    'https://user:password@maps.app.goo.gl/example'
  ])('rejects unsafe Google Maps URL %s', (googleMapsUrl) => {
    const map = createMap({ googleMapsUrl })

    const result = toMapData(map)

    expect(result?.googleMapsUrl).toBeUndefined()
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
        icon: null
      },
      items: [
        createAmenityItem({
          label: null,
          note: null
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

describe('toAmenityItem', () => {
  it('keeps the display fields', () => {
    const item = createAmenityItem({
      _key: 'wifi',
      label: 'Wifi',
      icon: 'wifi',
      note: 'shared'
    })

    expect(toAmenityItem(item)).toEqual({
      _key: 'wifi',
      label: 'Wifi',
      icon: 'wifi',
      note: 'shared'
    })
  })

  it('keeps a null note', () => {
    const item = createAmenityItem({ note: null })

    expect(toAmenityItem(item).note).toBeNull()
  })
})
