import { assets } from '@/lib/assets'
import { urls } from '@/lib/config'
import { env } from '@/lib/env'
import { HouseIdentifier } from '@/lib/types'
import { Locale } from 'next-intl'
import {
  FAQPage,
  LocalBusiness,
  Organization,
  PostalAddress,
  WithContext
} from 'schema-dts'

const houseAddresses: Record<HouseIdentifier, PostalAddress> = {
  orange: {
    '@type': 'PostalAddress',
    streetAddress: '1-chome-21-19 Hannancho, Abeno Ward',
    addressLocality: 'Osaka',
    postalCode: '545-0021',
    addressCountry: 'JP'
  },
  apple: {
    '@type': 'PostalAddress',
    streetAddress: '2-chome-8-4 Shikitsunishi, Naniwa Ward',
    addressLocality: 'Osaka',
    postalCode: '556-0015',
    addressCountry: 'JP'
  },
  lemon: {
    '@type': 'PostalAddress',
    streetAddress: '1-chome-2-2 Nipponbashihigashi, Naniwa Ward',
    addressLocality: 'Osaka',
    postalCode: '556-0006',
    addressCountry: 'JP'
  }
}

const createAbsoluteUrl = (path: string) =>
  new URL(path, env.NEXT_PUBLIC_APP_URL).toString()

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function getOrganizationJsonLd({
  name,
  telephone,
  alternateName,
  email,
  contactName
}: {
  name: string
  alternateName: string
  telephone: string
  email: string
  contactName: string
}): WithContext<Organization> {
  const url = env.NEXT_PUBLIC_APP_URL
  const logo = createAbsoluteUrl('/android-chrome-512x512.png')
  const sameAs = Object.values(urls.socials)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name,
    image: assets.openGraph.home.src,
    alternateName,
    address: houseAddresses.orange,
    sameAs,
    url,
    contactPoint: {
      '@type': 'ContactPoint',
      email,
      telephone,
      name: contactName
    },
    logo
  } satisfies WithContext<Organization>
}

export function getContactLocalBusinessJsonLd({
  locale,
  name,
  telephone,
  description,
  email
}: {
  locale: Locale
  name: string
  telephone: string
  description: string
  email: string
}): WithContext<LocalBusiness> {
  const url = createAbsoluteUrl(`/${locale}/contact`)

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#contact`,
    name,
    description,
    url,
    image: assets.openGraph.contact.src,
    telephone,
    email,
    address: houseAddresses.orange
  } satisfies WithContext<LocalBusiness>
}

export type FaqItem = {
  question: string
  answer: string
}

export function getFAQPageJsonLd({
  locale,
  items
}: {
  locale: Locale
  items: FaqItem[]
}): WithContext<FAQPage> {
  const url = createAbsoluteUrl(`/${locale}/faq`)

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  } satisfies WithContext<FAQPage>
}
