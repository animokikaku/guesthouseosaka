import { assets } from '@/lib/assets'
import type { HouseIdentifier } from '@/lib/types'
import type { Address, HouseQueryResult, SettingsQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import type { Accommodation, Organization, PostalAddress, WithContext } from 'schema-dts'

type House = NonNullable<HouseQueryResult>
type Settings = SettingsQueryResult

/** The CMS address under schema.org's property names. */
function toPostalAddress({ streetAddress, locality, postalCode, country }: Address): PostalAddress {
  return {
    '@type': 'PostalAddress',
    streetAddress,
    addressLocality: locality,
    postalCode,
    addressCountry: country
  }
}

/** The business behind every page, with contact details from the site settings. */
export function organizationJsonLd(settings: Settings, origin: string): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: 'Guest House Osaka',
    alternateName: 'ゲストハウス大阪',
    logo: assets.logo.sho.src,
    image: assets.openGraph.home.src,
    ...(settings && {
      legalName: settings.companyName,
      telephone: settings.phone,
      email: settings.email,
      sameAs: settings.socialLinks?.map((link) => link.url),
      address: settings.address ? toPostalAddress(settings.address) : undefined
    })
  }
}

/** A house as a place to stay, located on the map when its coordinates are set. */
export function houseJsonLd(
  { title, description, image, map, building, phone }: House,
  slug: HouseIdentifier,
  url: string
): WithContext<Accommodation> {
  return {
    '@context': 'https://schema.org',
    '@type': 'House',
    '@id': `${url}#house`,
    url,
    name: title ?? undefined,
    description: description ?? undefined,
    image: urlFor(image).width(1200).height(630).fit('crop').url(),
    ...(map?.coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: map.coordinates.lat,
        longitude: map.coordinates.lng
      }
    }),
    hasMap: map?.googleMapsUrl ?? undefined,
    logo: assets.logo[slug].src,
    ...(map?.address && { address: toPostalAddress(map.address) }),
    numberOfRooms: building?.rooms,
    telephone: phone.international
  }
}
