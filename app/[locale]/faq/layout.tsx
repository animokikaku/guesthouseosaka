import { DynamicPageActions } from '@/components/dynamic-page-actions'
import { PageContentShell } from '@/components/page-content-shell'
import { PageHeader } from '@/components/page-header'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { pageHeaderComponents } from '@/lib/portable-text/page-header-components'
import { sanityFetch } from '@/sanity/lib/live'
import { faqPageQuery, settingsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/faq'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const [t, { data: faqPage }, { data: settings }] = await Promise.all([
    getTranslations({ locale: locale as Locale, namespace: 'Metadata' }),
    sanityFetch({ query: faqPageQuery, params: { locale } }),
    sanityFetch({ query: settingsQuery, params: { locale } })
  ])

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale: locale as Locale,
    image: assets.openGraph.faq.src,
    siteName: settings?.siteName
  })

  return {
    title: faqPage?.metaTitle ?? t('faq_title'),
    description: faqPage?.metaDescription ?? undefined,
    openGraph,
    twitter
  }
}

export default async function FAQLayout({ params, children }: LayoutProps<'/[locale]/faq'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: faqPageQuery,
    params: { locale }
  })

  return (
    <>
      <PageHeader>
        {data?.header && <PortableText value={data?.header} components={pageHeaderComponents} />}
        {data?.actions && data?.actions.length > 0 && (
          <DynamicPageActions
            documentId={data._id}
            documentType={data._type}
            actions={data.actions}
          />
        )}
      </PageHeader>
      <PageContentShell>{children}</PageContentShell>
    </>
  )
}
