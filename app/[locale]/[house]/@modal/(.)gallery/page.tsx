'use client'

import { HouseGallery } from '@/components/gallery/house-gallery'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { HouseIdentifier } from '@/lib/types'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { use } from 'react'

export default function GalleryModal({
  params
}: PageProps<'/[locale]/[house]/gallery'>) {
  const { house } = use(params)
  const router = useRouter()
  const t = useTranslations()

  const { title } = {
    orange: { title: t('houses.orange.name') },
    apple: { title: t('houses.apple.name') },
    lemon: { title: t('houses.lemon.name') }
  }[house as HouseIdentifier]

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Navigate back to the house page when closing
      router.back()
    }
  }

  return (
    <Dialog.Root open onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-background fixed inset-0 z-30 backdrop-blur-2xl" />
        <Dialog.Content className="bg-background text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 shadow-none">
          <Dialog.Title className="sr-only">
            {t('gallery.modalTitle')}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {t('gallery.explorePhotos', { title })}
          </Dialog.Description>
          <div className="flex h-full w-full flex-col overflow-hidden">
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="m-4 rounded-full">
                <ArrowLeftIcon className="size-6" />
                <span className="sr-only">{t('gallery.close')}</span>
              </Button>
            </Dialog.Close>
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div className="container-wrapper">
                <div className="container py-8 md:py-12">
                  <HouseGallery house={house as HouseIdentifier} />
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
