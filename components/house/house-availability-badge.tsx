import { Link } from '@/i18n/navigation'
import type { AvailabilitySummary } from '@/lib/availability'
import type { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface HouseAvailabilityBadgeProps extends Pick<
  AvailabilitySummary,
  'availableCount' | 'upcomingCount'
> {
  slug: HouseIdentifier
  className?: string
}

/**
 * Overlaid on the top-right of the gallery, linking to the availability section. Shows
 * the rooms free now, or the upcoming ones when none are free; hidden when the house
 * is full, since the section says so already.
 */
export function HouseAvailabilityBadge({
  slug,
  availableCount,
  upcomingCount,
  className
}: HouseAvailabilityBadgeProps) {
  const t = useTranslations('HouseAvailability')

  if (availableCount === 0 && upcomingCount === 0) return null

  return (
    <Link
      href={{ pathname: '/[house]', params: { house: slug }, hash: '#availability' }}
      className={cn(
        'absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          availableCount > 0 ? 'bg-emerald-400' : 'border border-white/80'
        )}
      />
      {availableCount > 0
        ? t('badge_available', { count: availableCount })
        : t('badge_upcoming', { count: upcomingCount })}
    </Link>
  )
}
