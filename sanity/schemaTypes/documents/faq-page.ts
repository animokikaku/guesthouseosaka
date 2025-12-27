import { HelpCircleIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'header',
      title: 'Page Header',
      type: 'internationalizedArrayPortableText',
      description: 'Use H1 for the title and normal text for the description',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'actions',
      title: 'Page Actions',
      type: 'array',
      description:
        'Action buttons shown in the page header. Drag to reorder, first item is primary.',
      of: [defineArrayMember({ type: 'pageAction' })]
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      description: 'Questions and answers. Drag to reorder.',
      of: [defineArrayMember({ type: 'faqItem' })]
    }),
    defineField({
      name: 'contactSection',
      title: 'Contact Section',
      type: 'internationalizedArrayPortableText',
      description:
        'Content for the contact card shown below FAQs. Use H2 for the title.',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'contactNote',
      title: 'Contact Note',
      type: 'internationalizedArrayString',
      description:
        'Small note shown below the contact section (e.g., "We may not be able to answer calls at certain times.")',
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
