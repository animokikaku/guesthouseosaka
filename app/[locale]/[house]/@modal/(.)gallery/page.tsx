import { GalleryModalCloseButton } from '@/components/gallery/gallery-modal-close-button'
import { GalleryModalWrapper } from '@/components/gallery/gallery-modal-wrapper'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { getHouseAndLocale } from '@/lib/house-params'
import { sanityFetch } from '@/sanity/lib/live'
import { houseGalleryQuery } from '@/sanity/lib/queries'
import { Suspense } from 'react'

// instant = false: kept on purpose, the whole modal depends on the house, so there is
// no shared App Shell worth prefetching. Links here use `prefetch` to load the
// full static page.
export const instant = false

type GalleryModalPageProps = PageProps<'/[locale]/[house]/gallery'>

export default function GalleryModalPage({ params }: GalleryModalPageProps) {
  // The intercepted route fills the house layout's `children` slot with Next's
  // built-in default, which has no `instant` export and so is validated as
  // instant, pulling this page in despite its opt-out. Reading params behind
  // Suspense satisfies that. The gallery link prefetches the full modal, so the
  // empty fallback only shows when the prefetch hasn't landed.
  return (
    <Suspense fallback={null}>
      <GalleryModal params={params} />
    </Suspense>
  )
}

async function GalleryModal({ params }: Pick<GalleryModalPageProps, 'params'>) {
  const { house, locale } = await getHouseAndLocale(params)

  const { data } = await sanityFetch({
    query: houseGalleryQuery,
    params: { locale, slug: house }
  })

  if (!data) {
    return <PageEmptyStateSection />
  }

  return (
    <GalleryModalWrapper house={house} title={data.title ?? ''}>
      <GalleryPageContent
        documentId={data._id}
        documentType={data._type}
        galleryCategories={data.galleryCategories}
        title={data.title ?? ''}
        backButton={<GalleryModalCloseButton />}
      />
    </GalleryModalWrapper>
  )
}
