import type {
  ContactFormConfig,
  FormFieldsConfig
} from '@/lib/types/components'
import type { ContactTypeQueryResult } from '@/sanity.types'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type ContactTypeFields = NonNullable<ContactTypeQueryResult>['fields']

// ============================================
// Field Key Type
// ============================================

type FieldKey = keyof FormFieldsConfig

// All possible field keys
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

// ============================================
// Form Fields Transformer
// ============================================

/**
 * Transforms ContactTypeQueryResult fields to FormFieldsConfig
 * @param fields - Raw fields object from Sanity query
 * @returns FormFieldsConfig with all available fields
 */
export function toFormFieldsConfig(
  fields: NonNullable<ContactTypeFields>
): FormFieldsConfig {
  return FIELD_KEYS.reduce((acc, key) => {
    const field = fields[key]
    acc[key] = {
      label: field.label ?? '',
      placeholder: field.placeholder ?? undefined,
      description: field.description ?? undefined
    }
    return acc
  }, {} as FormFieldsConfig)
}

// ============================================
// Contact Form Config Transformer
// ============================================

/**
 * Transforms full ContactTypeQueryResult to ContactFormConfig
 *
 * Note: `title` is guaranteed non-null by schema validation + coalesce query.
 * The fallback empty string should never be reached in production.
 *
 * @param contactType - Raw contact type data from Sanity query
 * @returns ContactFormConfig with title, description, and fields
 */
export function toContactFormConfig(
  contactType: NonNullable<ContactTypeQueryResult>
): ContactFormConfig {
  return {
    title: contactType.title ?? '', // Guaranteed by schema, fallback for safety
    description: contactType.description,
    fields: toFormFieldsConfig(contactType.fields)
  }
}
