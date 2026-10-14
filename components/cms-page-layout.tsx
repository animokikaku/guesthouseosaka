import { DynamicPageActions } from '@/components/dynamic-page-actions'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { sanityFetch } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { ComponentProps, ReactNode } from 'react'

const headerComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <PageHeaderHeading>{children}</PageHeaderHeading>,
    normal: ({ children }) => <PageHeaderDescription>{children}</PageHeaderDescription>
  }
}

type CmsPage = {
  _id: string
  _type: string
  header: ComponentProps<typeof PortableText>['value'] | null
  actions: ComponentProps<typeof DynamicPageActions>['actions']
}

/**
 * Layout for the CMS-driven FAQ and contact sections: the page's Sanity header
 * and actions above a narrow content column.
 */
export function CmsPageLayout({ page, children }: { page: CmsPage | null; children: ReactNode }) {
  return (
    <>
      <PageHeader>
        {page?.header && <PortableText value={page.header} components={headerComponents} />}
        {page?.actions && page.actions.length > 0 && (
          <DynamicPageActions
            documentId={page._id}
            documentType={page._type}
            actions={page.actions}
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

type CmsPageMeta = { metaTitle: string | null; metaDescription: string | null } | null

/** Title, description and social cards for a {@link CmsPageLayout} section. */
export async function getCmsPageMetadata({
  locale,
  meta,
  image,
  fallbackTitle
}: {
  locale: Locale
  /** The page's own meta fields, fetched with `stega: false`. */
  meta: Promise<CmsPageMeta>
  image: string
  fallbackTitle: 'contact_title' | 'faq_title'
}): Promise<Metadata> {
  const [page, { data: settings }, t] = await Promise.all([
    meta,
    sanityFetch({ query: settingsQuery, params: { locale }, stega: false }),
    getTranslations('Metadata')
  ])

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale,
    image,
    siteName: settings?.siteName
  })

  return {
    title: page?.metaTitle ?? t(fallbackTitle),
    description: page?.metaDescription ?? undefined,
    openGraph,
    twitter
  }
}
