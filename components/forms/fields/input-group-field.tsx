import { fieldComponent } from '@/components/forms/field-brand'
import {
  FieldControlHeader,
  fieldControlWidthClass,
  useFieldControl
} from '@/components/forms/fields/field-control'
import { Field } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import type { FieldWithValue } from '@tanstack/react-form'

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
  const { isInvalid, ids, controlProps } = useFieldControl('input-group', field, description)

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldControlHeader field={field} ids={ids} label={label} description={description} />
      <InputGroup className={cn(fieldControlWidthClass, className)}>
        <InputGroupInput
          {...props}
          {...controlProps}
          name={field.name}
          value={field.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={() => field.handleBlur()}
        />
        {icon && <InputGroupAddon>{icon}</InputGroupAddon>}
      </InputGroup>
    </Field>
  )
}

export default fieldComponent.loose(InputGroupField, 'field')
