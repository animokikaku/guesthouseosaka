import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { cn } from '@/lib/utils'
import { FileWarningIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type PageEmptyStateProps = {
  className?: string
  /** Override the default title */
  title?: string
  /** Override the default description */
  description?: string
}

/**
 * Empty state component for pages with missing Sanity content.
 * Displays a helpful message for content managers to add content.
 */
export function PageEmptyState({ className, title, description }: PageEmptyStateProps) {
  const t = useTranslations('PageEmptyState')

  return (
    <Empty
      className={cn(
        'min-h-[300px] rounded-xl border border-dashed border-amber-400/50 bg-amber-50/50 dark:border-amber-600/30 dark:bg-amber-950/20',
        className
      )}
    >
      <EmptyHeader>
        <EmptyMedia variant="warning">
          <FileWarningIcon />
        </EmptyMedia>
        <EmptyTitle>{title ?? t('title')}</EmptyTitle>
        <EmptyDescription>{description ?? t('description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
