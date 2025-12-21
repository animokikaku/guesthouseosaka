import { InfoOutlineIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const pricingNote = defineType({
  name: 'pricingNote',
  title: 'Pricing Note',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      description: 'Section title (e.g., "Long Stay Discount", "Other Fees")',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description: 'List of notes or details',
      of: [
        defineArrayMember({
          name: 'item',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'internationalizedArrayText',
              validation: (rule) => rule.required(),
              options: { aiAssist: { translateAction: true } }
            })
          ],
          preview: {
            select: { text: 'text.0.value' },
            prepare({ text }) {
              return { title: text || 'No text' }
            }
          }
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title.0.value',
      items: 'items'
    },
    prepare({ title, items }) {
      const count = items?.length || 0
      return {
        title: title || 'No title',
        subtitle: `${count} item${count !== 1 ? 's' : ''}`
      }
    }
  }
})
