import { getHouseAndLocale } from '@/app/[locale]/[house]/layout'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { PageEmptyState } from '@/components/page-empty-state'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery } from '@/sanity/lib/queries'
import { ArrowLeftIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function GalleryPage({ params }: PageProps<'/[locale]/[house]/gallery'>) {
  const { house, locale } = await getHouseAndLocale(params)

  const houseDataPromise = sanityFetch({ query: houseQuery, params: { locale, slug: house } })
  const t = await getTranslations('GalleryPage')
  const { data } = await houseDataPromise

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
