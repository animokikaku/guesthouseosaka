import { routing } from '@/i18n/routing'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import {
  HouseIdentifier,
  HouseIdentifierSchema,
  HouseIdentifierValues
} from '@/lib/types'
import { houseQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import type { Metadata } from 'next'
import { hasLocale, Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    HouseIdentifierValues.map((house) => ({ locale, house }))
  )
}

export function hasHouse(house: string): house is HouseIdentifier {
  return HouseIdentifierSchema.safeParse(house).success
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/[house]'>, 'children'>
): Promise<Metadata | undefined> {
  const { locale, house } = await props.params

  if (!hasLocale(routing.locales, locale) || !hasHouse(house)) {
    return undefined
  }

  const { data } = await sanityFetch({
    query: houseQuery,
    params: { locale, slug: house }
  })

  if (!data) {
    return undefined
  }

  const title = data.title
  const description = data.description
  const image = assets.openGraph[house].src
  const { openGraph, twitter } = await getOpenGraphMetadata({ locale, image })

  return { title, description, openGraph, twitter }
}

export default async function HouseLayout({
  children,
  modal,
  params
}: LayoutProps<'/[locale]/[house]'>) {
  const { locale, house } = await params

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
