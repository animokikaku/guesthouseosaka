'use client'

import type { RoomStatus } from '@/lib/availability'
import { cn } from '@/lib/utils'
import { useState, type ReactNode } from 'react'

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
                    <span className="text-[10px] font-medium opacity-80">{room.statusLabel}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        // A status line pinned to the bottom of the modal, so it stays in view while scrolling.
        // The floor and the date are already on the grid, so only what it can't show is here.
        <p
          aria-live="polite"
          className="bg-popover sticky bottom-0 flex items-center gap-3 border-t pt-3 pb-4 text-sm sm:pb-0"
        >
          <StatusDot status={selected.status} />
          <span className="shrink-0 font-semibold">{selected.title}</span>
          <span className="sr-only">{selected.statusLabel}</span>
          <span className="text-muted-foreground min-w-0 truncate">
            {[selected.style, selected.size].filter(Boolean).join(' · ')}
          </span>
          {selected.rent && (
            <span className="ml-auto shrink-0 font-semibold whitespace-nowrap tabular-nums">
              {selected.rent}
              <span className="text-muted-foreground text-xs font-normal">
                {view.labels.perMonth}
              </span>
            </span>
          )}
        </p>
      )}
    </div>
  )
}

function StatusDot({ status }: { status: RoomStatus }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'size-2 shrink-0 rounded-full',
        status === 'available' && 'bg-emerald-500',
        status === 'upcoming' && 'border-muted-foreground border-[1.5px]',
        status === 'occupied' && 'bg-muted-foreground/50'
      )}
    />
  )
}

function LegendItem({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={cn('size-3 rounded-[3px]', className)} />
      {children}
    </span>
  )
}
