import type { ContactTypeQueryResult } from '@/sanity.types'
import type {
  ContactFormConfig,
  FormFieldConfig,
  FormFieldsConfig
} from '@/lib/types/components'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type ContactTypeFields = NonNullable<ContactTypeQueryResult>['fields']
type SanityFormField = {
  label: string | null
  placeholder?: string | null
  description: string | null
}

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
// Single Field Transformer
// ============================================

/**
 * Transforms a single Sanity form field to FormFieldConfig
 * @param field - Raw field data from Sanity query
 * @returns FormFieldConfig or undefined if field is missing
 */
function toFormFieldConfig(
  field: SanityFormField | undefined
): FormFieldConfig | undefined {
  if (!field) {
    return undefined
  }

  return {
    label: field.label ?? null,
    placeholder: field.placeholder ?? null,
    description: field.description ?? null
  }
}

// ============================================
// Form Fields Transformer
// ============================================

/**
 * Transforms ContactTypeQueryResult fields to FormFieldsConfig
 * @param fields - Raw fields object from Sanity query
 * @returns FormFieldsConfig with all available fields
 */
export function toFormFieldsConfig(
  fields: ContactTypeFields
): FormFieldsConfig {
  if (!fields) {
    return {}
  }

  const result: FormFieldsConfig = {}

  for (const key of FIELD_KEYS) {
    const field = fields[key] as SanityFormField | undefined
    const config = toFormFieldConfig(field)
    if (config) {
      result[key] = config
    }
  }

  return result
}

// ============================================
// Contact Form Config Transformer
// ============================================

/**
 * Transforms full ContactTypeQueryResult to ContactFormConfig
 * @param contactType - Raw contact type data from Sanity query
 * @returns ContactFormConfig with title, description, and fields
 */
export function toContactFormConfig(
  contactType: ContactTypeQueryResult
): ContactFormConfig {
  if (!contactType) {
    return {
      fields: {}
    }
  }

  return {
    title: contactType.title ?? null,
    description: contactType.description ?? null,
    fields: toFormFieldsConfig(contactType.fields)
  }
}
