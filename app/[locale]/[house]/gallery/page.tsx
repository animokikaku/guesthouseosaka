import { HouseGallery } from '@/components/gallery/house-gallery'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { HouseIdentifier } from '@/lib/types'
import { ArrowLeftIcon } from 'lucide-react'
import { Locale, useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

export default function GalleryPage({
  params
}: PageProps<'/[locale]/[house]/gallery'>) {
  const { locale, house } = use(params)
  setRequestLocale(locale as Locale)
  const t = useTranslations('GalleryPage')

  return (
    <div className="bg-background text-foreground fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="shrink-0 p-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href={`/${house}`}>
              <ArrowLeftIcon className="size-6" />
              <span className="sr-only">{t('close')}</span>
            </Link>
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="container-wrapper">
            <div className="container py-8 md:py-12">
              <HouseGallery house={house as HouseIdentifier} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
