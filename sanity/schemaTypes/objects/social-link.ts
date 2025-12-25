import { createElement } from 'react'
import { defineField, defineType } from 'sanity'

const platforms = [
  { title: 'Facebook', value: 'facebook' },
  { title: 'Instagram', value: 'instagram' }
] as const

const platformIcons: Record<string, string> = {
  facebook:
    '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>',
  instagram:
    '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>'
}

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
        list: [...platforms],
        layout: 'radio'
      }
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
      url: 'url'
    },
    prepare({ platform, url }) {
      const label = platforms.find((p) => p.value === platform)?.title
      const icon = platformIcons[platform]
      return {
        title: label || platform,
        subtitle: url,
        media: icon
          ? () =>
              createElement('span', {
                style: { width: 24, height: 24, display: 'flex' },
                dangerouslySetInnerHTML: { __html: icon }
              })
          : undefined
      }
    }
  }
})
