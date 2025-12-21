import { HelpCircleIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
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
      description: 'Rich text answer with formatting support',
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      question: 'question.0.value'
    },
    prepare({ question }) {
      return {
        title: question || 'No question'
      }
    }
  }
})
