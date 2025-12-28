import { DynamicPageActions } from '@/components/dynamic-page-actions'
import { PageHeader } from '@/components/page-header'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { sanityFetch } from '@/sanity/lib/live'
import { contactPageQuery, settingsQuery } from '@/sanity/lib/queries'
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
  const [{ data: contactPage }, { data: settings }] = await Promise.all([
    sanityFetch({ query: contactPageQuery, params: { locale } }),
    sanityFetch({ query: settingsQuery, params: { locale } })
  ])

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale: locale as Locale,
    image: assets.openGraph.contact.src,
    siteName: settings?.siteName
  })

  return {
    title: contactPage?.metaTitle ?? 'Contact',
    description: contactPage?.metaDescription ?? undefined,
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

  const { data: contactPage } = await sanityFetch({
    query: contactPageQuery,
    params: { locale }
  })

  // Show centered content without header when no data
  if (!contactPage) {
    return (
      <div className="container-wrapper flex flex-1 items-center justify-center py-12">
        <div className="mx-auto w-full max-w-2xl">{children}</div>
      </div>
    )
  }

  return (
    <>
      <PageHeader>
        {contactPage.header && (
          <PortableText
            value={contactPage.header}
            components={headerComponents}
          />
        )}
        {contactPage.actions && contactPage.actions.length > 0 && (
          <DynamicPageActions
            page={{
              _id: contactPage._id,
              _type: contactPage._type,
              actions: contactPage.actions
            }}
          />
        )}
      </PageHeader>
      <div className="container-wrapper section-soft flex-1 md:pb-12">
        <div className="sm:container">
          <div className="mx-auto w-full max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}
