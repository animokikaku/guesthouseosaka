import { LinkIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'X (Twitter)', value: 'x' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'TikTok', value: 'tiktok' }
        ],
        layout: 'dropdown'
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
      const platformLabels: Record<string, string> = {
        facebook: 'Facebook',
        instagram: 'Instagram',
        x: 'X (Twitter)',
        youtube: 'YouTube',
        linkedin: 'LinkedIn',
        tiktok: 'TikTok'
      }
      return {
        title: platformLabels[platform] || platform,
        subtitle: url
      }
    }
  }
})
