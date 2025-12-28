import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const contactType = defineType({
  name: 'contactType',
  title: 'Contact Type',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Type',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Tour Request', value: 'tour' },
          { title: 'Move-in Inquiry', value: 'move-in' },
          { title: 'General Inquiry', value: 'general' }
        ],
        layout: 'radio'
      }
    }),
    defineField({
      name: 'title',
      title: 'Navigation Title',
      type: 'internationalizedArrayString',
      description: 'Short title for navigation tabs (e.g., "Tour request")',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
      description: 'Brief description for navigation and form headers',
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      title: 'title.0.value',
      key: 'key'
    },
    prepare({ title, key }) {
      return {
        title: title || 'No title',
        subtitle: key || 'No key'
      }
    }
  }
})
