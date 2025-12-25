'use client'

import { Button } from '@/components/ui/button'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { useRouter } from '@/i18n/navigation'
import { HouseIdentifier } from '@/lib/types'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { ReactNode } from 'react'

type GalleryModalWrapperProps = {
  children: ReactNode
}

export function GalleryModalWrapper({ children }: GalleryModalWrapperProps) {
  const router = useRouter()
  const { house } = useParams()

  const t = useTranslations('GalleryModal')
  const houseLabel = useHouseLabels()
  const { name: title } = houseLabel(house as HouseIdentifier)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog.Root open onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-background fixed inset-0 z-30 backdrop-blur-2xl" />
        <Dialog.Content className="bg-background text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 shadow-none">
          <Dialog.Title className="sr-only">{t('title')}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t('description', { title })}
          </Dialog.Description>
          <div className="flex h-full w-full flex-col overflow-hidden">
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="m-4 rounded-full">
                <ArrowLeftIcon className="size-6" />
                <span className="sr-only">{t('close')}</span>
              </Button>
            </Dialog.Close>
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div className="container-wrapper">
                <div className="container py-8 md:py-12">{children}</div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
