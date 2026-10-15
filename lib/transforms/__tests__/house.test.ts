// @vitest-environment node

import { toAmenityCategories, toAmenityItem, toMapData } from '../house'
import { createAmenityCategory, createAmenityItem, createMap } from './mocks'

describe('toMapData', () => {
  it('keeps what the map panel needs', () => {
    const map = createMap({ googleMapsUrl: 'https://maps.google.com/?q=Guest+House+Osaka' })

    expect(toMapData(map)).toEqual({
      coordinates: { lat: map.coordinates.lat, lng: map.coordinates.lng },
      placeId: map.placeId,
      placeImage: map.placeImage,
      googleMapsUrl: 'https://maps.google.com/?q=Guest+House+Osaka'
    })
  })

  it.each([
    ['no map', null],
    ['no coordinates', createMap({ coordinates: null as never })],
    ['no latitude', createMap({ coordinates: { _type: 'geopoint', lng: 135.5023 } })],
    ['no longitude', createMap({ coordinates: { _type: 'geopoint', lat: 34.6937 } })]
  ])('shows no map for %s', (_name, map) => {
    expect(toMapData(map)).toBeNull()
  })

  // The URL is CMS content opened from the marker, so only Google Maps links pass.
  it.each([
    'javascript:alert(document.domain)',
    'data:text/html,<script>alert(document.domain)</script>',
    '//maps.app.goo.gl/example',
    'http://maps.app.goo.gl/example',
    'https://example.com/maps',
    'https://maps.app.goo.gl.example.com/x',
    'https://user:password@maps.app.goo.gl/example'
  ])('drops the unsafe link %s but keeps the map', (googleMapsUrl) => {
    const result = toMapData(createMap({ googleMapsUrl }))

    expect(result).not.toBeNull()
    expect(result?.googleMapsUrl).toBeUndefined()
  })
})

describe('toAmenityCategories', () => {
  it('flattens each category reference around its amenities', () => {
    const wifi = createAmenityItem({ _key: 'wifi', label: 'Wifi', icon: 'wifi', note: 'shared' })
    const category = createAmenityCategory({
      _key: 'internet',
      category: { _id: 'cat-internet', label: 'Internet', icon: 'globe' },
      items: [wifi]
    })

    expect(toAmenityCategories([category])).toEqual([
      {
        _key: 'internet',
        _id: 'cat-internet',
        label: 'Internet',
        icon: 'globe',
        items: [{ _key: 'wifi', label: 'Wifi', icon: 'wifi', note: 'shared' }]
      }
    ])
  })

  it('handles missing categories and items', () => {
    expect(toAmenityCategories(null)).toEqual([])
    expect(toAmenityCategories([createAmenityCategory({ items: undefined })])[0].items).toEqual([])
  })
})

describe('toAmenityItem', () => {
  it('keeps only the display fields', () => {
    const item = createAmenityItem({ _key: 'bed', label: 'Bed', icon: 'bed', note: null })

    expect(toAmenityItem(item)).toEqual({ _key: 'bed', label: 'Bed', icon: 'bed', note: null })
  })
})
