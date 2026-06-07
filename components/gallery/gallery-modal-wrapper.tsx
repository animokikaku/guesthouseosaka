'use client'

import { GalleryShell } from '@/components/gallery/gallery-shell'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
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
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        motion="fade"
        showHeaderCloseButton={false}
        overlayClassName="bg-background z-60 backdrop-blur-2xl"
        className="bg-background text-foreground fixed inset-0 z-60 flex h-full max-w-none translate-none flex-col gap-0 rounded-none p-0 ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        <DialogDescription className="sr-only">{t('description', { title })}</DialogDescription>
        <GalleryShell>{children}</GalleryShell>
      </DialogContent>
    </Dialog>
  )
}

export function GalleryModalCloseButton() {
  const t = useTranslations('GalleryModal')

  return (
    <DialogClose render={<Button variant="ghost" size="icon" className="shrink-0 rounded-full" />}>
      <ArrowLeftIcon className="size-6" />
      <span className="sr-only">{t('close')}</span>
    </DialogClose>
  )
}
