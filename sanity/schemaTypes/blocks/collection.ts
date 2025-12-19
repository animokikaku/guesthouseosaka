import { GalleryHorizontal } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'collection',
  type: 'document',
  icon: GalleryHorizontal,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'images',
      description: 'Exactly 3 images required. Drag to reorder.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'house',
              type: 'reference',
              to: [{ type: 'house' }],
              validation: (rule) => rule.required()
            }),
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            select: {
              media: 'image',
              title: 'house.title',
              description: 'house.description'
            },
            prepare({ media, description, title }) {
              const firstTitle = title?.[0]?.value
              const firstDescription = description?.[0]?.value
              return {
                title: firstTitle || 'No title',
                subtitle: firstDescription,
                media
              }
            }
          }
        })
      ],
      validation: (rule) => rule.required().length(3)
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
        media: images?.[0]?.image,
        subtitle: `${images?.length ?? 0}/3 images`
      }
    }
  }
})
