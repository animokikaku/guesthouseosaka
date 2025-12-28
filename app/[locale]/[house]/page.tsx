import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import { PageEmptyState } from '@/components/page-empty-state'
import { assets } from '@/lib/assets'
import { urlFor } from '@/sanity/lib/image'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery, housesNavQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { env } from 'process'
import { Accommodation, WithContext } from 'schema-dts'

export default async function HousePage({
  params
}: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = await params
  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  const [{ data }, { data: houses }] = await Promise.all([
    sanityFetch({ query: houseQuery, params: { locale, slug: house } }),
    sanityFetch({ query: housesNavQuery, params: { locale } })
  ])

  if (!data) {
    return <PageEmptyState />
  }

  const url = `${env.NEXT_PUBLIC_APP_URL}/${house}`
  const { title, description, map, building, phone, image } = data

  const jsonLd: WithContext<Accommodation> = {
    '@context': 'https://schema.org',
    '@type': 'House',
    '@id': `${url}#house`,
    url: `${url}/${locale}`,
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
    logo: assets.logo[house].src,
    ...(map?.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: map.address.streetAddress,
        addressLocality: map.address.locality,
        postalCode: map.address.postalCode,
        addressCountry: map.address.country
      }
    }),
    numberOfRooms: building?.rooms,
    telephone: phone?.international
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
        }}
      />
      <HousePageContent {...data} houses={houses} />
    </>
  )
}
