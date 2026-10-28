import { Badge } from '@/components/ui/badge'
import type { RoomCounts } from '@/lib/rooms.server'
import { useTranslations } from 'use-intl'

/** The house's most useful availability fact: rooms free now, else rooms opening soon, else fully booked. */
export function HouseAvailability({
  counts: { available, upcoming },
  className
}: {
  counts: RoomCounts
  className?: string
}) {
  const t = useTranslations('HouseAvailability')

  let label = t('fully_booked')
  if (available > 0) label = t('rooms_available', { count: available })
  else if (upcoming > 0) label = t('rooms_upcoming', { count: upcoming })

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  )
}
