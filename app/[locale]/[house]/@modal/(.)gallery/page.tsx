import { hasHouse } from '@/app/[locale]/[house]/layout'
import { GalleryModalCloseButton } from '@/components/gallery/gallery-modal-close-button'
import { GalleryModalWrapper } from '@/components/gallery/gallery-modal-wrapper'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { PageEmptyState } from '@/components/page-empty-state'
import { getHouse } from '@/sanity/lib/cached-queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function GalleryModalPage({ params }: PageProps<'/[locale]/[house]/gallery'>) {
  const { locale, house } = await params
  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  const { data } = await getHouse(locale, house)

  if (!data) {
    return (
      <div className="container-wrapper section-soft flex-1 pb-12">
        <div className="mx-auto w-full max-w-2xl">
          <PageEmptyState />
        </div>
      </div>
    )
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
