import { getRoomStatus, tokyoToday } from '@/lib/availability'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { CheckmarkCircleIcon } from '@sanity/icons/CheckmarkCircle'
import { ClockIcon } from '@sanity/icons/Clock'
import { LockIcon } from '@sanity/icons/Lock'
import { defineArrayMember, defineField, defineType } from 'sanity'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const STATUS_ICONS = {
  available: CheckmarkCircleIcon,
  upcoming: ClockIcon,
  occupied: LockIcon
}

/**
 * Room availability for one house, kept apart from the house document so that
 * publishing a date change never publishes unfinished edits to the house page.
 * One document per house, created up front (see the desk structure).
 */
export const houseAvailability = defineType({
  name: 'houseAvailability',
  title: 'Room Availability',
  icon: CalendarIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'house',
      title: 'House',
      type: 'reference',
      to: [{ type: 'house' }],
      readOnly: true,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'rooms',
      title: 'Rooms',
      type: 'array',
      description:
        'Set the date a room becomes available. Leave it empty while the room is occupied.',
      options: { sortable: false },
      of: [
        defineArrayMember({
          name: 'room',
          title: 'Room',
          type: 'object',
          fields: [
            defineField({
              name: 'availableFrom',
              title: 'Available from',
              type: 'date',
              description: 'Empty means occupied. Today or earlier means available now.'
            }),
            defineField({
              name: 'number',
              title: 'Room number',
              type: 'string',
              // Room numbers are set once by an administrator; managers only change dates
              readOnly: ({ currentUser }) =>
                !currentUser?.roles.some((role) => role.name === 'administrator'),
              validation: (rule) =>
                rule.required().custom((value, context) => {
                  const rooms = context.document?.rooms
                  const duplicates = Array.isArray(rooms)
                    ? rooms.filter((room) => isRecord(room) && room.number === value).length
                    : 0
                  return duplicates > 1 ? 'Another room already uses this number' : true
                })
            }),
            defineField({
              name: 'style',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Western', value: 'western' },
                  { title: 'Japanese', value: 'japanese' }
                ],
                layout: 'radio',
                direction: 'horizontal'
              },
              validation: (rule) => rule.required()
            }),
            defineField({
              name: 'size',
              title: 'Size (m²)',
              type: 'number',
              validation: (rule) => rule.required().positive()
            }),
            defineField({
              name: 'rent',
              title: 'Rent (¥ / month)',
              type: 'number',
              validation: (rule) => rule.required().positive().integer()
            })
          ],
          preview: {
            select: {
              number: 'number',
              availableFrom: 'availableFrom',
              style: 'style',
              size: 'size',
              rent: 'rent'
            },
            prepare({ number, availableFrom, style, size, rent }) {
              const status = getRoomStatus(availableFrom, tokyoToday())
              const when =
                status === 'available'
                  ? 'Available now'
                  : status === 'upcoming'
                    ? `From ${availableFrom}`
                    : 'Occupied'
              const details = [
                style === 'japanese' ? 'Japanese' : style === 'western' ? 'Western' : null,
                size ? `${size} m²` : null,
                rent ? `¥${rent.toLocaleString('en-US')}` : null
              ].filter(Boolean)
              return {
                title: `Room ${number ?? '?'}`,
                subtitle: [when, ...details].join(' · '),
                media: STATUS_ICONS[status]
              }
            }
          }
        })
      ]
    })
  ],
  preview: {
    select: { title: 'house.title' },
    prepare({ title }) {
      const label = Array.isArray(title)
        ? title.find((entry: { language?: string }) => entry.language === 'en')?.value
        : undefined
      return { title: label ?? 'House', subtitle: 'Room availability' }
    }
  }
})
