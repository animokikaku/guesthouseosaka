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
import { cn } from '@/lib/utils'

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
  className,
  ...props
}: InputFieldProps) {
  const { field, isInvalid, errors } = useFieldValidation<string>()
  const inputId = `form-tanstack-input-${field.name}`
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
