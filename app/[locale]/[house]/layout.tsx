import { routing } from '@/i18n/routing'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { HouseIdentifier, HouseIdentifierSchema } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/live'
import {
  houseQuery,
  houseSlugsQuery,
  settingsQuery
} from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import { hasLocale, Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
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

  return routing.locales.flatMap((locale) =>
    houses.map(({ slug }) => ({ locale, house: slug }))
  )
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/[house]'>, 'children'>
): Promise<Metadata | undefined> {
  const { locale, house } = await props.params

  if (!hasLocale(routing.locales, locale) || !hasHouse(house)) {
    return undefined
  }

  const [{ data }, { data: settings }] = await Promise.all([
    sanityFetch({ query: houseQuery, params: { locale, slug: house } }),
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

export default function HouseLayout({
  children,
  modal,
  params
}: LayoutProps<'/[locale]/[house]'>) {
  const { locale, house } = use(params)

  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  return (
    <>
      {children}
      {modal}
    </>
  )
}
