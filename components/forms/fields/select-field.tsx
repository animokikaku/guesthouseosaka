import { useFieldValidation } from '@/components/forms/hooks'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useId } from 'react'

type SelectProps = Omit<React.ComponentProps<typeof Select>, 'name' | 'value' | 'onValueChange'>

type Orientation = Pick<React.ComponentProps<typeof Field>, 'orientation'>

interface SelectFieldProps extends SelectProps, Orientation {
  label?: string
  description?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({
  label,
  description,
  options,
  placeholder,
  orientation,
  ...props
}: SelectFieldProps) {
  const { field, isInvalid, errors } = useFieldValidation<string>()
  const instanceId = useId()
  const triggerId = `form-tanstack-select-${instanceId}-${field.name}`
  const descriptionId = `${triggerId}-description`
  const errorId = `${triggerId}-error`
  const items = options.map((option) => ({
    label: option.label,
    value: option.value
  }))

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>}
        {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
        {isInvalid && <FieldError id={errorId} errors={errors} />}
      </FieldContent>
      <Select
        items={items}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(typeof value === 'string' ? value : '')}
        {...props}
      >
        <SelectTrigger
          id={triggerId}
          aria-invalid={isInvalid}
          aria-describedby={
            [description ? descriptionId : null, isInvalid ? errorId : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-errormessage={isInvalid ? errorId : undefined}
          className={cn(
            'w-full min-w-0 @md/field-group:w-55 @md/field-group:min-w-55 @md/field-group:max-w-55'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
