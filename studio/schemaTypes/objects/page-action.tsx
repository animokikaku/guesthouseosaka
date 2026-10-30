import { defineField, defineType } from 'sanity'
import { Icon } from '@/lib/icons'

export const pageAction = defineType({
  name: 'pageAction',
  title: 'Page Action',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'lucide-icon',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Button text displayed to the user',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal path (e.g., /contact, /faq#phone) or external URL (e.g., https://...)',
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
        media: <Icon name={icon} />
      }
    }
  }
})
