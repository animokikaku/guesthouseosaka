import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '@/components/reui/timeline'
import type { ListedRoom, RoomAvailability } from '@/lib/rooms.server'
import { useFormatter, useTranslations } from 'use-intl'

/**
 * When the house's free and upcoming rooms (see docs/rooms.md) are available,
 * as a timeline under its description: rooms free now, then the rest by date.
 * Nothing when it's fully booked. The badge links to `#availability`.
 */
export function HouseRooms({ rooms }: { rooms: RoomAvailability }) {
  const t = useTranslations('HouseRooms')

  if (rooms.available.length + rooms.upcoming.length === 0) return null

  return (
    <section id="availability" aria-label={t('heading')} className="scroll-mt-24 pt-4">
      {/*
       * When its steps don't fit, it scrolls sideways with no scrollbar: an edge
       * with more steps past it fades out (Base UI sets how far each edge is from
       * the content's).
       */}
      <ScrollArea className="[&_[data-slot=scroll-area-viewport]]:[mask-image:linear-gradient(to_right,transparent,#000_min(4rem,var(--scroll-area-overflow-x-start,0px)),#000_calc(100%_-_min(4rem,var(--scroll-area-overflow-x-end,0px))),transparent)]">
        <RoomTimeline rooms={rooms} />
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </section>
  )
}

/** A timeline step: the rooms free from the same day. */
interface Step {
  /** `now`, a date (`YYYY-MM-DD`), or null when the listing gives none. */
  date: string | null
  rooms: ListedRoom[]
}

/**
 * Rooms free now, then upcoming ones soonest first (`getRoomAvailability`
 * sorts them, undated last), one step per day.
 */
function toSteps({ available, upcoming }: RoomAvailability): Step[] {
  const steps: Step[] = available.length > 0 ? [{ date: 'now', rooms: available }] : []
  for (const room of upcoming) {
    const last = steps.at(-1)
    if (last?.date === room.availableFrom) last.rooms.push(room)
    else steps.push({ date: room.availableFrom, rooms: [room] })
  }
  return steps
}

/** The "now" step, when there is one, is the timeline's reached step. */
function RoomTimeline({ rooms }: { rooms: RoomAvailability }) {
  const steps = toSteps(rooms)

  return (
    <Timeline value={rooms.available.length > 0 ? 1 : 0} orientation="horizontal" render={<ol />}>
      {steps.map((step, index) => (
        <TimelineItem
          key={step.date ?? 'unknown'}
          step={index + 1}
          render={<li />}
          // As wide as its rooms, so a long room name and rent ("Chambre 106 · 41 000 JPY")
          // keeps the step's gap before the next one, and the last badge's border shows.
          className="min-w-max last:pe-1"
        >
          <TimelineHeader>
            <RoomDate date={step.date} today={rooms.today} />
          </TimelineHeader>
          <TimelineIndicator />
          <TimelineSeparator />
          <TimelineContent render={<ul />} className="space-y-2">
            {step.rooms.map((room) => (
              <li key={room.roomNumber} className="flex items-center gap-2 whitespace-nowrap">
                <RoomTitle room={room} />
                <RoomRent room={room} />
              </li>
            ))}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

// The component's small label, in capitals and full color: when a room frees up
// matters more than which room it is.
const DATE_CLASS = 'text-foreground tracking-wider uppercase'

/** "Now" (`now`), "Date TBC" (null), or the date (in Japan), with the year only when it isn't this one. */
function RoomDate({ date, today }: { date: string | null; today: string }) {
  const t = useTranslations('HouseRooms')
  const formatter = useFormatter()

  if (date === 'now') {
    return (
      <TimelineDate render={<span />} className={DATE_CLASS}>
        {t('now')}
      </TimelineDate>
    )
  }
  if (date === null) {
    return (
      <TimelineDate render={<span />} className={DATE_CLASS}>
        {t('date_unknown')}
      </TimelineDate>
    )
  }

  const sameYear = date.slice(0, 4) === today.slice(0, 4)
  return (
    <TimelineDate dateTime={date} className={DATE_CLASS}>
      {formatter.dateTime(new Date(`${date}T00:00:00+09:00`), {
        month: 'short',
        day: 'numeric',
        year: sameYear ? undefined : 'numeric'
      })}
    </TimelineDate>
  )
}

function RoomTitle({ room }: { room: ListedRoom }) {
  const t = useTranslations('HouseRooms')

  return (
    // A label, not a heading: the date heads each step.
    <TimelineTitle render={<span />} className="text-muted-foreground font-normal">
      {t('room', { number: room.roomNumber })}
    </TimelineTitle>
  )
}

/** The room's monthly rent. */
function RoomRent({ room }: { room: ListedRoom }) {
  const formatter = useFormatter()

  if (room.rent === null) return null
  return (
    <Badge variant="outline" className="tabular-nums">
      {formatter.number(room.rent, 'currency')}
    </Badge>
  )
}
