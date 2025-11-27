import {
  GOOGLE_MAPS_URLS,
  HOUSE_CENTERS
} from '@/components/map/location-map-constants'
import { assets } from '@/lib/assets'
import { env } from '@/lib/env'
import { HouseIdentifier } from '@/lib/types'
import { Locale } from 'next-intl'
import {
  LocalBusiness,
  Organization,
  PostalAddress,
  WithContext
} from 'schema-dts'

const houseAddresses: Record<HouseIdentifier, PostalAddress> = {
  orange: {
    '@type': 'PostalAddress',
    streetAddress: '1-chome-21-19 Hannancho, Abeno Ward',
    addressLocality: 'Osaka',
    postalCode: '545-0021',
    addressCountry: 'JP'
  },
  apple: {
    '@type': 'PostalAddress',
    streetAddress: '2-chome-8-4 Shikitsunishi, Naniwa Ward',
    addressLocality: 'Osaka',
    postalCode: '556-0015',
    addressCountry: 'JP'
  },
  lemon: {
    '@type': 'PostalAddress',
    streetAddress: '1-chome-2-2 Nipponbashihigashi, Naniwa Ward',
    addressLocality: 'Osaka',
    postalCode: '556-0006',
    addressCountry: 'JP'
  }
}

const createAbsoluteUrl = (path: string) =>
  new URL(path, env.NEXT_PUBLIC_APP_URL).toString()

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function getOrganizationJsonLd({
  siteName,
  telephone,
  email
}: {
  siteName: string
  telephone: string
  email: string
}): WithContext<Organization> {
  const url = env.NEXT_PUBLIC_APP_URL
  const logo = createAbsoluteUrl('/android-chrome-512x512.png')

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: 'Guest House Osaka',
    image: assets.openGraph.home.src,
    alternateName: siteName,
    address: houseAddresses.orange,
    url,
    contactPoint: {
      '@type': 'ContactPoint',
      email,
      telephone,
      name: 'Kenji Hisamoto'
    },
    logo
  } satisfies WithContext<Organization>
}

export function getLocalBusinessJsonLd({
  house,
  locale,
  name,
  telephone,
  description
}: {
  house: HouseIdentifier
  locale: Locale
  name: string
  telephone: string
  description: string
}): WithContext<LocalBusiness> {
  const { lat: latitude, lng: longitude } = HOUSE_CENTERS[house]
  const { src: image } = assets.openGraph[house]
  const address = houseAddresses[house]
  const url = createAbsoluteUrl(`/${locale}/${house}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#${house}`,
    name,
    description,
    url,
    image,
    telephone,
    email: `${house}@guesthouseosaka.com`,
    address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude,
      longitude
    },
    hasMap: GOOGLE_MAPS_URLS[house],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '10:00',
      closes: '20:00'
    }
  } satisfies WithContext<LocalBusiness>
}
