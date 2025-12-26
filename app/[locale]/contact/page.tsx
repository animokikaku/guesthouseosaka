import type { Locale } from 'next-intl'

import { ContactTypesList } from '@/app/[locale]/contact/(components)/contact-types-list'
import { sanityFetch } from '@/sanity/lib/live'
import { contactPageQuery } from '@/sanity/lib/queries'
import { setRequestLocale } from 'next-intl/server'

export default async function ContactPage({
  params
}: PageProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: contactPageQuery,
    params: { locale }
  })

  if (!data) {
    return null
  }

  return (
    <ContactTypesList
      _id={data._id}
      _type={data._type}
      contactTypes={data.contactTypes}
    />
  )
}
