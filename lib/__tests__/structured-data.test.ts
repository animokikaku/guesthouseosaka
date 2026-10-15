// @vitest-environment node

import type { HouseQueryResult, SettingsQueryResult } from '@/sanity.types'
import { createMap, createSanityImage } from '@/lib/transforms/__tests__/mocks'
import { houseJsonLd, organizationJsonLd } from '../structured-data'

const address = {
  _type: 'address',
  streetAddress: '1-2-3 Tsuruhashi',
  locality: 'Osaka',
  postalCode: '544-0031',
  country: 'JP'
} as const

// The CMS stores `locality`/`country`; schema.org reads only its own names.
const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: '1-2-3 Tsuruhashi',
  addressLocality: 'Osaka',
  postalCode: '544-0031',
  addressCountry: 'JP'
}

describe('organizationJsonLd', () => {
  const settings: NonNullable<SettingsQueryResult> = {
    _id: 'settings',
    _type: 'settings',
    siteName: 'Guest House Osaka',
    siteDescription: null,
    companyName: 'Guest House Osaka Ltd.',
    email: 'info@example.com',
    phone: '+81-6-1234-5678',
    address,
    socialLinks: [
      { _key: 'ig', icon: 'instagram', label: 'Instagram', url: 'https://instagram.com/x' }
    ]
  }

  it('describes the business with the contact details from the settings', () => {
    expect(organizationJsonLd(settings, 'https://guesthouseosaka.test')).toMatchObject({
      '@type': 'Organization',
      '@id': 'https://guesthouseosaka.test/#organization',
      legalName: 'Guest House Osaka Ltd.',
      telephone: '+81-6-1234-5678',
      email: 'info@example.com',
      sameAs: ['https://instagram.com/x'],
      address: postalAddress
    })
  })

  it('names the business even before the settings exist', () => {
    const data = organizationJsonLd(null, 'https://guesthouseosaka.test')

    expect(data).toMatchObject({ '@type': 'Organization', name: 'Guest House Osaka' })
    expect(data).not.toHaveProperty('telephone')
  })
})

describe('houseJsonLd', () => {
  const house = {
    title: 'Orange House',
    description: 'Near the station',
    image: createSanityImage(),
    map: { ...createMap(), coordinates: { _type: 'geopoint', lat: 34.66, lng: 135.53 }, address },
    building: { _type: 'houseBuilding', rooms: 12, floors: 3, startingPrice: 45000 },
    phone: { _type: 'housePhone', domestic: '06-1234-5678', international: '+81-6-1234-5678' }
  } as unknown as NonNullable<HouseQueryResult>
  const url = 'https://guesthouseosaka.test/en/orange'

  it('describes the house as a place to stay, on the map', () => {
    expect(houseJsonLd(house, 'orange', url)).toMatchObject({
      '@type': 'House',
      '@id': `${url}#house`,
      url,
      name: 'Orange House',
      geo: { '@type': 'GeoCoordinates', latitude: 34.66, longitude: 135.53 },
      address: postalAddress,
      numberOfRooms: 12,
      telephone: '+81-6-1234-5678'
    })
  })

  it('shares an image at the social card size', () => {
    const data = houseJsonLd(house, 'orange', url)

    for (const param of ['w=1200', 'h=630', 'fit=crop']) {
      expect(data).toHaveProperty('image', expect.stringContaining(param))
    }
  })

  it('leaves out the location until the map is filled in', () => {
    const data = houseJsonLd({ ...house, map: null }, 'orange', url)

    expect(data).not.toHaveProperty('geo')
    expect(data).not.toHaveProperty('address')
  })
})
