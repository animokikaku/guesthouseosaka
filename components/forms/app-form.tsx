'use client'

import { default as InputField } from '@/components/forms/fields/input-field'
import { default as InputGroupField } from '@/components/forms/fields/input-group-field'
import { default as MessageField } from '@/components/forms/fields/message-field'
import { default as PrivacyPolicyField } from '@/components/forms/fields/privacy-policy-field'
import { default as SelectField } from '@/components/forms/fields/select-field'
import { default as ToggleGroupField } from '@/components/forms/fields/toggle-group-field'
import { createFormHook } from '@tanstack/react-form'

/**
 * The app-wide form hook. Each field component self-registers its brand via
 * `fieldComponent.loose(...)` in its own module; this just assembles them so
 * `form.Field` render props expose them, typed against the field's value.
 */
const { useAppForm, defineAppFieldGroup } = createFormHook({
  fieldComponents: {
    InputField,
    InputGroupField,
    MessageField,
    PrivacyPolicyField,
    SelectField,
    ToggleGroupField
  },
  formComponents: {}
})

export { useAppForm, defineAppFieldGroup }
