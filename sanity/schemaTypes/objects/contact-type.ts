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
      name: 'content',
      title: 'Content',
      type: 'internationalizedArrayPortableText',
      description: 'Use H3 for the title and normal text for the description',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      content: 'content.0.value',
      key: 'key'
    },
    prepare({ content, key }) {
      const title =
        content?.find(
          (block: { _type: string }) => block._type === 'block'
        )?.children?.[0]?.text || 'No title'
      return {
        title,
        subtitle: key || 'No key'
      }
    }
  }
})
