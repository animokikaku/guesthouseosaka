import { ContactForm } from '@/components/forms'
import { sanityFetch } from '@/sanity/lib/live'
import { contactTypeQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function ContactPage({
  params
}: PageProps<'/[locale]/contact/other'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: contactTypeQuery,
    params: { locale, type: 'general' }
  })

  return <ContactForm content={data?.content} />
}
