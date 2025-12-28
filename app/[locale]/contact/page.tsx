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

  const { _id, _type, contactTypes } = data

  return (
    <ContactTypesList _id={_id} _type={_type} contactTypes={contactTypes} />
  )
}
