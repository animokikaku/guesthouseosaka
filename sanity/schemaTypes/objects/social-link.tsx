import { defineField, defineType } from 'sanity'
import { allowedIcons } from '../../lib/allowed-icons'
import { IconPreview } from '../../lib/icon-preview'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'lucide-icon',
      options: { allowedIcons },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description:
        'Platform name for accessibility (e.g., Facebook, Instagram)',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https']
        })
    })
  ],
  preview: {
    select: {
      icon: 'icon',
      label: 'label',
      url: 'url'
    },
    prepare({ icon, label, url }) {
      return {
        title: label,
        subtitle: url,
        media: <IconPreview icon={icon} />
      }
    }
  }
})
