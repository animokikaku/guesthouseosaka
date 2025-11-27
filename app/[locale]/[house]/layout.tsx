import { routing } from '@/i18n/routing'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { getLocalBusinessJsonLd, serializeJsonLd } from '@/lib/structured-data'
import { HouseIdentifier, HouseIdentifierSchema } from '@/lib/types'
import type { Metadata } from 'next'
import { hasLocale, type Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
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
  const { openGraph: images } = assets
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'houses'
  })

  const { title, description, image } = {
    orange: {
      title: t('orange.name'),
      description: t('orange.summary'),
      image: images.orange.src
    },
    apple: {
      title: t('apple.name'),
      description: t('apple.summary'),
      image: images.apple.src
    },
    lemon: {
      title: t('lemon.name'),
      description: t('lemon.summary'),
      image: images.lemon.src
    }
  }[house as HouseIdentifier]

  const { openGraph, twitter } = await getOpenGraphMetadata({
    locale: locale as Locale,
    image
  })

  return { title, description, openGraph, twitter }
}

export default async function HouseLayout({
  children,
  modal,
  params
}: LayoutProps<'/[locale]/[house]'>) {
  // Ensure that the incoming `house` is valid
  const { house, locale } = await params
  if (!hasLocale(routing.locales, locale) || !hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  const houseJsonLd = getLocalBusinessJsonLd({
    house,
    locale,
    name: t(`houses.${house}.name`),
    telephone: t(`faq.contact.phones.${house}.international`),
    description: t(`houses.${house}.about.description`)
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(houseJsonLd) }}
      />
      {children}
      {modal}
    </>
  )
}
