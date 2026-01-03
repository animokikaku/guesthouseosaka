'use client'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { HouseIdentifier } from '@/lib/types'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

type GalleryModalWrapperProps = {
  title: string
  children: ReactNode
}

export function GalleryModalWrapper({
  title,
  children
}: GalleryModalWrapperProps) {
  const t = useTranslations('GalleryModal')

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-background fixed inset-0 z-30 backdrop-blur-2xl" />
        <Dialog.Content className="bg-background text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40 max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 shadow-none">
          <Dialog.Title className="sr-only">{t('title')}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t('description', { title })}
          </Dialog.Description>
          <div className="flex h-full w-full flex-col overflow-hidden">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function GalleryModalCloseButton({ house }: { house: HouseIdentifier }) {
  const t = useTranslations('GalleryModal')

  return (
    <Dialog.Close asChild>
      <Link href={{ pathname: '/[house]', params: { house } }}>
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
          <ArrowLeftIcon className="size-6" />
          <span className="sr-only">{t('close')}</span>
        </Button>
      </Link>
    </Dialog.Close>
  )
}
