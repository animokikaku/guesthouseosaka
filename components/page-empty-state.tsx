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
  /** `page` for full-page empty states; `nav` for compact nav dropdowns */
  variant?: 'page' | 'nav'
}

/**
 * Empty state component for pages with missing Sanity content.
 * Displays a helpful message for content managers to add content.
 */
export function PageEmptyState({
  className,
  title,
  description,
  variant = 'page'
}: PageEmptyStateProps) {
  const t = useTranslations('PageEmptyState')

  return (
    <Empty
      className={cn(
        variant === 'page' &&
          'min-h-[300px] rounded-xl border border-dashed border-amber-400/50 bg-amber-50/50 dark:border-amber-600/30 dark:bg-amber-950/20',
        variant === 'nav' && 'gap-3 p-6',
        className
      )}
    >
      <EmptyHeader className={cn(variant === 'nav' && 'gap-1')}>
        <EmptyMedia variant="warning">
          <FileWarningIcon />
        </EmptyMedia>
        <EmptyTitle className={cn(variant === 'nav' && 'text-sm')}>
          {title ?? t('title')}
        </EmptyTitle>
        <EmptyDescription>{description ?? t('description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
