import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { cn } from '@/lib/utils'
import { FileWarningIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function NavEmptyState({ className }: { className?: string }) {
  const t = useTranslations('PageEmptyState')

  return (
    <Empty className={cn('gap-3 p-6', className)}>
      <EmptyHeader className="gap-1">
        <EmptyMedia variant="warning">
          <FileWarningIcon />
        </EmptyMedia>
        <EmptyTitle className="text-sm">{t('title')}</EmptyTitle>
        <EmptyDescription>{t('description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
