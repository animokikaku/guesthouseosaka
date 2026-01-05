import { defineField, defineType } from 'sanity'

export const houseBuilding = defineType({
  name: 'houseBuilding',
  title: 'Building Facts',
  type: 'object',
  fields: [
    defineField({
      name: 'rooms',
      title: 'Number of Rooms',
      type: 'number',
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: 'floors',
      title: 'Number of Floors',
      type: 'number',
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price (JPY)',
      type: 'number',
      description: 'Monthly rent starting from',
      validation: (rule) => rule.required().min(0)
    })
  ]
})
