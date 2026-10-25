import { fieldComponent } from '@/components/forms/field-brand'
import {
  FieldControlHeader,
  fieldControlWidthClass,
  useFieldControl,
  type FieldOrientation,
  type FieldOwnedProps
} from '@/components/forms/fields/field-control'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { FieldWithValue } from '@tanstack/react-form'

type InputFormProps = Omit<React.ComponentProps<typeof Input>, FieldOwnedProps>

interface InputFieldProps extends InputFormProps, FieldOrientation {
  field: FieldWithValue<string>
  label?: React.ReactNode
  description?: string | null
}

function InputField({
  field,
  label,
  description,
  orientation,
  className,
  ...props
}: InputFieldProps) {
  const { isInvalid, ids, controlProps } = useFieldControl('input', field, description)

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldControlHeader field={field} ids={ids} label={label} description={description} />
      <Input
        {...props}
        {...controlProps}
        name={field.name}
        value={field.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        className={cn(fieldControlWidthClass, className)}
      />
    </Field>
  )
}

export default fieldComponent.loose(InputField, 'field')
