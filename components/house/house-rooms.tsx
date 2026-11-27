import { HouseSectionContent, HouseSectionHeading } from '@/components/house/house-section'
import { formatRoomDate } from '@/components/house/room-date'
import { useRoomPrice } from '@/components/house/room-price'
import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { hasRooms, roomKey, type ListedRoom, type RoomAvailability } from '@/lib/rooms'
import type { HouseIdentifier } from '@/lib/types'
import { Link } from '@tanstack/react-router'
import { CalendarClockIcon, CalendarIcon, CircleCheckIcon, DoorClosedIcon } from 'lucide-react'
import { useFormatter, useLocale, useTranslations } from 'use-intl'

/**
 * The house's "Upcoming Vacancies" section (see docs/rooms.md): its free and
 * upcoming rooms, those free now first, then the rest by date, each a link to
 * ask to move into it. A fully booked house says so instead, with a way to
 * ask about the rooms to come: the general inquiry form, with the house chosen. The badge links to `#availability`.
 */
export function HouseRooms({
  house,
  rooms,
  note,
  pricesFrom = false,
  'data-sanity': dataSanity
}: {
  house: HouseIdentifier
  rooms: RoomAvailability
  /** What the prices include: the house's note, in the page's language or English. */
  note?: string | null
  /** Whether the prices are starting prices, as the house's depend on the contract. */
  pricesFrom?: boolean
  'data-sanity'?: string
}) {
  const t = useTranslations('HouseRooms')
  const locale = useLocale()

  return (
    <section
      id="availability"
      aria-labelledby="availability-title"
      data-sanity={dataSanity}
      className="scroll-mt-24"
    >
      <HouseSectionHeading id="availability-title">{t('heading')}</HouseSectionHeading>
      {hasRooms(rooms) ? (
        <HouseSectionContent>
          {/* The note is required in the Studio; until one is published, the rooms follow the title. */}
          {note && <p className={TEXT_CLASS}>{note}</p>}
          {/*
           * As many across as fit, the rest below: every room shows, however many
           * there are. The narrowest an item gets still fits the longest name and
           * starting price on one line (French's "Chambre 208 dès 58 000 JPY").
           */}
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
            {rooms.available.map((room) => (
              <RoomItem
                key={room.roomNumber}
                house={house}
                room={room}
                pricesFrom={pricesFrom}
                free
                today={rooms.today}
              />
            ))}
            {rooms.upcoming.map((room) => (
              <RoomItem
                key={room.roomNumber}
                house={house}
                room={room}
                pricesFrom={pricesFrom}
                today={rooms.today}
              />
            ))}
          </ul>
        </HouseSectionContent>
      ) : (
        <Empty className="border border-dashed p-8 sm:p-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DoorClosedIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{t('fully_booked')}</EmptyTitle>
            <EmptyDescription>{t('fully_booked_description')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              to="/$locale/contact/$slug"
              params={{ locale, slug: 'other' }}
              search={{ house }}
              hash="tabs"
              className={buttonVariants({ variant: 'outline' })}
            >
              {t('contact')}
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </section>
  )
}

// The section's text, as the location section writes its own under its title.
const TEXT_CLASS = 'text-foreground text-base leading-relaxed'

/**
 * A room, as a link to the move-in form with its house and itself chosen: its
 * name, then what it costs a month, and when it's free under them, on a line
 * of its own so a long answer has the item's width. Outlined, every item as
 * tall as its row.
 */
function RoomItem({
  house,
  room,
  pricesFrom,
  free = false,
  today
}: {
  house: HouseIdentifier
  room: ListedRoom
  pricesFrom: boolean
  /** Free now, rather than from `availableFrom` (null: from a date to come). */
  free?: boolean
  today: string
}) {
  const t = useTranslations('HouseRooms')
  const roomPrice = useRoomPrice()
  const locale = useLocale()

  return (
    <li>
      <Item
        variant="outline"
        size="sm"
        className="h-full"
        render={
          <Link
            to="/$locale/contact/$slug"
            params={{ locale, slug: 'move-in' }}
            search={{ room: roomKey(house, room.roomNumber) }}
            hash="tabs"
          />
        }
      >
        <ItemContent>
          <ItemTitle className="whitespace-nowrap">
            {t('room', { number: room.roomNumber })}
            {room.price !== null && (
              // Right after the name and quieter than it, so an item is no wider than its words.
              <span
                data-slot="room-price"
                className="text-muted-foreground font-normal tabular-nums"
              >
                {roomPrice(room.price, pricesFrom)}
              </span>
            )}
          </ItemTitle>
          <ItemDescription>
            <RoomDate free={free} date={room.availableFrom} today={today} />
          </ItemDescription>
        </ItemContent>
      </Item>
    </li>
  )
}

/**
 * When a room is free, after an icon saying which kind of answer it is: a
 * check and "Available now", a calendar and the date (in Japan, with the year
 * only when it isn't this one), or a calendar with a clock and "Date TBC" for
 * a date to come. A room free now is the one in color and full ink; the others
 * keep to the description's gray. Screen readers get a date as a sentence.
 */
function RoomDate({ free, date, today }: { free: boolean; date: string | null; today: string }) {
  const t = useTranslations('HouseRooms')
  const formatter = useFormatter()
  // On one line, the icon keeping its size beside it.
  const row = 'inline-flex items-center gap-1.5 whitespace-nowrap [&>svg]:size-3.5 [&>svg]:shrink-0'

  if (free) {
    return (
      <span className={`${row} text-foreground`}>
        <CircleCheckIcon className="text-primary" aria-hidden="true" />
        {t('now')}
      </span>
    )
  }
  if (date === null) {
    return (
      <span className={row}>
        <CalendarClockIcon aria-hidden="true" />
        {t('date_unknown')}
      </span>
    )
  }

  const formatted = formatRoomDate(formatter, date, today)
  return (
    <time dateTime={date} className={row}>
      <CalendarIcon aria-hidden="true" />
      <span aria-hidden="true">{formatted}</span>
      <span className="sr-only">{t('available_from', { date: formatted })}</span>
    </time>
  )
}
