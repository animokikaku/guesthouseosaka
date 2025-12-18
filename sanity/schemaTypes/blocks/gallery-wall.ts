import { ImagesIcon } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const galleryWall = defineType({
  name: 'galleryWall',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'images',
      description: 'Exactly 6 images required. Drag to reorder.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required()
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
              options: {
                aiAssist: {
                  translateAction: true
                }
              }
            })
          ],
          preview: {
            select: {
              media: 'image',
              alt: 'alt'
            },
            prepare({ media, alt }) {
              const firstAlt = alt?.[0]?.value
              return {
                title: firstAlt || 'No alt text',
                media
              }
            }
          }
        })
      ],
      validation: (rule) => rule.required().length(6)
    })
  ],
  preview: {
    select: {
      title: 'title',
      images: 'images'
    },
    prepare({ title, images }) {
      return {
        title,
        subtitle: `${images?.length ?? 0}/6 images`
      }
    }
  }
})
