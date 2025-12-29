import { describe, expect, it } from 'vitest'
import { toContactFormConfig, toFormFieldsConfig } from '../form'
import { createContactType, createContactTypeFields } from './mocks'

describe('toFormFieldsConfig', () => {
  it('transforms all fields from input', () => {
    const fields = createContactTypeFields()

    const result = toFormFieldsConfig(fields)

    expect(Object.keys(result)).toHaveLength(11)
    // Verify each field is transformed with its label
    expect(result.places?.label).toBe(fields.places.label)
    expect(result.date?.label).toBe(fields.date.label)
    expect(result.stayDuration?.label).toBe(fields.stayDuration.label)
    expect(result.nationality?.label).toBe(fields.nationality.label)
  })

  it('preserves placeholder and description values', () => {
    const fields = createContactTypeFields()

    const result = toFormFieldsConfig(fields)

    // Fields with placeholders should preserve them
    expect(result.stayDuration?.placeholder).toBe(fields.stayDuration.placeholder)
    expect(result.email?.placeholder).toBe(fields.email.placeholder)
    // Fields without placeholders should have null
    expect(result.places?.placeholder).toBeNull()
    expect(result.date?.placeholder).toBeNull()
  })
})

describe('toContactFormConfig', () => {
  it('transforms contact type with title and description', () => {
    const contactType = createContactType()

    const result = toContactFormConfig(contactType)

    expect(result.title).toBe(contactType.title)
    expect(result.description).toBe(contactType.description)
    expect(result.fields.places?.label).toBe(contactType.fields.places.label)
  })

  it('returns default config for null contact type', () => {
    const result = toContactFormConfig(null)

    expect(result).toEqual({
      title: '',
      fields: {}
    })
  })

  it('handles contact type with null title', () => {
    const contactType = createContactType({ title: null })

    const result = toContactFormConfig(contactType)

    expect(result.title).toBe('')
    expect(result.description).toBe(contactType.description)
  })

  it('handles contact type with null fields', () => {
    const contactType = createContactType({
      fields: null as unknown as NonNullable<typeof contactType.fields>
    })

    const result = toContactFormConfig(contactType)

    expect(result.title).toBe(contactType.title)
    expect(result.fields).toEqual({})
  })
})
