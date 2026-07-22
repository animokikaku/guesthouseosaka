import { ComponentIcon } from '@sanity/icons/Component'
import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
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
      description: 'Rich text answer with formatting support.',
      options: { aiAssist: { translateAction: true } },
      hidden: ({ document }) => !!document?.componentKey
    }),
    defineField({
      name: 'componentKey',
      title: 'Component Key',
      type: 'string',
      description: 'Select a component for dynamic content.',
      options: {
        list: [
          { title: 'Floors and Rooms', value: 'floors-and-rooms' },
          { title: 'Extra Costs', value: 'extra-costs' }
        ]
      },
      hidden: ({ document }) => {
        if (!Array.isArray(document?.answer)) {
          return false
        }

        return document.answer.some(
          (item) => typeof item === 'object' && item !== null && 'value' in item && !!item.value
        )
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
      return {
        title,
        subtitle,
        media: componentKey ? ComponentIcon : HelpCircleIcon
      }
    }
  }
})
