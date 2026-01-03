'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@/components/ui/dialog'
import { Link } from '@/i18n/navigation'
import { HouseIdentifier } from '@/lib/types'
import * as DialogPrimitive from '@radix-ui/react-dialog'
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
    <Dialog open>
      <DialogPortal>
        <DialogOverlay className="bg-background z-30 backdrop-blur-2xl" />
        <DialogPrimitive.Content className="bg-background text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40">
          <DialogTitle className="sr-only">{t('title')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('description', { title })}
          </DialogDescription>
          <div className="flex h-full w-full flex-col overflow-hidden">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

export function GalleryModalCloseButton({ house }: { house: HouseIdentifier }) {
  const t = useTranslations('GalleryModal')

  return (
    <DialogClose asChild>
      <Link href={{ pathname: '/[house]', params: { house } }}>
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
          <ArrowLeftIcon className="size-6" />
          <span className="sr-only">{t('close')}</span>
        </Button>
      </Link>
    </DialogClose>
  )
}
