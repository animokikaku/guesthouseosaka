'use client'

import { useFieldValidation } from '@/components/forms/hooks'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type InputFormProps = Omit<
  React.ComponentProps<typeof Input>,
  'onChange' | 'onBlur' | 'value' | 'aria-invalid' | 'id' | 'name'
>

type Orientation = Pick<React.ComponentProps<typeof Field>, 'orientation'>

interface InputFieldProps extends InputFormProps, Orientation {
  label?: React.ReactNode
  description?: string | null
}

export function InputField({
  label,
  description,
  orientation,
  ...props
}: InputFieldProps) {
  const { field, isInvalid, errors } = useFieldValidation<string>()

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && (
          <FieldLabel htmlFor={`form-tanstack-input-${field.name}`}>
            {label}
          </FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={errors} />}
      </FieldContent>
      <Input
        id={`form-tanstack-input-${field.name}`}
        name={field.name}
        value={field.state.value}
        aria-invalid={isInvalid}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        {...props}
      />
    </Field>
  )
}
