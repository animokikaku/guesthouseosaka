import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Marker, MarkerContent, MarkerIcon, markerVariants } from '@/components/ui/marker'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { groupByDate, type AvailabilitySummary, type ListedRoom } from '@/lib/availability'
import { cn } from '@/lib/utils'
import { CalendarClockIcon, DoorClosedIcon, DoorOpenIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'

interface HouseAvailabilityProps {
  document: { _id: string; _type: string; _updatedAt: string } | null
  summary: AvailabilitySummary
  /** Today in Osaka (YYYY-MM-DD), decides whether a year is worth showing. */
  today: string
}

/** A Sanity `date` read as midnight in Osaka, so formatting in Tokyo time keeps the same day. */
const tokyoMidnight = (date: string) => new Date(`${date}T00:00:00+09:00`)

/**
 * A marker in the About section counting the rooms free now (or opening soon when
 * none are), opening them in a modal as a timeline: rooms free now, then one row per opening date.
 * Occupied rooms are left out, since the status is the point of this list, so a full
 * house gets a plain "Fully booked" marker: there is nothing to list.
 */
export function HouseAvailability({ document, summary, today }: HouseAvailabilityProps) {
  const t = useTranslations('HouseAvailability')
  const formatter = useFormatter()

  const totalRooms = summary.rooms.length + summary.occupiedCount
  if (!document || totalRooms === 0) return null

  if (summary.rooms.length === 0) {
    return (
      <Marker className="w-fit">
        <MarkerIcon>
          <DoorClosedIcon />
        </MarkerIcon>
        <MarkerContent>{t('fully_booked')}</MarkerContent>
      </Marker>
    )
  }

  const dataAttribute = createDataAttribute({
    id: document._id,
    type: document._type
  })
  const formatDate = (date: string) =>
    formatter.dateTime(tokyoMidnight(date), {
      month: 'short',
      day: 'numeric',
      ...(date.slice(0, 4) !== today.slice(0, 4) && { year: 'numeric' })
    })

  const roomCard = (room: ListedRoom) => {
    const now = room.status === 'available'
    return (
      <Item
        key={room._key}
        variant="outline"
        size="xs"
        data-sanity={dataAttribute(`rooms[_key=="${room._key}"]`)}
        // Rooms follow availability dates, not the array order, so dragging one means nothing
        data-sanity-drag-disable="true"
        className={cn(
          'bg-background flex-nowrap',
          now && 'border-emerald-500/45 bg-emerald-500/[0.07]'
        )}
      >
        <ItemContent className="min-w-0 gap-0.5">
          <ItemTitle className="font-semibold">
            {t('room_number', { number: room.number ?? '' })}
          </ItemTitle>
          <ItemDescription className="line-clamp-1 text-xs">
            {[room.style && t(`style_${room.style}`), room.size && t('size', { size: room.size })]
              .filter(Boolean)
              .join(' · ')}
          </ItemDescription>
        </ItemContent>
        {room.rent ? (
          <ItemActions className="text-sm tabular-nums">
            <span>
              {formatter.number(room.rent, 'currency')}
              <span className="text-muted-foreground text-xs">{t('per_month')}</span>
            </span>
          </ItemActions>
        ) : null}
      </Item>
    )
  }

  return (
    <ResponsiveModal
      title={t('heading')}
      description={t('last_updated', {
        date: formatter.dateTime(new Date(document._updatedAt), {
          dateStyle: 'long'
        })
      })}
      trigger={
        // A button styled as a marker, underlined like the marker's own links
        <button
          type="button"
          className={cn(
            markerVariants({ variant: 'default' }),
            'hover:text-foreground w-fit cursor-pointer'
          )}
        >
          <MarkerIcon>
            {summary.availableCount > 0 ? <DoorOpenIcon /> : <CalendarClockIcon />}
          </MarkerIcon>
          <MarkerContent className="underline underline-offset-3">
            {summary.availableCount > 0
              ? t('rooms_available', { count: summary.availableCount })
              : t('rooms_upcoming', { count: summary.upcomingCount })}
          </MarkerContent>
        </button>
      }
    >
      <ol className="grid">
        {groupByDate(summary.rooms).map((group) => {
          const now = group.key === 'now'
          return (
            <li key={group.key} className="grid grid-cols-[3.5rem_1rem_minmax(0,1fr)] gap-2">
              <span
                className={cn(
                  'pt-2.5 text-right text-xs tabular-nums',
                  now
                    ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground'
                )}
              >
                {now ? t('now') : formatDate(group.key)}
              </span>
              <span
                aria-hidden="true"
                className="before:bg-border relative flex justify-center before:absolute before:inset-y-0 before:w-px"
              >
                <span
                  className={cn(
                    'relative mt-3.5 size-2 rounded-full border-[1.5px]',
                    now
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-muted-foreground bg-background'
                  )}
                />
              </span>
              <span className="grid gap-1.5 pt-1 pb-2.5">{group.rooms.map(roomCard)}</span>
            </li>
          )
        })}
      </ol>
    </ResponsiveModal>
  )
}
