import { HousePageContent } from '@/components/house/house-page-content'
import { JsonLd } from '@/components/json-ld'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { getHouseAndLocale } from '@/lib/house-params'
import { getCanonicalMetadata, getCanonicalUrl } from '@/lib/metadata'
import { houseJsonLd } from '@/lib/structured-data'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery, housesTitlesQuery } from '@/sanity/lib/queries'
import type { Metadata } from 'next'

// instant = false: kept on purpose, the whole page depends on the house, so there is
// no shared App Shell worth prefetching. Links here use `prefetch` to load the
// full static page.
export const instant = false

export async function generateMetadata({
  params
}: PageProps<'/[locale]/[house]'>): Promise<Metadata> {
  const { house, locale } = await getHouseAndLocale(params)
  return {
    alternates: getCanonicalMetadata({ pathname: '/[house]', params: { house } }, locale)
  }
}

export default async function HousePage({ params }: PageProps<'/[locale]/[house]'>) {
  const { house, locale } = await getHouseAndLocale(params)

  const [{ data }, { data: houses }] = await Promise.all([
    sanityFetch({ query: houseQuery, params: { locale, slug: house } }),
    sanityFetch({ query: housesTitlesQuery, params: { locale } })
  ])

  if (!data) {
    return <PageEmptyStateSection />
  }

  const url = getCanonicalUrl({ pathname: '/[house]', params: { house } }, locale)

  return (
    <>
      <JsonLd data={houseJsonLd(data, house, url)} />
      <HousePageContent {...data} houses={houses} />
    </>
  )
}
