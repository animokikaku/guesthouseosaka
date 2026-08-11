import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import type { FieldWithValue } from '@tanstack/react-form'
import { useId } from 'react'

type InputFormProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  | 'onChange'
  | 'onBlur'
  | 'value'
  | 'aria-invalid'
  | 'aria-describedby'
  | 'aria-errormessage'
  | 'id'
  | 'name'
>

type Orientation = Pick<React.ComponentProps<typeof Field>, 'orientation'>

interface InputGroupFieldProps extends InputFormProps, Orientation {
  field: FieldWithValue<string>
  label?: React.ReactNode
  description?: string
  icon?: React.ReactNode
}

export function InputGroupField({
  field,
  label,
  description,
  icon,
  orientation,
  className,
  ...props
}: InputGroupFieldProps) {
  const isInvalid = field.meta.isInvalid
  const instanceId = useId()
  const inputId = `form-tanstack-input-group-${instanceId}-${field.name}`
  const descriptionId = `${inputId}-description`
  const errorId = `${inputId}-error`

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
        {isInvalid && <FieldError id={errorId} errors={field.errors} />}
      </FieldContent>
      <InputGroup
        className={cn(
          'w-full min-w-0 @md/field-group:w-55 @md/field-group:min-w-55 @md/field-group:max-w-55',
          className
        )}
      >
        <InputGroupInput
          {...props}
          id={inputId}
          name={field.name}
          value={field.value}
          aria-invalid={isInvalid}
          aria-describedby={
            [description ? descriptionId : null, isInvalid ? errorId : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-errormessage={isInvalid ? errorId : undefined}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={() => field.handleBlur()}
        />
        {icon && <InputGroupAddon>{icon}</InputGroupAddon>}
      </InputGroup>
    </Field>
  )
}
