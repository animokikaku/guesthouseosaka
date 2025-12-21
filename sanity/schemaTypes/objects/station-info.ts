import { PinIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const stationInfo = defineType({
  name: 'stationInfo',
  title: 'Station Info',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Station Name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'lines',
      title: 'Train Lines',
      type: 'internationalizedArrayString',
      description: 'e.g., "JR Osaka Loop Line, Nankai Main Line"',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'exit',
      title: 'Exit',
      type: 'internationalizedArrayString',
      description: 'Which exit to use (e.g., "East Exit")',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'walkMinutes',
      title: 'Walk Time (minutes)',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(60)
    })
  ],
  preview: {
    select: {
      name: 'name.0.value',
      walkMinutes: 'walkMinutes'
    },
    prepare({ name, walkMinutes }) {
      return {
        title: name || 'No station name',
        subtitle: walkMinutes ? `${walkMinutes} min walk` : 'No walk time'
      }
    }
  }
})
