import { Collection } from '@/components/home/collection'
import { GalleryWall } from '@/components/home/gallery-wall'
import { PageEmptyState } from '@/components/page-empty-state'
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { canonicalLink } from '@/lib/metadata'
import { toGalleryImages } from '@/lib/transforms/gallery'
import { getHomePage } from '@/sanity/lib/loaders.functions'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/')({
  loader: ({ params: { locale } }) => getHomePage({ data: { locale } }),
  head: ({ params: { locale } }) => ({ links: [canonicalLink({ to: '/$locale' }, locale)] }),
  component: HomePage
})

const heroComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <PageHeaderHeading className="md:text-left">{children}</PageHeaderHeading>
    ),
    normal: ({ children }) => (
      <PageHeaderDescription className="md:text-left">{children}</PageHeaderDescription>
    )
  }
}

const collectionComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-primary leading-tighter max-w-none self-start text-start text-2xl font-semibold tracking-tight text-balance xl:text-4xl xl:tracking-tighter">
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

function HomePage() {
  const { locale } = Route.useParams()
  const { page, houses } = Route.useLoaderData()

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
    <div className="footer-snap flex flex-col">
      <section className="container-wrapper relative flex min-h-[calc(100dvh-var(--header-height))] max-w-7xl snap-none items-center justify-center py-8 md:snap-end md:py-0">
        <div className="container flex flex-col items-center gap-12 md:flex-row md:gap-8">
          {/* Text content - expands to fill available space */}
          <PageHeader className="p-0 md:flex-1 md:items-start md:p-0 md:text-left lg:p-0">
            {hero.content && <PortableText value={hero.content} components={heroComponents} />}
            {hero.ctaLabel && (
              <PageActions className="md:justify-start">
                <Link
                  to="/$locale/contact"
                  params={{ locale }}
                  className={buttonVariants({ size: 'lg' })}
                >
                  {hero.ctaLabel}
                </Link>
              </PageActions>
            )}
          </PageHeader>

          {/* Gallery wall - sized to give header more room */}
          <div className="w-full shrink-0 md:w-3/5">
            <GalleryWall images={toGalleryImages(galleryWall)} />
          </div>
        </div>
      </section>
      <section className="container-wrapper relative flex max-w-7xl flex-1 snap-none flex-col items-center justify-center md:min-h-[calc(100dvh-var(--header-height)-var(--footer-height))] md:snap-start">
        <PageHeader>
          {collection.content && (
            <PortableText value={collection.content} components={collectionComponents} />
          )}
          <PageActions>
            <Collection houses={houses} className="w-full pt-4" />
          </PageActions>
        </PageHeader>
      </section>
    </div>
  )
}
