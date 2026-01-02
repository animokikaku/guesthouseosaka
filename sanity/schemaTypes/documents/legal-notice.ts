import { LockIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const legalNotice = defineType({
  name: 'legalNotice',
  title: 'Legal Notice',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      description: 'The title of the legal notice (e.g., Privacy Policy)',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      description: 'The date when this policy was last updated',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'internationalizedArrayPortableText',
      description:
        'The full content of the legal notice. Use H3 for section headings, normal text for paragraphs, and bullet lists where appropriate.',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      title: 'title',
      lastUpdated: 'lastUpdated'
    },
    prepare({ title, lastUpdated }) {
      const displayTitle =
        title?.find((t: { _key: string; value: string }) => t._key === 'en')
          ?.value || 'Legal Notice'
      return {
        title: displayTitle,
        subtitle: lastUpdated ? `Last updated: ${lastUpdated}` : 'No date set'
      }
    }
  }
})
