import { createElement } from 'react'
import { defineField, defineType } from 'sanity'

const platforms = [
  {
    title: 'Facebook',
    value: 'facebook',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>'
  },
  {
    title: 'Instagram',
    value: 'instagram',
    icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>'
  }
] as const

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: platforms.map(({ title, value }) => ({ title, value })),
        layout: 'radio'
      }
    }),
    defineField({
      name: 'icon',
      title: 'Icon (SVG)',
      type: 'text',
      hidden: true
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
      platform: 'platform',
      icon: 'icon',
      url: 'url'
    },
    prepare({ platform, icon, url }) {
      const p = platforms.find((p) => p.value === platform)
      const svg = icon || p?.icon
      return {
        title: p?.title || platform,
        subtitle: url,
        media: svg
          ? () =>
              createElement('span', {
                style: { width: 24, height: 24, display: 'flex' },
                dangerouslySetInnerHTML: { __html: svg }
              })
          : undefined
      }
    }
  }
})
