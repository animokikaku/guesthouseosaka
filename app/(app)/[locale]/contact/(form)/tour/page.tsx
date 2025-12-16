import { TourForm } from '@/components/forms'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

export default function ContactPage({
  params
}: PageProps<'/[locale]/contact/tour'>) {
  const { locale } = use(params)
  setRequestLocale(locale as Locale)

  return <TourForm />
}
