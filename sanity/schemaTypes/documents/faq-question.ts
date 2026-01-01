import { HelpCircleIcon } from '@sanity/icons'
import {
  orderRankField,
  orderRankOrdering
} from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

export const faqQuestion = defineType({
  name: 'faqQuestion',
  title: 'FAQ Question',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'internationalizedArrayPortableText',
      description:
        'Rich text answer. Leave empty for component-based answers.',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'componentKey',
      title: 'Component Key',
      type: 'string',
      description:
        'For special FAQ items rendered by custom components. Leave empty for standard text answers.',
      options: {
        list: [
          { title: 'Floors and Rooms', value: 'floors-and-rooms' },
          { title: 'Extra Costs', value: 'extra-costs' }
        ]
      }
    }),
    orderRankField({ type: 'faqQuestion' })
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      question: 'question',
      componentKey: 'componentKey'
    },
    prepare({ question, componentKey }) {
      const title = question?.[0]?.value ?? 'Untitled'
      const subtitle = componentKey ? `Component: ${componentKey}` : undefined
      return { title, subtitle }
    }
  }
})
