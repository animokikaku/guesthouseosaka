import { routing } from '@/i18n/routing'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { staticParamsForLocales } from '@/lib/static-params'
import { HouseIdentifier, HouseIdentifierSchema } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/live'
import { houseMetaQuery, houseSlugsQuery, settingsQuery } from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { use } from 'react'

export function hasHouse(house: string): house is HouseIdentifier {
  return HouseIdentifierSchema.safeParse(house).success
}

export async function generateStaticParams() {
  const { data: houses } = await sanityFetch({
    query: houseSlugsQuery,
    perspective: 'published',
    stega: false
  })

  if (houses.length === 0) {
    return []
  }

  return staticParamsForLocales(routing.locales, houses, 'house')
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/[house]'>, 'children'>
): Promise<Metadata | undefined> {
  const [{ house }, locale] = await Promise.all([props.params, getLocale()])

  if (!hasHouse(house)) {
    return undefined
  }

  const [{ data }, { data: settings }] = await Promise.all([
    sanityFetch({ query: houseMetaQuery, params: { locale, slug: house } }),
    sanityFetch({ query: settingsQuery, params: { locale } })
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

  if (!hasHouse(house)) {
    notFound()
  }

  return (
    <>
      {children}
      {modal}
    </>
  )
}
