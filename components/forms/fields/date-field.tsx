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
  'type' | 'onChange' | 'onBlur' | 'value' | 'aria-invalid' | 'id' | 'name'
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

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && <FieldLabel htmlFor={`form-tanstack-date-${field.name}`}>{label}</FieldLabel>}
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={errors} />}
      </FieldContent>
      <Input
        type="date"
        id={`form-tanstack-date-${field.name}`}
        name={field.name}
        value={field.state.value}
        aria-invalid={isInvalid}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        className={cn('sm:min-w-[220px]', className)}
        {...props}
      />
    </Field>
  )
}
