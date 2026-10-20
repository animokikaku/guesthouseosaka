import { UsersIcon } from '@sanity/icons/Users'
import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Someone who updates rooms by messaging the LINE account (app/api/line).
 * The bot adds a draft, with the ID `lineManager.<LINE user ID>`, the first
 * time someone writes to it; publishing the draft lets them in.
 */
export const lineManager = defineType({
  name: 'lineManager',
  title: 'LINE Manager',
  type: 'document',
  icon: UsersIcon,
  description:
    'People who update rooms by messaging the LINE account. Someone new appears here as a draft after their first message: pick their houses and publish to let them in. Unpublish to take access away.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Their LINE display name when they first wrote. Only shown in the Studio.',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'houses',
      title: 'Houses',
      type: 'array',
      description:
        'The houses they can update. A message that names no house goes to the one with that room number.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'house' }] })],
      validation: (rule) => rule.required().min(1).unique()
    }),
    defineField({
      name: 'lineUserId',
      title: 'LINE user ID',
      type: 'string',
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      house0: 'houses.0.title.0.value',
      house1: 'houses.1.title.0.value',
      house2: 'houses.2.title.0.value'
    },
    prepare({ title, house0, house1, house2 }) {
      const houses = [house0, house1, house2].filter(Boolean)
      return {
        title: title || 'Unnamed manager',
        subtitle: houses.length > 0 ? houses.join(', ') : 'No houses yet'
      }
    }
  }
})
