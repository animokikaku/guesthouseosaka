import { DynamicPageActions } from '@/components/dynamic-page-actions'
import { PageHeader } from '@/components/page-header'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { sanityFetch } from '@/sanity/lib/live'
import { faqPageQuery, settingsQuery } from '@/sanity/lib/queries'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

const headerComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
        {children}
      </h1>
    ),
    normal: ({ children }) => (
      <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">{children}</p>
    )
  }
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/faq'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const [{ data: faqPage }, { data: settings }] = await Promise.all([
    sanityFetch({ query: faqPageQuery, params: { locale } }),
    sanityFetch({ query: settingsQuery, params: { locale } })
  ])

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale: locale as Locale,
    image: assets.openGraph.faq.src,
    siteName: settings?.siteName
  })

  return {
    title: faqPage?.metaTitle ?? 'FAQ',
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
        {data?.header && <PortableText value={data?.header} components={headerComponents} />}
        {data?.actions && data?.actions.length > 0 && (
          <DynamicPageActions
            documentId={data._id}
            documentType={data._type}
            actions={data.actions}
          />
        )}
      </PageHeader>
      <div className="container-wrapper section-soft flex-1 md:pb-12">
        <div className="container">
          <div className="mx-auto w-full max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}
