import { FAQAccordion } from '@/app/[locale]/faq/(components)/faq-accordion'
import FAQCard from '@/app/[locale]/faq/(components)/faq-card'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

export default function FAQPage({ params }: PageProps<'/[locale]/faq'>) {
  const { locale } = use(params)
  setRequestLocale(locale as Locale)
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-12">
      <FAQAccordion />
      <FAQCard />
    </section>
  )
}
