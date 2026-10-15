import type { ContactFormConfig, FormFieldsConfig } from '@/lib/types/components'
import type { ContactTypeQueryResult } from '@/sanity.types'

type ContactTypeFields = NonNullable<ContactTypeQueryResult>['fields']

type FieldKey = keyof FormFieldsConfig

const FIELD_KEYS: FieldKey[] = [
  'places',
  'date',
  'hour',
  'stayDuration',
  'name',
  'age',
  'gender',
  'nationality',
  'email',
  'phone',
  'message'
]

/**
 * Turns the query's nulls, including a field config missing from the document,
 * into the empty label and absent props the form fields expect.
 */
export function toFormFieldsConfig(fields: NonNullable<ContactTypeFields>): FormFieldsConfig {
  // FIELD_KEYS exhaustively initializes every FormFieldsConfig property.
  // oxlint-disable typescript/no-unsafe-type-assertion
  return FIELD_KEYS.reduce((acc, key) => {
    const field = fields[key]
    acc[key] = {
      label: field?.label ?? '',
      placeholder: field?.placeholder ?? undefined,
      description: field?.description ?? undefined
    }
    return acc
  }, {} as FormFieldsConfig)
}
// oxlint-enable typescript/no-unsafe-type-assertion

/** `title` is required by the schema, so its empty-string fallback is only a safety net. */
export function toContactFormConfig(
  contactType: NonNullable<ContactTypeQueryResult>
): ContactFormConfig {
  return {
    title: contactType.title ?? '',
    description: contactType.description,
    fields: toFormFieldsConfig(contactType.fields)
  }
}
