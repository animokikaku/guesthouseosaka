import { routing } from '@/i18n/routing'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { staticParamsForLocales } from '@/lib/static-params'
import { HouseIdentifierValues, isHouseIdentifier } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/live'
import { houseMetaQuery, settingsQuery } from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { use } from 'react'

// Public Sanity content: fail the build if anything here would render per request.
export const ensureStatic = 'navigation'

// instant = false: kept on purpose, this layout validates the house param
// before rendering anything, so there is no shared App Shell worth
// prefetching. Links here use `prefetch` to load the full static page.
export const instant = false

// The layout only renders known houses, so every one is prerendered; a house
// missing from Sanity renders its empty state.
export function generateStaticParams() {
  return staticParamsForLocales(
    routing.locales,
    HouseIdentifierValues.map((slug) => ({ slug })),
    'house'
  )
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/[house]'>, 'children'>
): Promise<Metadata | undefined> {
  const [{ house }, locale] = await Promise.all([props.params, getLocale()])

  if (!isHouseIdentifier(house)) {
    return undefined
  }

  const [{ data }, { data: settings }] = await Promise.all([
    sanityFetch({ query: houseMetaQuery, params: { locale, slug: house }, stega: false }),
    sanityFetch({ query: settingsQuery, params: { locale }, stega: false })
  ])

  if (!data) {
    return undefined
  }

  const { title, description } = data
  const { openGraph, twitter } = getOpenGraphMetadata({
    locale,
    image: assets.openGraph[house].src,
    siteName: settings?.siteName
  })

  return { title, description, openGraph, twitter }
}

export default function HouseLayout({ children, modal, params }: LayoutProps<'/[locale]/[house]'>) {
  const { house } = use(params)

  if (!isHouseIdentifier(house)) {
    notFound()
  }

  return (
    <>
      {children}
      {modal}
    </>
  )
}
