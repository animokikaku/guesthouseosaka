import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { getHouseAndLocale } from '@/lib/house-params'
import { sanityFetch } from '@/sanity/lib/live'
import { houseGalleryQuery } from '@/sanity/lib/queries'
import { ArrowLeftIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function GalleryPage({ params }: PageProps<'/[locale]/[house]/gallery'>) {
  const { house, locale } = await getHouseAndLocale(params)

  const houseDataPromise = sanityFetch({
    query: houseGalleryQuery,
    params: { locale, slug: house }
  })
  const t = await getTranslations('GalleryPage')
  const { data } = await houseDataPromise

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
            href={{ pathname: '/[house]', params: { house } }}
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
