import { HouseSectionContent, HouseSectionHeading } from '@/components/house/house-section'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/i18n/navigation'
import type { AvailabilitySummary, ListedRoom } from '@/lib/availability'
import { cn } from '@/lib/utils'
import { useFormatter, useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'
import type { ReactNode } from 'react'

interface HouseAvailabilityProps {
  document: { _id: string; _type: string; _updatedAt: string } | null
  summary: AvailabilitySummary
  /** Today in Osaka (YYYY-MM-DD), decides whether a year is worth showing. */
  today: string
}

const contactLink = (chunks: ReactNode) => (
  <Link href="/contact" className="text-foreground underline underline-offset-4">
    {chunks}
  </Link>
)

/** A Sanity `date` read as midnight in Osaka, so formatting in Tokyo time keeps the same day. */
const tokyoMidnight = (date: string) => new Date(`${date}T00:00:00+09:00`)

/**
 * The rooms free now or opening soon, as a table on wide screens and two-line rows on
 * phones. Occupied rooms are left out: the status is the point of this list.
 */
export function HouseAvailability({ document, summary, today }: HouseAvailabilityProps) {
  const t = useTranslations('HouseAvailability')
  const formatter = useFormatter()

  const totalRooms = summary.rooms.length + summary.occupiedCount
  if (!document || totalRooms === 0) return null

  const dataAttribute = createDataAttribute({ id: document._id, type: document._type })
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

  return (
    <section id="availability" aria-labelledby="availability-title" className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <HouseSectionHeading id="availability-title" className="mb-0">
          {t('heading')}
        </HouseSectionHeading>
        <p className="text-muted-foreground text-xs">
          {t('updated', { date: formatDate(document._updatedAt.slice(0, 10)) })}
        </p>
      </div>
      <HouseSectionContent>
        <div className="border-border overflow-hidden rounded-lg border">
          {summary.rooms.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="sr-only md:not-sr-only">
                <tr className="bg-muted/50 border-border/50 border-b">
                  {(['room', 'type', 'size', 'rent'] as const).map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className={cn(
                        'text-muted-foreground px-6 py-3 text-left text-[11px] font-medium tracking-wide uppercase',
                        column === 'room' && 'md:w-[38%]',
                        column === 'type' && 'md:w-[22%]',
                        column === 'rent' && 'text-right'
                      )}
                    >
                      {t(`column_${column}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {summary.rooms.map((room) => (
                  <tr
                    key={room._key}
                    data-sanity={dataAttribute(`rooms[_key=="${room._key}"]`)}
                    className="border-border/50 grid grid-cols-[auto_auto_1fr_auto] items-center gap-x-1.5 gap-y-2 border-b px-4 py-3 last:border-b-0 md:table-row md:p-0"
                  >
                    <td className="col-span-3 col-start-1 row-start-1 md:table-cell md:px-6 md:py-3">
                      <span className="flex items-center gap-2 font-medium tabular-nums md:font-normal">
                        {/* The column header names the room on wide screens */}
                        <span className="md:hidden">
                          {t('room_number', { number: room.number ?? '' })}
                        </span>
                        <span className="hidden md:inline">{room.number}</span>
                        {statusBadge(room)}
                      </span>
                    </td>
                    <td className="col-start-1 row-start-2 md:table-cell md:px-6 md:py-3">
                      <span className={cn(tag, 'text-muted-foreground md:text-foreground')}>
                        {room.style ? t(`style_${room.style}`) : null}
                      </span>
                    </td>
                    <td className="col-start-2 row-start-2 md:table-cell md:px-6 md:py-3">
                      <span
                        className={cn(tag, 'text-muted-foreground md:text-foreground tabular-nums')}
                      >
                        {room.size ? t('size', { size: room.size }) : null}
                      </span>
                    </td>
                    <td className="col-start-4 row-start-1 text-right tabular-nums md:table-cell md:px-6 md:py-3">
                      {room.rent ? formatter.number(room.rent, 'currency') : null}
                      <span className="text-muted-foreground text-xs">{t('per_month')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground px-6 py-4 text-sm">
              {t.rich('empty', { link: contactLink })}
            </p>
          )}
        </div>
      </HouseSectionContent>
    </section>
  )
}
