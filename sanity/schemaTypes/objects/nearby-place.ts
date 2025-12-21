import { MarkerIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const nearbyPlace = defineType({
  name: 'nearbyPlace',
  title: 'Nearby Place',
  type: 'object',
  icon: MarkerIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      description: 'Describe the nearby place and what makes it notable',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      description: 'description.0.value'
    },
    prepare({ description }) {
      return {
        title: description
          ? description.substring(0, 60) + (description.length > 60 ? '...' : '')
          : 'No description'
      }
    }
  }
})
