'use client'

import {
  DateField,
  InputField,
  InputGroupField,
  MessageField,
  PrivacyPolicyField,
  SelectField,
  ToggleGroupField
} from '@/components/forms/fields'
import { createFormHook, getFormHookHelpers } from '@tanstack/react-form'

const { fieldComponent } = getFormHookHelpers()

/**
 * The app-wide form hook. Field components are registered here so that
 * `form.Field` render props expose them, typed against the field's value.
 */
const formHook = createFormHook({
  fieldComponents: {
    DateField: fieldComponent.loose(DateField, 'field'),
    InputField: fieldComponent.loose(InputField, 'field'),
    InputGroupField: fieldComponent.loose(InputGroupField, 'field'),
    MessageField: fieldComponent.loose(MessageField, 'field'),
    PrivacyPolicyField: fieldComponent.loose(PrivacyPolicyField, 'field'),
    SelectField: fieldComponent.loose(SelectField, 'field'),
    ToggleGroupField: fieldComponent.loose(ToggleGroupField, 'field')
  },
  formComponents: {}
})

export const useAppForm = formHook.useAppForm
export const defineAppFieldGroup = formHook.defineAppFieldGroup
