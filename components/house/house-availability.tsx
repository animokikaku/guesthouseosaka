import { Badge } from '@/components/ui/badge'
import type { RoomAvailability } from '@/lib/rooms.server'
import type { HouseIdentifier } from '@/lib/types'
import { Link } from '@tanstack/react-router'
import { useLocale, useTranslations } from 'use-intl'

/**
 * The house's most useful availability fact: rooms free now, else rooms
 * opening soon, else fully booked. Links to the timeline (`#availability`)
 * unless fully booked.
 */
export function HouseAvailability({
  house,
  rooms: { available, upcoming },
  className
}: {
  house: HouseIdentifier
  rooms: RoomAvailability
  className?: string
}) {
  const t = useTranslations('HouseAvailability')
  const locale = useLocale()

  // A fully booked house has no timeline to link to.
  if (available.length === 0 && upcoming.length === 0) {
    return (
      <Badge variant="secondary" className={className}>
        {t('fully_booked')}
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={className}
      render={<Link to="/$locale/$house" params={{ locale, house }} hash="availability" />}
    >
      {available.length > 0
        ? t('rooms_available', { count: available.length })
        : t('rooms_upcoming', { count: upcoming.length })}
    </Badge>
  )
}
