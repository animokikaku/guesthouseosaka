'use client'

import {
  GalleryDialog,
  GalleryDialogClose,
  GalleryDialogContent,
  GalleryDialogDescription,
  GalleryDialogTitle
} from '@/components/gallery/gallery-dialog'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import type { HouseIdentifier } from '@/lib/types'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ReactNode, useState } from 'react'

type GalleryModalWrapperProps = {
  house: HouseIdentifier
  title: string
  children: ReactNode
}

export function GalleryModalWrapper({ house, title, children }: GalleryModalWrapperProps) {
  const router = useRouter()
  const t = useTranslations('GalleryModal')
  const [isOpen, setIsOpen] = useState(true)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false)
    }
  }

  const handleOpenChangeComplete = (open: boolean) => {
    if (!open) {
      router.push({ pathname: '/[house]', params: { house } })
    }
  }

  return (
    <GalleryDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <GalleryDialogContent
        overlayClassName="bg-background backdrop-blur-2xl"
        className="bg-background text-foreground fixed inset-0 z-60 flex h-full max-w-none translate-none flex-col gap-0 rounded-none p-0 ring-0 sm:max-w-none"
      >
        <GalleryDialogTitle className="sr-only">{t('title')}</GalleryDialogTitle>
        <GalleryDialogDescription className="sr-only">
          {t('description', { title })}
        </GalleryDialogDescription>
        <GalleryShell>{children}</GalleryShell>
      </GalleryDialogContent>
    </GalleryDialog>
  )
}

export function GalleryModalCloseButton() {
  const t = useTranslations('GalleryModal')

  return (
    <GalleryDialogClose
      render={<Button variant="ghost" size="icon" className="shrink-0 rounded-full" />}
    >
      <ArrowLeftIcon className="size-6" />
      <span className="sr-only">{t('close')}</span>
    </GalleryDialogClose>
  )
}
