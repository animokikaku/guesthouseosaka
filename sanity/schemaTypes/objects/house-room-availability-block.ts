import { CalendarIcon } from '@sanity/icons/Calendar'
import { defineField, defineType } from 'sanity'

/**
 * Placed in a house's About text to show the room availability marker at that spot. The
 * rooms themselves come from the house's Availability tab.
 */
export const houseRoomAvailabilityBlock = defineType({
  name: 'houseRoomAvailabilityBlock',
  title: 'Room availability',
  type: 'object',
  icon: CalendarIcon,
  // Sanity objects need a field, but this block has nothing to configure
  fields: [defineField({ name: 'placeholder', type: 'boolean', hidden: true })],
  preview: {
    prepare: () => ({
      title: 'Room availability',
      subtitle: 'Rooms from the Availability tab'
    })
  }
})
