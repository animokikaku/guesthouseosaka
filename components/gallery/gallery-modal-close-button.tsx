'use client'

import { GalleryDialogClose } from '@/components/gallery/gallery-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function GalleryModalCloseButton({ className }: { className?: string }) {
  const t = useTranslations('GalleryModal')

  return (
    <GalleryDialogClose
      render={
        <Button variant="ghost" size="icon" className={cn('shrink-0 rounded-full', className)} />
      }
    >
      <ArrowLeftIcon className="size-6" />
      <span className="sr-only">{t('close')}</span>
    </GalleryDialogClose>
  )
}
