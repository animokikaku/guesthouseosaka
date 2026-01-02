'use client'

import * as React from 'react'

import { useFieldContext } from '@/components/forms'
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
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && (
          <FieldLabel htmlFor={`form-tanstack-date-${field.name}`}>
            {label}
          </FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
