import { EnvelopeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
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
      name: 'contactTypes',
      title: 'Contact Types',
      type: 'array',
      description: 'Different ways visitors can contact you. Drag to reorder.',
      of: [defineArrayMember({ type: 'contactType' })]
    })
  ],
  preview: {
    select: {
      contactTypes: 'contactTypes'
    },
    prepare({ contactTypes }) {
      return {
        title: 'Contact Page',
        subtitle: `${contactTypes?.length || 0} contact types`
      }
    }
  }
})
