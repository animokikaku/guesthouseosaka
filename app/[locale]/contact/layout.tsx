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
import { getLocale, getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const contactPageMetaPromise = sanityFetch({ query: contactPageMetaQuery, params: { locale } })
  const settingsPromise = sanityFetch({ query: settingsQuery, params: { locale } })
  const t = await getTranslations('Metadata')
  const [{ data: contactPageMeta }, { data: settings }] = await Promise.all([
    contactPageMetaPromise,
    settingsPromise
  ])

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale,
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

export default async function ContactLayout({ children }: LayoutProps<'/[locale]/contact'>) {
  const locale = await getLocale()

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
