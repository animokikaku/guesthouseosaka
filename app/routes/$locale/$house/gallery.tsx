import { GalleryPageBackLink } from '@/components/gallery/gallery-back-button'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { galleryPhotoOpenGraphImage } from '@/lib/gallery-image'
import { validateGallerySearch } from '@/lib/gallery-search'
import { houseHeadMeta } from '@/lib/house-head'
import { canonicalLink } from '@/lib/metadata'
import { getHouseGallery } from '@/sanity/lib/loaders.functions'
import { createFileRoute } from '@tanstack/react-router'

/** The gallery as its own page, for direct visits; the house page opens it as a modal. */
export const Route = createFileRoute('/$locale/$house/gallery')({
  validateSearch: validateGallerySearch,
  loader: ({ params: { locale, house } }) => getHouseGallery({ data: { locale, house } }),
  head: ({ loaderData, matches, match, params: { locale, house } }) => ({
    meta: houseHeadMeta({
      locale,
      house,
      data: loaderData,
      matches,
      // A shared photo link previews that photo.
      image: galleryPhotoOpenGraphImage(loaderData?.galleryCategories, match.search.photo)
    }),
    links: [canonicalLink({ to: '/$locale/$house/gallery', params: { house } }, locale)]
  }),
  component: GalleryPage
})

function GalleryPage() {
  const { locale, house } = Route.useParams()
  const { photo } = Route.useSearch()
  const data = Route.useLoaderData()
  const navigate = Route.useNavigate()

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
        backButton={<GalleryPageBackLink house={house} />}
        photo={photo}
        onPhotoNavigate={(nextPhoto, { replace, state }) =>
          void navigate({
            to: '/$locale/$house/gallery',
            params: { locale, house },
            search: { photo: nextPhoto },
            replace,
            state,
            resetScroll: false,
            // The lightbox runs its own transitions.
            viewTransition: false
          })
        }
      />
    </GalleryShell>
  )
}
