import { HouseSectionContent, HouseSectionHeading } from '@/components/house/house-section'
import { formatRoomDate } from '@/components/house/room-date'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator
} from '@/components/reui/timeline'
import { hasRooms, roomKey, type ListedRoom, type RoomAvailability } from '@/lib/rooms'
import type { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { CalendarClockIcon, CalendarIcon, CircleCheckIcon } from 'lucide-react'
import { useFormatter, useLocale, useTranslations } from 'use-intl'

/**
 * The house's "Upcoming Vacancies" section (see docs/rooms.md): a timeline of
 * when its free and upcoming rooms are available, rooms free now first, then
 * the rest by date, each room a link to ask to move into it. A fully booked
 * house says so instead. The badge links to `#availability`.
 */
export function HouseRooms({
  house,
  rooms,
  note,
  'data-sanity': dataSanity
}: {
  house: HouseIdentifier
  rooms: RoomAvailability
  /** What the prices include: Site Settings' note, in the page's language or English. */
  note?: string | null
  'data-sanity'?: string
}) {
  const t = useTranslations('HouseRooms')

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
          {/* The note is required in the Studio; until one is published, the timeline follows the title. */}
          {note && <p className={TEXT_CLASS}>{note}</p>}
          {/*
           * When its steps don't fit, it scrolls sideways with no scrollbar: an edge
           * with more steps past it fades out (Base UI sets how far each edge is from
           * the content's). It reaches a little past the section on every side, which
           * the timeline's padding takes back, for the rooms' hover boxes.
           */}
          <ScrollArea className="-m-2 [&_[data-slot=scroll-area-viewport]]:[mask-image:linear-gradient(to_right,transparent,#000_min(4rem,var(--scroll-area-overflow-x-start,0px)),#000_calc(100%_-_min(4rem,var(--scroll-area-overflow-x-end,0px))),transparent)]">
            <RoomTimeline house={house} rooms={rooms} />
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </HouseSectionContent>
      ) : (
        <p className={TEXT_CLASS}>{t('fully_booked')}</p>
      )}
    </section>
  )
}

// The section's text, as the location section writes its own under its title.
const TEXT_CLASS = 'text-foreground text-base leading-relaxed'

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
function RoomTimeline({ house, rooms }: { house: HouseIdentifier; rooms: RoomAvailability }) {
  const t = useTranslations('HouseRooms')
  const formatter = useFormatter()
  const locale = useLocale()
  const steps = toSteps(rooms)

  return (
    <Timeline
      value={rooms.available.length > 0 ? 1 : 0}
      orientation="horizontal"
      render={<ol />}
      className="p-2"
    >
      {steps.map((step, index) => (
        <TimelineItem
          key={step.date ?? 'unknown'}
          step={index + 1}
          render={<li />}
          // As wide as its rooms, with the same gap before the next step however
          // many there are, rather than each an equal share of the row. The last
          // one keeps its last badge's border in view.
          className="min-w-max flex-none group-data-[orientation=horizontal]/timeline:not-last:pe-14 last:pe-1"
        >
          <TimelineHeader>
            <StepLabel date={step.date} today={rooms.today} />
          </TimelineHeader>
          {/* The step's icon in place of the component's dot, on the same spot of the line. */}
          <TimelineIndicator className="text-primary/55 group-data-completed/timeline-item:text-primary size-auto rounded-none border-0 [&>svg]:size-4">
            <StepIcon date={step.date} />
          </TimelineIndicator>
          <TimelineSeparator />
          <TimelineContent render={<ul />}>
            {step.rooms.map((room) => (
              // A step's rooms each answer the pointer along their own row.
              <li key={room.roomNumber} className={step.rooms.length > 1 ? 'relative' : undefined}>
                {/*
                 * To the move-in form, with the house and the room chosen. The rows'
                 * spacing is the links' padding, so nothing hangs out of the list
                 * (which would give the timeline a second, vertical scroll).
                 * Swiping the timeline sideways from a room scrolls it: the browser
                 * only follows a link on a tap.
                 */}
                <Link
                  to="/$locale/contact/$slug"
                  params={{ locale, slug: 'move-in' }}
                  search={{ room: roomKey(house, room.roomNumber) }}
                  hash="tabs"
                  className={cn(
                    'group/room flex items-center gap-2 py-1 whitespace-nowrap outline-none',
                    // What the pointer, a finger or the focus ring gets: a box wider than the link's words.
                    'after:absolute after:rounded-lg after:transition-colors',
                    'hover:after:bg-foreground/5 focus-visible:after:ring-ring/50 focus-visible:after:ring-3',
                    hitBox(step.rooms.length === 1, index === steps.length - 1)
                  )}
                >
                  {/* The room's name alone answers the pointer; its price stays as it is. */}
                  <span className="group-hover/room:text-foreground transition-colors">
                    {t('room', { number: room.roomNumber })}
                  </span>
                  {room.price !== null && (
                    <Badge variant="outline" className="tabular-nums">
                      {formatter.number(room.price, 'currency')}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

/**
 * Where a room's link answers, as its `after` box. A step's only room takes
 * the whole step, from its icon to the next step's; one of several takes its
 * row, across the step. The timeline's padding leaves the boxes room past the
 * first, the last and the tallest step, and the last step has no gap after it.
 */
function hitBox(alone: boolean, last: boolean) {
  if (alone)
    return cn(
      'after:-top-10 after:-bottom-2 after:-left-2',
      last ? 'after:-right-2' : 'after:right-2'
    )
  return cn('after:inset-y-0 after:-left-2', last ? 'after:-right-2' : 'after:-right-12')
}

/** A check for rooms free now, a calendar for a date, a calendar with a clock for a date to come. */
function StepIcon({ date }: { date: Step['date'] }) {
  if (date === 'now') return <CircleCheckIcon />
  if (date === null) return <CalendarClockIcon />
  return <CalendarIcon />
}

// The component's small label, larger and in full color: when a room frees up
// matters more than which room it is.
const LABEL_CLASS = 'text-foreground mb-1 text-sm'

/**
 * "Available now" (`now`), "Date TBC" (null), or the date (in Japan), with the
 * year only when it isn't this one. The date's icon says it's when the rooms
 * free up; screen readers get the sentence.
 */
function StepLabel({ date, today }: { date: Step['date']; today: string }) {
  const t = useTranslations('HouseRooms')
  const formatter = useFormatter()

  if (date === 'now' || date === null) {
    return (
      <TimelineDate render={<span />} className={LABEL_CLASS}>
        {date === 'now' ? t('now') : t('date_unknown')}
      </TimelineDate>
    )
  }

  const formatted = formatRoomDate(formatter, date, today)
  return (
    <TimelineDate dateTime={date} className={LABEL_CLASS}>
      <span aria-hidden="true">{formatted}</span>
      <span className="sr-only">{t('available_from', { date: formatted })}</span>
    </TimelineDate>
  )
}
