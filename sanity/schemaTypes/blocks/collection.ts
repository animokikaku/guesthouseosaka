import { HouseIdentifierValues } from '@/lib/types'
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
              type: 'string',
              options: {
                list: HouseIdentifierValues.map((value) => ({
                  title: value,
                  value
                }))
              },
              validation: (rule) => rule.required()
            }),
            defineField({
              name: 'image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required()
            }),
            defineField({
              name: 'title',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
              options: {
                aiAssist: {
                  translateAction: true
                }
              }
            }),
            defineField({
              name: 'alt',
              title: 'Description',
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
              title: 'title',
              alt: 'alt'
            },
            prepare({ media, alt, title }) {
              const firstTitle = title?.[0]?.value
              const firstAlt = alt?.[0]?.value
              return {
                title: firstTitle || 'No title',
                subtitle: firstAlt,
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
