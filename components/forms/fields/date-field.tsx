'use client'

import * as React from 'react'

import { useFieldValidation } from '@/components/forms/hooks'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type InputFormProps = Omit<
  React.ComponentProps<typeof Input>,
  | 'type'
  | 'onChange'
  | 'onBlur'
  | 'value'
  | 'aria-invalid'
  | 'aria-describedby'
  | 'aria-errormessage'
  | 'id'
  | 'name'
>

interface DateFieldProps extends InputFormProps {
  label?: React.ReactNode
  description?: string | null
  orientation?: 'vertical' | 'horizontal' | 'responsive'
  min?: string
  step?: number | string
}

export function DateField({
  label,
  description,
  orientation,
  className,
  ...props
}: DateFieldProps) {
  const { field, isInvalid, errors } = useFieldValidation<string>()
  const instanceId = React.useId()
  const inputId = `form-tanstack-date-${instanceId}-${field.name}`
  const descriptionId = `${inputId}-description`
  const errorId = `${inputId}-error`

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
        {isInvalid && <FieldError id={errorId} errors={errors} />}
      </FieldContent>
      <Input
        type="date"
        id={inputId}
        name={field.name}
        value={field.state.value}
        aria-invalid={isInvalid}
        aria-describedby={
          [description ? descriptionId : null, isInvalid ? errorId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        aria-errormessage={isInvalid ? errorId : undefined}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        className={cn(
          'w-full min-w-0 @md/field-group:w-55 @md/field-group:min-w-55 @md/field-group:max-w-55',
          className
        )}
        {...props}
      />
    </Field>
  )
}
