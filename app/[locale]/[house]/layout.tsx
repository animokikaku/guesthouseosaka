import { routing } from '@/i18n/routing'
import { HouseIdentifier, HouseIdentifierSchema } from '@/lib/types'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
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
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'houses'
  })

  switch (house as HouseIdentifier) {
    case 'orange':
      return {
        title: t('orange.name'),
        description: t('orange.summary')
      }
    case 'apple':
      return {
        title: t('apple.name'),
        description: t('apple.summary')
      }
    case 'lemon':
      return {
        title: t('lemon.name'),
        description: t('lemon.summary')
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
