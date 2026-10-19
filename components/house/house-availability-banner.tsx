'use client'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { RoomStatus } from '@/lib/availability'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

/** A room with every label already formatted on the server, in Tokyo time. */
export interface RoomView {
  key: string
  number: string
  title: string
  status: RoomStatus
  /** "Now", "Nov 10" or "Occupied" */
  statusLabel: string
  style: string | null
  size: string | null
  floor: string
  rent: string | null
  dataSanity?: string
}

interface RoomGroupView {
  key: string
  label: string
  count: string
  isNow: boolean
  rooms: RoomView[]
}

export interface AvailabilityBannerView {
  status: 'available' | 'upcoming'
  headline: string
  summary: string
  summaryShort: string
  datesLabel: string
  dates: string[]
  moreDates: string | null
  updated: string
  columns: RoomGroupView[]
  timeline: RoomGroupView[]
  floors: { key: string; label: string; rooms: RoomView[] }[]
  defaultRoom: string | null
  labels: {
    toggle: string
    byDate: string
    byFloor: string
    available: string
    upcoming: string
    occupied: string
    perMonth: string
  }
}

/**
 * The availability card under the gallery. Collapsed, it answers "is anything free?";
 * opened, it lists the rooms by move-in date or by floor. The panel stays in the HTML
 * while closed, so search engines and in-page search still find the rooms.
 */
export function HouseAvailabilityBanner({ view }: { view: AvailabilityBannerView }) {
  const [open, setOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState(view.defaultRoom)

  // A link to #availability opens the card
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === '#availability') setOpen(true)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const selected = view.floors.flatMap((floor) => floor.rooms).find((r) => r.key === selectedKey)

  return (
    <Collapsible
      id="availability"
      open={open}
      onOpenChange={setOpen}
      className="bg-card border-border scroll-mt-24 rounded-xl border"
    >
      <CollapsibleTrigger
        aria-label={view.labels.toggle}
        className="focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 text-left outline-none focus-visible:ring-[3px] md:gap-5 md:px-5"
      >
        <StatusDot status={view.status} />
        <span className="min-w-0 flex-1 md:flex-none">
          <span className="text-foreground block text-[15px] font-semibold md:text-base">
            {view.headline}
          </span>
          <span className="text-muted-foreground block text-xs md:hidden">{view.summaryShort}</span>
          <span className="text-muted-foreground hidden text-sm md:block">{view.summary}</span>
        </span>
        {view.dates.length > 0 && (
          <span className="border-border text-muted-foreground hidden flex-1 flex-wrap items-center gap-2 border-l pl-5 text-sm md:flex">
            {view.datesLabel}
            {view.dates.map((date) => (
              <Badge key={date} variant="secondary" className="text-muted-foreground tabular-nums">
                {date}
              </Badge>
            ))}
            {view.moreDates}
          </span>
        )}
        <span
          aria-hidden="true"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'shrink-0')}
        >
          <ChevronDownIcon
            className={cn('transition-transform duration-200', open && 'rotate-180')}
          />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent
        hiddenUntilFound
        className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
      >
        <div className="border-border/60 border-t px-3 pt-3 pb-4 md:px-5 md:pt-4">
          <Tabs defaultValue="date">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TabsList className="w-full sm:w-fit">
                <TabsTrigger value="date">{view.labels.byDate}</TabsTrigger>
                <TabsTrigger value="floor">{view.labels.byFloor}</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="date" className="pt-2">
              {/* Wide screens: one column per move-in period */}
              <div
                className="hidden items-start gap-2.5 md:grid"
                style={{ gridTemplateColumns: `repeat(${view.columns.length}, minmax(0, 1fr))` }}
              >
                {view.columns.map((group) => (
                  <section
                    key={group.key}
                    className="bg-muted/40 grid content-start gap-2 rounded-lg p-2.5"
                  >
                    <header className="flex items-baseline justify-between px-1 text-xs">
                      <h3
                        className={cn(
                          'font-semibold',
                          group.isNow && 'text-emerald-600 dark:text-emerald-400'
                        )}
                      >
                        {group.label}
                      </h3>
                      <span className="text-muted-foreground">{group.count}</span>
                    </header>
                    {group.rooms.map((room) => (
                      <RoomCard
                        key={room.key}
                        room={room}
                        perMonth={view.labels.perMonth}
                        showDate
                      />
                    ))}
                  </section>
                ))}
              </div>

              {/* Phones: a vertical timeline */}
              <ol className="grid md:hidden">
                {view.timeline.map((group) => (
                  <li key={group.key} className="grid grid-cols-[3.25rem_1rem_minmax(0,1fr)] gap-2">
                    <span
                      className={cn(
                        'pt-2.5 text-right text-xs tabular-nums',
                        group.isNow
                          ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                          : 'text-muted-foreground'
                      )}
                    >
                      {group.label}
                    </span>
                    <span className="before:bg-border relative flex justify-center before:absolute before:inset-y-0 before:w-px">
                      <span
                        className={cn(
                          'relative mt-3.5 size-2 rounded-full border-[1.5px]',
                          group.isNow
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-muted-foreground bg-card'
                        )}
                      />
                    </span>
                    <span className="grid gap-1.5 pt-1 pb-2.5">
                      {group.rooms.map((room) => (
                        <RoomCard key={room.key} room={room} perMonth={view.labels.perMonth} />
                      ))}
                    </span>
                  </li>
                ))}
              </ol>
            </TabsContent>

            <TabsContent value="floor" className="grid gap-3 pt-2">
              <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <LegendItem className="border border-emerald-500/45 bg-emerald-500/15">
                  {view.labels.available}
                </LegendItem>
                <LegendItem className="border-foreground/35 border border-dashed">
                  {view.labels.upcoming}
                </LegendItem>
                <LegendItem className="bg-muted">{view.labels.occupied}</LegendItem>
              </div>
              <div className="grid gap-1.5">
                {view.floors.map((floor) => (
                  <div
                    key={floor.key}
                    className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-2"
                  >
                    <span className="text-muted-foreground pt-3 text-xs font-medium">
                      {floor.label}
                    </span>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1.5">
                      {floor.rooms.map((room) => (
                        <button
                          key={room.key}
                          type="button"
                          aria-pressed={room.key === selectedKey}
                          aria-label={`${room.title}, ${room.statusLabel}`}
                          data-sanity={room.dataSanity}
                          data-sanity-drag-disable="true"
                          onClick={() => setSelectedKey(room.key)}
                          className={cn(
                            'grid h-11 cursor-pointer place-items-center content-center rounded-md text-xs font-semibold tabular-nums outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:h-12',
                            room.status === 'available' &&
                              'border border-emerald-500/45 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
                            room.status === 'upcoming' &&
                              'border-foreground/35 border border-dashed',
                            room.status === 'occupied' &&
                              'bg-muted text-muted-foreground/70 font-medium',
                            room.key === selectedKey &&
                              'ring-foreground ring-offset-card ring-2 ring-offset-2'
                          )}
                        >
                          {room.number}
                          {room.status !== 'occupied' && (
                            <span className="hidden text-[10px] font-medium opacity-80 sm:block">
                              {room.statusLabel}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {selected && (
                <div
                  aria-live="polite"
                  className="bg-background border-border flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border px-3.5 py-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{selected.title}</span>
                    <StatusBadge room={selected} />
                    {[selected.style, selected.size, selected.floor].map(
                      (tag) =>
                        tag && (
                          <Badge key={tag} variant="outline" className="text-muted-foreground">
                            {tag}
                          </Badge>
                        )
                    )}
                  </div>
                  {selected.rent && (
                    <span className="text-base font-semibold tabular-nums">
                      {selected.rent}
                      <span className="text-muted-foreground text-xs font-normal">
                        {view.labels.perMonth}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
          <p className="text-muted-foreground mt-3 text-xs">{view.updated}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function StatusDot({ status }: { status: AvailabilityBannerView['status'] }) {
  return status === 'available' ? (
    <span
      aria-hidden="true"
      className="size-2.5 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"
    />
  ) : (
    <span
      aria-hidden="true"
      className="border-muted-foreground size-2.5 shrink-0 rounded-full border-[1.5px]"
    />
  )
}

function StatusBadge({ room }: { room: RoomView }) {
  if (room.status === 'available') {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
        {room.statusLabel}
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="text-muted-foreground tabular-nums">
      {room.statusLabel}
    </Badge>
  )
}

function RoomCard({
  room,
  perMonth,
  showDate
}: {
  room: RoomView
  perMonth: string
  showDate?: boolean
}) {
  const now = room.status === 'available'
  return (
    <Item
      variant="outline"
      size="xs"
      data-sanity={room.dataSanity}
      // Rooms follow availability dates, not the array order, so dragging one means nothing
      data-sanity-drag-disable="true"
      className={cn(
        'bg-background flex-nowrap',
        now && 'border-emerald-500/45 bg-emerald-500/[0.07]'
      )}
    >
      <ItemContent className="min-w-0 gap-0.5">
        <ItemTitle className="font-semibold">{room.title}</ItemTitle>
        <ItemDescription className="line-clamp-1 text-xs">
          {[room.style, room.size].filter(Boolean).join(' · ')}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex-col items-end gap-0.5 text-xs tabular-nums">
        {showDate && (
          <span
            className={cn(
              now ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
            )}
          >
            {room.statusLabel}
          </span>
        )}
        {room.rent && (
          <span className={cn(showDate ? 'text-foreground' : 'text-foreground text-sm')}>
            {room.rent}
            {showDate && <span className="text-muted-foreground text-[11px]">{perMonth}</span>}
          </span>
        )}
      </ItemActions>
    </Item>
  )
}

function LegendItem({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={cn('size-3 rounded-[3px]', className)} />
      {children}
    </span>
  )
}
