import { HouseFloorGrid, type FloorGridView } from '@/components/house/house-floor-grid'
import {
  groupByFloor,
  openingDateFormat,
  tokyoMidnight,
  type AvailabilityRoom,
  type FloorRoom
} from '@/lib/availability'
import { useFormatter, useTranslations } from 'use-intl'
import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute'

interface HouseFloorPlanProps {
  document: { _id: string; _type: string }
  /** Visual-editing markers already removed from numbers, dates and enum values */
  rooms: AvailabilityRoom[] | null | undefined
  /** Today in Osaka (YYYY-MM-DD) */
  today: string
}

/**
 * The house's rooms by floor, opened from the Rooms figure. Every label is prepared
 * here, in Tokyo time; the grid only handles which room is selected.
 */
export function HouseFloorPlan({ document, rooms, today }: HouseFloorPlanProps) {
  const t = useTranslations('HouseAvailability')
  const formatter = useFormatter()

  const floors = groupByFloor(rooms, today)
  if (floors.length === 0) return null

  const dataAttribute = createDataAttribute({ id: document._id, type: document._type })
  const formatDate = (date: string) =>
    formatter.dateTime(tokyoMidnight(date), openingDateFormat(date, today))

  const toView = (room: FloorRoom) => ({
    key: room._key,
    number: room.number,
    title: t('room_number', { number: room.number }),
    status: room.status,
    statusLabel:
      room.status === 'available'
        ? t('now')
        : room.status === 'upcoming' && room.availableFrom
          ? formatDate(room.availableFrom)
          : t('occupied'),
    style: room.style ? t(`style_${room.style}`) : null,
    size: room.size ? t('size', { size: room.size }) : null,
    rent: room.rent ? formatter.number(room.rent, 'currency') : null,
    dataSanity: dataAttribute(`rooms[_key=="${room._key}"]`)
  })

  const allRooms = floors.flatMap((floor) => floor.rooms)
  // Start on a room worth looking at: free now, else the next to open, else any
  const defaultRoom =
    allRooms.find((room) => room.status === 'available') ??
    allRooms
      .filter((room) => room.status === 'upcoming')
      .toSorted((a, b) => (a.availableFrom ?? '').localeCompare(b.availableFrom ?? ''))[0] ??
    allRooms[0]

  const view: FloorGridView = {
    floors: floors.map((floor) => ({
      key: floor.floor,
      label: t('floor', { floor: floor.floor }),
      rooms: floor.rooms.map(toView)
    })),
    defaultRoom: defaultRoom?._key ?? null,
    labels: {
      available: t('legend_available'),
      upcoming: t('legend_upcoming'),
      occupied: t('occupied'),
      perMonth: t('per_month')
    }
  }

  return <HouseFloorGrid view={view} />
}
