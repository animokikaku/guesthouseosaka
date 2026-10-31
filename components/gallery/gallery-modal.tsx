import { GalleryShell } from '@/components/gallery/gallery-shell'
import type { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useNavigate } from '@tanstack/react-router'
import { type ReactNode, useState } from 'react'
import { useLocale, useTranslations } from 'use-intl'

const fadeClass =
  'fixed inset-0 z-60 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0'

type GalleryModalProps = {
  house: HouseIdentifier
  title: string
  children: ReactNode
}

/** The gallery as a full-screen dialog over the house page; closing it returns there. */
export function GalleryModal({ house, title, children }: GalleryModalProps) {
  const navigate = useNavigate()
  const locale = useLocale()
  const t = useTranslations('GalleryModal')
  // Closes with the exit animation, then leaves the route.
  const [isOpen, setIsOpen] = useState(true)

  return (
    <DialogPrimitive.Root
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
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className={cn(fadeClass, 'bg-background backdrop-blur-2xl')} />
        <DialogPrimitive.Popup
          className={cn(fadeClass, 'bg-background text-foreground flex flex-col outline-none')}
        >
          <DialogPrimitive.Title className="sr-only">{t('title')}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {t('description', { title })}
          </DialogPrimitive.Description>
          <GalleryShell>{children}</GalleryShell>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
