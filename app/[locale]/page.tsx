import { Collection } from '@/components/collection'
import { GalleryWall } from '@/components/gallery-wall'
import { PageEmptyState } from '@/components/page-empty-state'
import { PageActions, PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { toGalleryImages } from '@/lib/transforms/gallery'
import { sanityFetch } from '@/sanity/lib/live'
import { homePageQuery } from '@/sanity/lib/queries'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

const heroComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-left lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
        {children}
      </h1>
    ),
    normal: ({ children }) => (
      <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg md:text-left">
        {children}
      </p>
    )
  }
}

const collectionComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-primary leading-tighter max-w-none self-start text-start text-2xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-4xl xl:tracking-tighter">
        {children}
      </h2>
    ),
    normal: ({ children }) => (
      <p className="text-foreground max-w-none self-start text-start text-base text-wrap sm:text-lg">
        {children}
      </p>
    )
  }
}

export default async function LocalePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  // Enable static rendering
  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: homePageQuery,
    params: { locale }
  })

  const { page, houses } = data ?? {}

  // Check for actual content, not just existence of the document
  const hasContent = houses && houses.length > 0

  if (!page || !hasContent) {
    return (
      <div className="container-wrapper flex flex-1 items-center justify-center py-12">
        <div className="mx-auto w-full max-w-2xl">
          <PageEmptyState />
        </div>
      </div>
    )
  }

  const { hero, collection, galleryWall } = page

  return (
    <div className="snap-footer section-soft flex flex-col">
      <section className="container-wrapper relative flex h-[calc(100dvh-var(--header-height))] max-w-7xl snap-none items-center justify-center md:h-auto md:min-h-[calc(100dvh-var(--header-height))] md:snap-end py-8 md:py-0">
        <div className="container flex flex-col items-center gap-12 md:gap-8 md:flex-row md:items-center">
          {/* Text content - expands to fill available space */}
          <PageHeader className="md:flex-1 md:items-start p-0 md:p-0 lg:p-0 md:text-left">
            {hero.content && (
              <PortableText
                value={hero.content}
                components={heroComponents}
              />
            )}
            {hero.ctaLabel && (
              <PageActions className="md:justify-start">
                <Button asChild size="lg">
                  <Link href="/contact">{hero.ctaLabel}</Link>
                </Button>
              </PageActions>
            )}
          </PageHeader>

          {/* Gallery wall - sized to give header more room */}
          <div className="w-full shrink-0 md:w-3/5">
            <GalleryWall images={toGalleryImages(galleryWall)} />
          </div>
        </div>
      </section>
      <section className="snap:none container-wrapper relative flex max-w-7xl flex-1 flex-col items-center justify-center md:min-h-[calc(100dvh-var(--header-height)-var(--footer-height))] md:snap-start">
        <PageHeader>
          {collection.content && (
            <PortableText
              value={collection.content}
              components={collectionComponents}
            />
          )}
          <PageActions>
            <Collection houses={houses} className="w-full pt-4" />
          </PageActions>
        </PageHeader>
      </section>
    </div>
  )
}
