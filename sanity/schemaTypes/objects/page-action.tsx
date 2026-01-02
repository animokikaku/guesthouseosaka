import { defineField, defineType } from 'sanity'
import { allowedIcons } from '../../lib/allowed-icons'
import { IconPreview } from '../../lib/icon-preview'

export const pageAction = defineType({
  name: 'pageAction',
  title: 'Page Action',
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
      type: 'internationalizedArrayString',
      description: 'Button text displayed to the user',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description:
        'Internal path (e.g., /contact, /faq#phone) or external URL (e.g., https://...)',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      icon: 'icon',
      label: 'label',
      href: 'href'
    },
    prepare({ icon, label, href }) {
      return {
        title: label?.[0]?.value || 'No label',
        subtitle: href,
        media: <IconPreview icon={icon} />
      }
    }
  }
})
