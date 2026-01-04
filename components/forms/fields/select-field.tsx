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
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type SelectProps = Omit<
  React.ComponentProps<typeof Select>,
  'name' | 'value' | 'onValueChange'
>

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

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && (
          <FieldLabel htmlFor={`form-tanstack-select-${field.name}`}>
            {label}
          </FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={errors} />}
      </FieldContent>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        {...props}
      >
        <SelectTrigger
          id={`form-tanstack-select-${field.name}`}
          aria-invalid={isInvalid}
          className="min-w-[120px] sm:min-w-[220px]"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
