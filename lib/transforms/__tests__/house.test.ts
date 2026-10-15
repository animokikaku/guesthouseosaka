// @vitest-environment node

import { stegaEncodeSourceMap } from '@sanity/client/stega'
import { toAmenityCategories, toAmenityItem, toMapData } from '../house'
import { createAmenityCategory, createAmenityItem, createMap } from './mocks'

/** A value as draft mode delivers it: invisibly tagged with its Studio source. */
function stegaEncoded<T extends string>(value: T): T {
  const { value: encoded } = stegaEncodeSourceMap(
    { value },
    {
      documents: [{ _id: 'house-1', _type: 'house' }],
      paths: ["$['value']"],
      mappings: {
        "$['value']": { type: 'value', source: { type: 'documentValue', document: 0, path: 0 } }
      }
    },
    { enabled: true, studioUrl: '/studio', filter: () => true }
  )
  return encoded
}

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

  // HouseAmenities looks the note up in its badge labels, which a tagged
  // value would miss in draft mode, hiding the badge.
  it('strips draft-mode tagging from the note', () => {
    const note = stegaEncoded('shared')
    expect(note).not.toBe('shared')

    expect(toAmenityItem(createAmenityItem({ note })).note).toBe('shared')
  })
})
