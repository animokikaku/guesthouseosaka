import { HelpCircleIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'internationalizedArrayText',
      description: 'Shown below the title',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      description: 'Questions and answers. Drag to reorder.',
      of: [defineArrayMember({ type: 'faqItem' })]
    }),
    defineField({
      name: 'contactTitle',
      title: 'Contact Section Title',
      type: 'internationalizedArrayString',
      description: 'Title for the contact card shown below FAQs',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'contactDescription',
      title: 'Contact Section Description',
      type: 'internationalizedArrayText',
      description: 'Description for the contact card',
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      items: 'items'
    },
    prepare({ items }) {
      return {
        title: 'FAQ Page',
        subtitle: `${items?.length || 0} questions`
      }
    }
  }
})
