import { hasHouse } from '@/app/[locale]/[house]/layout'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { PageEmptyState } from '@/components/page-empty-state'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { getHouse } from '@/sanity/lib/cached-queries'
import { ArrowLeftIcon } from 'lucide-react'
import { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function GalleryPage({ params }: PageProps<'/[locale]/[house]/gallery'>) {
  const { locale, house } = await params
  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  const [t, { data }] = await Promise.all([
    getTranslations('GalleryPage'),
    getHouse(locale, house)
  ])

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
          <Button
            variant="ghost"
            size="icon"
            render={<Link href={{ pathname: '/[house]', params: { house } }} />}
            nativeButton={false}
            className="shrink-0 rounded-full"
          >
            <ArrowLeftIcon className="size-6" />
            <span className="sr-only">{t('close')}</span>
          </Button>
        }
      />
    </GalleryShell>
  )
}
