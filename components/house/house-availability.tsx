import { Badge } from '@/components/ui/badge'
import { Marker, MarkerContent, MarkerIcon, markerVariants } from '@/components/ui/marker'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { AvailabilitySummary, ListedRoom } from '@/lib/availability'
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
 * none are), opening them in a modal: a table on wide screens and two-line rows on phones.
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

  const statusBadge = (room: ListedRoom) =>
    room.status === 'available' ? (
      <Badge className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
        <span aria-hidden="true">{t('now')}</span>
        <span className="sr-only">{t('now_label')}</span>
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-muted-foreground tabular-nums">
        <span aria-hidden="true">{formatDate(room.availableFrom ?? today)}</span>
        <span className="sr-only">
          {t('from_label', { date: formatDate(room.availableFrom ?? today) })}
        </span>
      </Badge>
    )

  // Plain text in the table, an outlined tag in the phone layout
  const tag = 'rounded-4xl border px-2 py-0.5 text-xs md:border-0 md:p-0 md:text-sm'
  // The phone layout spaces cells with the row's grid gap instead
  const cell = 'p-0 md:table-cell md:p-2'

  return (
    <ResponsiveModal
      title={t('heading')}
      description={t('last_updated', {
        date: formatter.dateTime(tokyoMidnight(document._updatedAt.slice(0, 10)), {
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
      <Table>
        <TableHeader className="sr-only md:not-sr-only">
          <TableRow>
            {(['room', 'type', 'size', 'rent'] as const).map((column) => (
              <TableHead
                key={column}
                scope="col"
                className={cn(
                  column === 'room' && 'md:w-[38%]',
                  column === 'type' && 'md:w-[22%]',
                  column === 'rent' && 'text-right'
                )}
              >
                {t(`column_${column}`)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="block md:table-row-group">
          {summary.rooms.map((room) => (
            <TableRow
              key={room._key}
              data-sanity={dataAttribute(`rooms[_key=="${room._key}"]`)}
              className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-x-1.5 gap-y-2 py-3 md:table-row md:p-0"
            >
              <TableCell className={cn('col-span-3 col-start-1 row-start-1', cell)}>
                <span className="flex items-center gap-2 font-medium tabular-nums md:font-normal">
                  {/* The column header names the room on wide screens */}
                  <span className="md:hidden">
                    {t('room_number', { number: room.number ?? '' })}
                  </span>
                  <span className="hidden md:inline">{room.number}</span>
                  {statusBadge(room)}
                </span>
              </TableCell>
              <TableCell className={cn('col-start-1 row-start-2', cell)}>
                <span className={cn(tag, 'text-muted-foreground md:text-foreground')}>
                  {room.style ? t(`style_${room.style}`) : null}
                </span>
              </TableCell>
              <TableCell className={cn('col-start-2 row-start-2', cell)}>
                <span className={cn(tag, 'text-muted-foreground md:text-foreground tabular-nums')}>
                  {room.size ? t('size', { size: room.size }) : null}
                </span>
              </TableCell>
              <TableCell className={cn('col-start-4 row-start-1 text-right tabular-nums', cell)}>
                {room.rent ? formatter.number(room.rent, 'currency') : null}
                <span className="text-muted-foreground text-xs">{t('per_month')}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ResponsiveModal>
  )
}
