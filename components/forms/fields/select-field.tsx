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
  const items = options.map((option) => ({
    label: option.label,
    value: option.value
  }))

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && <FieldLabel htmlFor={`form-tanstack-select-${field.name}`}>{label}</FieldLabel>}
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={errors} />}
      </FieldContent>
      <Select
        items={items}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(typeof value === 'string' ? value : '')}
        {...props}
      >
        <SelectTrigger
          id={`form-tanstack-select-${field.name}`}
          aria-invalid={isInvalid}
          className={cn(
            'w-full min-w-0 @md/field-group:w-[220px] @md/field-group:min-w-[220px] @md/field-group:max-w-[220px]'
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
