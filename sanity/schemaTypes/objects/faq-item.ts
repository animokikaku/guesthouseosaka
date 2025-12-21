import { HelpCircleIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      description: 'Rich text answer with formatting support',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) =>
                      rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel']
                      })
                  })
                ]
              }
            ]
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' }
          ]
        }),
        defineArrayMember({
          type: 'object',
          name: 'table',
          title: 'Table',
          fields: [
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'row',
                  fields: [
                    defineField({
                      name: 'cells',
                      title: 'Cells',
                      type: 'array',
                      of: [{ type: 'string' }]
                    })
                  ],
                  preview: {
                    select: { cells: 'cells' },
                    prepare({ cells }) {
                      return { title: cells?.join(' | ') || 'Empty row' }
                    }
                  }
                })
              ]
            })
          ],
          preview: {
            select: { rows: 'rows' },
            prepare({ rows }) {
              return { title: `Table (${rows?.length || 0} rows)` }
            }
          }
        })
      ]
    })
  ],
  preview: {
    select: {
      question: 'question.0.value'
    },
    prepare({ question }) {
      return {
        title: question || 'No question'
      }
    }
  }
})
