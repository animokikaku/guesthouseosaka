import {
  GalleryDialog,
  GalleryDialogContent,
  GalleryDialogDescription,
  GalleryDialogTitle
} from '@/components/gallery/gallery-dialog'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { useNavigate } from '@tanstack/react-router'
import type { HouseIdentifier } from '@/lib/types'
import { type ReactNode, useState } from 'react'
import { useLocale, useTranslations } from 'use-intl'

type GalleryModalWrapperProps = {
  house: HouseIdentifier
  title: string
  children: ReactNode
}

export function GalleryModalWrapper({ house, title, children }: GalleryModalWrapperProps) {
  const navigate = useNavigate()
  const locale = useLocale()
  const t = useTranslations('GalleryModal')
  // Closes with the exit animation, then leaves the route.
  const [isOpen, setIsOpen] = useState(true)

  return (
    <GalleryDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setIsOpen(false)
      }}
      onOpenChangeComplete={(open) =>
        !open &&
        void navigate({
          to: '/$locale/$house',
          params: { locale, house },
          resetScroll: false,
          // The dialog has already animated out.
          viewTransition: false
        })
      }
    >
      <GalleryDialogContent
        overlayClassName="bg-background backdrop-blur-2xl"
        className="flex flex-col"
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
