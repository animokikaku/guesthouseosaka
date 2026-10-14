import { FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import type { FieldWithValue } from '@tanstack/react-form'
import { useId } from 'react'

type FieldState = Pick<FieldWithValue<string>, 'name' | 'meta' | 'errors'>

type FieldControlIds = { control: string; description: string; error: string }

/** Fixed control width once the field group is wide enough to lay fields out in a row. */
export const fieldControlWidthClass =
  'w-full min-w-0 @md/field-group:w-55 @md/field-group:min-w-55 @md/field-group:max-w-55'

/**
 * Ids and ARIA wiring tying a form control to its description and error.
 * Spread `controlProps` after any caller props so the generated relationships win.
 */
export function useFieldControl(kind: string, field: FieldState, description?: string | null) {
  const isInvalid = field.meta.isInvalid
  const control = `form-tanstack-${kind}-${useId()}-${field.name}`
  const ids: FieldControlIds = {
    control,
    description: `${control}-description`,
    error: `${control}-error`
  }

  return {
    isInvalid,
    ids,
    controlProps: {
      id: control,
      'aria-invalid': isInvalid,
      'aria-describedby':
        [description ? ids.description : null, isInvalid ? ids.error : null]
          .filter(Boolean)
          .join(' ') || undefined,
      'aria-errormessage': isInvalid ? ids.error : undefined
    }
  }
}

/** The label, description and error beside or above a control. */
export function FieldControlHeader({
  field,
  ids,
  label,
  description
}: {
  field: FieldState
  ids: FieldControlIds
  label?: React.ReactNode
  description?: string | null
}) {
  return (
    <FieldContent>
      {label && <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>}
      {description && <FieldDescription id={ids.description}>{description}</FieldDescription>}
      {field.meta.isInvalid && <FieldError id={ids.error} errors={field.errors} />}
    </FieldContent>
  )
}
