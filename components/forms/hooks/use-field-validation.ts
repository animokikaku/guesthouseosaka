'use client'

import { useFieldContext } from '@/components/forms/form-context'

/**
 * Hook that provides field context with computed validation state.
 * Reduces boilerplate in field components by centralizing the
 * isTouched && !isValid pattern.
 */
export function useFieldValidation<T>() {
  const field = useFieldContext<T>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const errors = field.state.meta.errors

  return {
    field,
    isInvalid,
    errors
  }
}
