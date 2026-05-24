import { DynamicPageActions } from '@/components/dynamic-page-actions'
import { PageContentShell } from '@/components/page-content-shell'
import { PageHeader } from '@/components/page-header'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { pageHeaderComponents } from '@/lib/portable-text/page-header-components'
import { sanityFetch } from '@/sanity/lib/live'
import { contactPageMetaQuery, contactPageQuery, settingsQuery } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/contact'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const [t, { data: contactPageMeta }, { data: settings }] = await Promise.all([
    getTranslations({ locale: locale as Locale, namespace: 'Metadata' }),
    sanityFetch({ query: contactPageMetaQuery, params: { locale } }),
    sanityFetch({ query: settingsQuery, params: { locale } })
  ])

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale: locale as Locale,
    image: assets.openGraph.contact.src,
    siteName: settings?.siteName
  })

  return {
    title: contactPageMeta?.metaTitle ?? t('contact_title'),
    description: contactPageMeta?.metaDescription ?? undefined,
    openGraph,
    twitter
  }
}

export default async function ContactLayout({
  params,
  children
}: LayoutProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: contactPageQuery,
    params: { locale }
  })

  const page = data?.page

  return (
    <>
      <PageHeader>
        {page?.header && <PortableText value={page.header} components={pageHeaderComponents} />}
        {page?.actions && page.actions.length > 0 && (
          <DynamicPageActions
            documentId={page._id}
            documentType={page._type}
            actions={page.actions}
          />
        )}
      </PageHeader>
      <PageContentShell>{children}</PageContentShell>
    </>
  )
}
