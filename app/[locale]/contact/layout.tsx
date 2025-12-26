import { DynamicPageActions } from '@/components/dynamic-page-actions'
import { PageActions, PageHeader } from '@/components/page-header'
import { LegalNoticeProvider } from '@/hooks/use-legal-notice'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { sanityFetch } from '@/sanity/lib/live'
import {
  contactPageQuery,
  legalNoticeQuery,
  settingsQuery
} from '@/sanity/lib/queries'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

const headerComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
        {children}
      </h1>
    ),
    normal: ({ children }) => (
      <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
        {children}
      </p>
    )
  }
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/contact'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const [t, { data: settings }] = await Promise.all([
    getTranslations({
      locale: locale as Locale,
      namespace: 'ContactLayout.meta'
    }),
    sanityFetch({ query: settingsQuery, params: { locale } })
  ])

  const title = t('title')
  const description = t('description')

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale: locale as Locale,
    image: assets.openGraph.contact.src,
    siteName: settings?.siteName
  })

  return { title, description, openGraph, twitter }
}

export default async function ContactLayout({
  params,
  children
}: LayoutProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const [{ data: contactPage }, { data: legalNotice }] = await Promise.all([
    sanityFetch({
      query: contactPageQuery,
      params: { locale }
    }),
    sanityFetch({
      query: legalNoticeQuery,
      params: { locale }
    })
  ])

  return (
    <LegalNoticeProvider data={legalNotice}>
      <PageHeader>
        {contactPage?.header && (
          <PortableText
            value={contactPage.header}
            components={headerComponents}
          />
        )}
        {contactPage?.actions && contactPage.actions.length > 0 && (
          <PageActions>
            <DynamicPageActions actions={contactPage.actions} />
          </PageActions>
        )}
      </PageHeader>
      <div className="container-wrapper section-soft flex-1 md:pb-12">
        <div className="sm:container">
          <div className="mx-auto w-full max-w-2xl">{children}</div>
        </div>
      </div>
    </LegalNoticeProvider>
  )
}
