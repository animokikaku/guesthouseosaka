import { fieldComponent } from '@/components/forms/field-brand'
import {
  FieldControlHeader,
  fieldControlWidthClass,
  useFieldControl,
  type FieldOrientation
} from '@/components/forms/fields/field-control'
import { Field } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { FieldWithValue } from '@tanstack/react-form'

type SelectProps = Omit<React.ComponentProps<typeof Select>, 'name' | 'value' | 'onValueChange'>

interface SelectFieldProps extends SelectProps, FieldOrientation {
  field: FieldWithValue<string>
  label?: string
  description?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

function SelectField({
  field,
  label,
  description,
  options,
  placeholder,
  orientation,
  ...props
}: SelectFieldProps) {
  const { isInvalid, ids, controlProps } = useFieldControl('select', field, description)

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldControlHeader field={field} ids={ids} label={label} description={description} />
      <Select
        items={options}
        name={field.name}
        value={field.value}
        onValueChange={(value) => field.handleChange(typeof value === 'string' ? value : '')}
        {...props}
      >
        <SelectTrigger {...controlProps} className={fieldControlWidthClass}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
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

export default fieldComponent.loose(SelectField, 'field')
