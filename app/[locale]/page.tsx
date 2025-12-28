import { Collection } from '@/components/collection'
import { GalleryWall } from '@/components/gallery-wall'
import { PageActions, PageHeader } from '@/components/page-header'
import { PageEmptyState } from '@/components/page-empty-state'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
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
      <h2 className="text-primary leading-tighter max-w-none self-start text-2xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-4xl xl:tracking-tighter">
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

  // Check for actual content, not just existence of the document
  const hasContent = data?.houses && data.houses.length > 0

  if (!data || !hasContent) {
    return (
      <div className="container-wrapper section-soft flex-1 pb-12">
        <div className="mx-auto w-full max-w-2xl">
          <PageEmptyState />
        </div>
      </div>
    )
  }

  const { _id, _type, hero, collection, galleryWall, houses } = data

  return (
    <div className="snap-footer section-soft flex flex-col gap-18 md:gap-0">
      <section className="relative flex snap-none items-center justify-center py-8 md:min-h-[calc(100dvh-var(--header-height))] md:snap-end md:py-0">
        <div className="container-wrapper w-full max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-3">
            {/* Text content */}
            <PageHeader className="md:items-start md:text-left">
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

            {/* Instagram feed */}
            <div className="flex justify-center md:col-span-2 md:justify-end">
              <div className="w-full">
                <GalleryWall images={galleryWall} />
              </div>
            </div>
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
            <Collection
              _id={_id}
              _type={_type}
              houses={houses}
              className="w-full pt-4"
            />
          </PageActions>
        </PageHeader>
      </section>
    </div>
  )
}
