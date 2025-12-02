import { routing } from '@/i18n/routing'
import { assets } from '@/lib/assets'
import { getHouseLabel } from '@/lib/house-labels'
import { ImagesProvider } from '@/lib/images'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { HouseIdentifier, HouseIdentifierSchema } from '@/lib/types'
import type { Metadata } from 'next'
import { hasLocale, Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  const houses = HouseIdentifierSchema.options
  return routing.locales.flatMap((locale) =>
    houses.map((house) => ({ locale, house }))
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

  const houseLabel = await getHouseLabel(locale as Locale)
  const { name: title, summary: description } = houseLabel(house)
  const image = assets.openGraph[house].src
  const { openGraph, twitter } = await getOpenGraphMetadata({ locale, image })

  return { title, description, openGraph, twitter }
}

export default async function HouseLayout({
  children,
  modal,
  params
}: LayoutProps<'/[locale]/[house]'>) {
  // Ensure that the incoming `house` is valid
  const { locale, house } = await params

  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  return (
    // ImagesProvider enables useImages() for client components
    <ImagesProvider house={house}>
      {children}
      {modal}
    </ImagesProvider>
  )
}
