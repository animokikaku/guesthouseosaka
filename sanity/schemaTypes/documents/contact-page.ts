import { EnvelopeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
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
