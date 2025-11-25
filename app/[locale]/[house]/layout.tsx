import { routing } from '@/i18n/routing'
import { HouseIdentifier, HouseIdentifierSchema } from '@/lib/types'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getExtracted } from 'next-intl/server'
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
): Promise<Metadata> {
  const { locale, house } = await props.params
  const t = await getExtracted({ locale: locale as Locale })

  switch (house as HouseIdentifier) {
    case 'orange':
      return {
        title: t('Orange House'),
        description: t('Relaxed spacious Japanese-style lounge')
      }
    case 'apple':
      return {
        title: t('Apple House'),
        description: t('Share house 8 minutes walk from Namba Station')
      }
    case 'lemon':
      return {
        title: t('Lemon House'),
        description: t('Well-equipped private rooms and a luxurious lounge')
      }
  }
}

export default async function HouseLayout({
  children,
  modal,
  params
}: LayoutProps<'/[locale]/[house]'>) {
  // Ensure that the incoming `house` is valid
  const { house } = await params
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
