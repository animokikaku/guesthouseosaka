import { Badge } from '@/components/ui/badge'
import type { RoomAvailability } from '@/lib/rooms.server'
import type { HouseIdentifier } from '@/lib/types'
import { Link } from '@tanstack/react-router'
import { useLocale, useTranslations } from 'use-intl'

/**
 * The house's most useful availability fact: rooms free now, else rooms
 * opening soon, else fully booked. Links to the timeline (`#availability`)
 * unless the house is fully booked, which has none.
 */
export function HouseAvailability({
  house,
  rooms: { available, upcoming },
  className,
  'data-sanity': dataSanity
}: {
  house: HouseIdentifier
  rooms: RoomAvailability
  className?: string
  'data-sanity'?: string
}) {
  const t = useTranslations('HouseAvailability')
  const locale = useLocale()

  let label = t('fully_booked')
  if (available.length > 0) label = t('rooms_available', { count: available.length })
  else if (upcoming.length > 0) label = t('rooms_upcoming', { count: upcoming.length })

  const hasTimeline = available.length + upcoming.length > 0

  return (
    <Badge
      variant="secondary"
      className={className}
      data-sanity={dataSanity}
      render={
        hasTimeline ? (
          <Link to="/$locale/$house" params={{ locale, house }} hash="availability" />
        ) : undefined
      }
    >
      {label}
    </Badge>
  )
}
