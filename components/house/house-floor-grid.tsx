'use client'

import { Badge } from '@/components/ui/badge'
import type { RoomStatus } from '@/lib/availability'
import { cn } from '@/lib/utils'
import { useState } from 'react'

/** A room with every label already formatted on the server, in Tokyo time. */
export interface FloorRoomView {
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
  dataSanity: string
}

export interface FloorGridView {
  floors: { key: string; label: string; rooms: FloorRoomView[] }[]
  defaultRoom: string | null
  labels: { available: string; upcoming: string; occupied: string; perMonth: string }
}

/** Every room of the house on its floor; selecting one shows its details underneath. */
export function HouseFloorGrid({ view }: { view: FloorGridView }) {
  const [selectedKey, setSelectedKey] = useState(view.defaultRoom)
  const selected = view.floors.flatMap((floor) => floor.rooms).find((r) => r.key === selectedKey)

  return (
    <div className="grid gap-3">
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
          <div key={floor.key} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-2">
            <span className="text-muted-foreground pt-3 text-xs font-medium">{floor.label}</span>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1.5">
              {floor.rooms.map((room) => (
                <button
                  key={room.key}
                  type="button"
                  aria-pressed={room.key === selectedKey}
                  aria-label={`${room.title}, ${room.statusLabel}`}
                  data-sanity={room.dataSanity}
                  // Rooms are placed by number, not the array order, so dragging one means nothing
                  data-sanity-drag-disable="true"
                  onClick={() => setSelectedKey(room.key)}
                  className={cn(
                    'focus-visible:ring-ring/50 grid h-11 cursor-pointer place-items-center content-center rounded-md text-xs font-semibold tabular-nums outline-none focus-visible:ring-[3px] sm:h-12',
                    room.status === 'available' &&
                      'border border-emerald-500/45 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
                    room.status === 'upcoming' && 'border-foreground/35 border border-dashed',
                    room.status === 'occupied' && 'bg-muted text-muted-foreground/70 font-medium',
                    room.key === selectedKey &&
                      'ring-foreground ring-offset-background ring-2 ring-offset-2'
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
          className="bg-muted/40 border-border flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border px-3.5 py-3"
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
    </div>
  )
}

function StatusBadge({ room }: { room: FloorRoomView }) {
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

function LegendItem({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={cn('size-3 rounded-[3px]', className)} />
      {children}
    </span>
  )
}
