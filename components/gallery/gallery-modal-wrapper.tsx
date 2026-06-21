'use client'

import {
  GalleryDialog,
  GalleryDialogContent,
  GalleryDialogDescription,
  GalleryDialogTitle
} from '@/components/gallery/gallery-dialog'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { useRouter } from '@/i18n/navigation'
import type { HouseIdentifier } from '@/lib/types'
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

  return (
    <GalleryDialog
      open={isOpen}
      onOpenChange={(open) => !open && setIsOpen(false)}
      onOpenChangeComplete={(open) =>
        !open && router.push({ pathname: '/[house]', params: { house } })
      }
    >
      <GalleryDialogContent
        overlayClassName="bg-background backdrop-blur-2xl"
        className="bg-background text-foreground fixed inset-0 z-60 flex h-full max-w-none translate-none flex-col gap-0 rounded-none p-0 ring-0"
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
