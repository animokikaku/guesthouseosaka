import { createElement } from 'react'
import { defineField, defineType } from 'sanity'

// Define supported icons with their SVG representations
const icons = [
  {
    title: 'Mail',
    value: 'mail',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>'
  },
  {
    title: 'Phone',
    value: 'phone',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
  },
  {
    title: 'FAQ/Book',
    value: 'book-text',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>'
  },
  {
    title: 'External Link',
    value: 'external-link',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'
  },
  {
    title: 'Map Pin',
    value: 'map-pin',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>'
  },
  {
    title: 'Calendar',
    value: 'calendar',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>'
  }
] as const

const variants = [
  { title: 'Default (filled)', value: 'default' },
  { title: 'Ghost (transparent)', value: 'ghost' },
  { title: 'Outline', value: 'outline' },
  { title: 'Secondary', value: 'secondary' }
] as const

export const pageAction = defineType({
  name: 'pageAction',
  title: 'Page Action',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: icons.map(({ title, value }) => ({ title, value })),
        layout: 'dropdown'
      }
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
    }),
    defineField({
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [...variants],
        layout: 'radio'
      }
    })
  ],
  preview: {
    select: {
      icon: 'icon',
      label: 'label',
      href: 'href',
      variant: 'variant'
    },
    prepare({ icon, label, href, variant }) {
      const iconDef = icons.find((i) => i.value === icon)
      const labelText = label?.[0]?.value || 'No label'
      const variantText = variants.find((v) => v.value === variant)?.title || ''

      return {
        title: labelText,
        subtitle: `${href} (${variantText})`,
        media: iconDef?.icon
          ? () =>
              createElement('span', {
                style: { width: 24, height: 24, display: 'flex' },
                dangerouslySetInnerHTML: { __html: iconDef.icon }
              })
          : undefined
      }
    }
  }
})
