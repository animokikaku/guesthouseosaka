import {
  HouseAvailabilityBanner,
  type AvailabilityBannerView,
  type RoomView
} from '@/components/house/house-availability-banner'
import { Link } from '@/i18n/navigation'
import {
  groupByDate,
  groupByFloor,
  groupByMoveIn,
  summarizeAvailability,
  type AvailabilityRoom,
  type RoomStatus
} from '@/lib/availability'
import { useFormatter, useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'
import type { ReactNode } from 'react'

interface HouseAvailabilityProps {
  document: { _id: string; _type: string; _updatedAt: string }
  /** Visual-editing markers already removed from dates and enum values */
  rooms: AvailabilityRoom[] | null | undefined
  /** Today in Osaka (YYYY-MM-DD) */
  today: string
}

/** A Sanity `date` read as midnight in Osaka, so formatting in Tokyo time keeps the same day. */
const tokyoMidnight = (date: string) => new Date(`${date}T00:00:00+09:00`)

const contactLink = (chunks: ReactNode) => (
  <Link href="/contact" className="text-foreground underline underline-offset-4">
    {chunks}
  </Link>
)

/** How many opening dates the banner shows before folding the rest into "+N". */
const SHOWN_DATES = 3

/**
 * The availability card under the gallery. Every label and date is prepared here, on
 * the server in Tokyo time, so the client part only handles opening, tabs and selection.
 */
export function HouseAvailability({ document, rooms, today }: HouseAvailabilityProps) {
  const t = useTranslations('HouseAvailability')
  const formatter = useFormatter()

  const summary = summarizeAvailability(rooms, today)
  const totalRooms = summary.rooms.length + summary.occupiedCount
  if (totalRooms === 0) return null

  // Nothing free or announced: a plain notice, with nothing to open
  if (summary.rooms.length === 0) {
    return (
      <div
        id="availability"
        className="bg-card border-border flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border px-4 py-3.5 md:px-5"
      >
        <span
          aria-hidden="true"
          className="bg-muted-foreground/50 size-2.5 shrink-0 rounded-full"
        />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{t('fully_booked')}</span>
          <span className="text-muted-foreground block text-sm">
            {t('full_detail', { count: totalRooms })}
          </span>
        </span>
        <span className="text-muted-foreground w-full pl-5.5 text-sm md:w-auto md:pl-0">
          {t.rich('full_contact', { link: contactLink })}
        </span>
      </div>
    )
  }

  const formatDate = (date: string) =>
    formatter.dateTime(tokyoMidnight(date), {
      month: 'short',
      day: 'numeric',
      ...(date.slice(0, 4) !== today.slice(0, 4) && { year: 'numeric' })
    })
  const rent = (value: number | null) => (value ? formatter.number(value, 'currency') : null)
  const dataAttribute = createDataAttribute({ id: document._id, type: document._type })
  const floorLabel = (floor: string) => t('floor', { floor })

  const statusLabel = (status: RoomStatus, availableFrom: string | null) =>
    status === 'available'
      ? t('now')
      : status === 'upcoming' && availableFrom
        ? formatDate(availableFrom)
        : t('occupied')

  const toView = (room: AvailabilityRoom & { status: RoomStatus }): RoomView => {
    const number = room.number ?? ''
    return {
      key: room._key,
      number,
      title: t('room_number', { number }),
      status: room.status,
      statusLabel: statusLabel(room.status, room.availableFrom),
      style: room.style ? t(`style_${room.style}`) : null,
      size: room.size ? t('size', { size: room.size }) : null,
      floor: floorLabel(number.length > 2 ? number.slice(0, -2) : number),
      rent: rent(room.rent),
      dataSanity: dataAttribute(`rooms[_key=="${room._key}"]`)
    }
  }

  const available = summary.availableCount > 0
  const headlineRooms = available
    ? summary.rooms.filter((room) => room.status === 'available')
    : summary.rooms
  const minRent = rent(
    Math.min(...headlineRooms.map((room) => room.rent ?? Infinity).filter(Number.isFinite))
  )
  const upcoming = summary.rooms.filter((room) => room.status === 'upcoming')
  const openingDates = [...new Set(upcoming.map((room) => room.availableFrom))]
  // When nothing is free, the headline already names the first date
  const listedDates = available ? openingDates : openingDates.slice(1)
  const nextDate = openingDates[0] ? formatDate(openingDates[0]) : null
  const fromRent = minRent ? t('from_rent', { rent: minRent }) : null

  const view: AvailabilityBannerView = {
    status: available ? 'available' : 'upcoming',
    headline: available
      ? t('rooms_available', { count: summary.availableCount })
      : t('next_opens', { date: nextDate ?? '' }),
    summary: available
      ? (fromRent ?? '')
      : [t('rooms_upcoming', { count: summary.upcomingCount }), fromRent]
          .filter(Boolean)
          .join(' · '),
    summaryShort: available
      ? [
          minRent && t('from_rent_short', { rent: minRent }),
          nextDate && t('next_short', { date: nextDate })
        ]
          .filter(Boolean)
          .join(' · ')
      : [
          t('rooms_upcoming', { count: summary.upcomingCount }),
          minRent && t('from_rent_short', { rent: minRent })
        ]
          .filter(Boolean)
          .join(' · '),
    datesLabel: available ? t('next_openings') : t('then'),
    dates: listedDates.slice(0, SHOWN_DATES).map(formatDate),
    moreDates:
      listedDates.length > SHOWN_DATES
        ? t('more', { count: listedDates.length - SHOWN_DATES })
        : null,
    // From the full timestamp: an edit before 9am in Osaka is still that day there
    updated: t('last_updated', {
      date: formatter.dateTime(new Date(document._updatedAt), { dateStyle: 'long' })
    }),
    columns: groupByMoveIn(summary.rooms, today).map((group) => ({
      key: group.key,
      label:
        group.kind === 'now'
          ? t('now')
          : group.kind === 'later'
            ? t('later')
            : formatter.dateTime(tokyoMidnight(`${group.key}-01`), {
                month: 'long',
                ...(group.key.slice(0, 4) !== today.slice(0, 4) && { year: 'numeric' })
              }),
      count: t('room_count', { count: group.rooms.length }),
      isNow: group.kind === 'now',
      rooms: group.rooms.map(toView)
    })),
    timeline: groupByDate(summary.rooms).map((group) => ({
      key: group.key,
      label: group.key === 'now' ? t('now') : formatDate(group.key),
      count: t('room_count', { count: group.rooms.length }),
      isNow: group.key === 'now',
      rooms: group.rooms.map(toView)
    })),
    floors: groupByFloor(rooms, today).map((floor) => ({
      key: floor.floor,
      label: floorLabel(floor.floor),
      rooms: floor.rooms.map(toView)
    })),
    defaultRoom: summary.rooms[0]?._key ?? null,
    labels: {
      toggle: t('toggle'),
      byDate: t('by_date'),
      byFloor: t('by_floor'),
      available: t('legend_available'),
      upcoming: t('legend_upcoming'),
      occupied: t('occupied'),
      perMonth: t('per_month')
    }
  }

  return <HouseAvailabilityBanner view={view} />
}
