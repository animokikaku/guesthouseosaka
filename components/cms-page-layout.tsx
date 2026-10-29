import { DynamicPageActions } from '@/components/dynamic-page-actions'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { getLocaleHeadData, getMetadataTranslator } from '@/lib/locale-head'
import { openGraphMeta, pageMeta } from '@/lib/metadata'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { stegaClean } from '@sanity/client/stega'
import type { Locale } from 'use-intl'
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
      <div className="container-wrapper flex-1 md:pb-12">
        <div className="sm:container">
          <div className="mx-auto w-full max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}

type CmsPageMeta = { metaTitle: string | null; metaDescription: string | null } | null

/** Title, description and social cards for a {@link CmsPageLayout} section's `head()`. */
export function cmsPageHead({
  locale,
  meta,
  image,
  fallbackTitle,
  matches
}: {
  locale: Locale
  /** The page's own meta fields. */
  meta: CmsPageMeta | undefined
  image: string
  fallbackTitle: 'contact_title' | 'faq_title'
  matches: ReadonlyArray<{ routeId: string }>
}) {
  const { siteName, messages } = getLocaleHeadData(matches)
  const page = stegaClean(meta)
  const title =
    page?.metaTitle ?? (messages && getMetadataTranslator(locale, messages)(fallbackTitle))

  return [
    ...openGraphMeta({ locale, image, siteName }),
    ...pageMeta({ title, description: page?.metaDescription, siteName })
  ]
}
