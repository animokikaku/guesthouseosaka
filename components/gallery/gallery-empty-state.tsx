import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { cn } from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

/** Shown in place of the house page's gallery when it has too few images. */
export function GalleryEmptyState({ className }: { className?: string }) {
  const t = useTranslations('GalleryEmptyState')

  return (
    <Empty className={cn('border border-dashed', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ImageIcon />
        </EmptyMedia>
        <EmptyTitle>{t('title')}</EmptyTitle>
        <EmptyDescription>{t('description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
