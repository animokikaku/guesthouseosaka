import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { buttonVariants } from '@/components/ui/button'
import { canonicalLink } from '@/lib/metadata'
import { getHouseGallery } from '@/sanity/lib/loaders.functions'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslations } from 'use-intl'

/** The gallery as its own page, for direct visits; the house page opens it as a modal. */
export const Route = createFileRoute('/$locale/$house/gallery')({
  loader: ({ params: { locale, house } }) => getHouseGallery({ data: { locale, house } }),
  head: ({ params: { locale, house } }) => ({
    links: [canonicalLink({ pathname: '/[house]/gallery', params: { house } }, locale)]
  }),
  component: GalleryPage
})

function GalleryPage() {
  const params = Route.useParams()
  const data = Route.useLoaderData()
  const t = useTranslations('GalleryPage')

  if (!data) {
    return <PageEmptyStateSection />
  }

  return (
    <GalleryShell className="fixed inset-0 z-60">
      <GalleryPageContent
        documentId={data._id}
        documentType={data._type}
        galleryCategories={data.galleryCategories}
        title={data.title ?? ''}
        backButton={
          <Link
            to="/$locale/$house"
            params={params}
            className={buttonVariants({
              variant: 'ghost',
              size: 'icon',
              className: 'shrink-0 rounded-full'
            })}
          >
            <ArrowLeftIcon aria-hidden="true" className="size-6" />
            <span className="sr-only">{t('close')}</span>
          </Link>
        }
      />
    </GalleryShell>
  )
}
