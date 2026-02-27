import { useFieldValidation } from '@/components/forms/hooks'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

type InputFormProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  'onChange' | 'onBlur' | 'value' | 'aria-invalid' | 'id' | 'name'
>

type Orientation = Pick<React.ComponentProps<typeof Field>, 'orientation'>

interface InputGroupFieldProps extends InputFormProps, Orientation {
  label?: React.ReactNode
  description?: string
  icon?: React.ReactNode
}

export function InputGroupField({
  label,
  description,
  icon,
  orientation,
  className,
  ...props
}: InputGroupFieldProps) {
  const { field, isInvalid, errors } = useFieldValidation<string>()

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && (
          <FieldLabel htmlFor={`form-tanstack-input-group-${field.name}`}>{label}</FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={errors} />}
      </FieldContent>
      <InputGroup>
        <InputGroupInput
          id={`form-tanstack-input-group-${field.name}`}
          name={field.name}
          value={field.state.value}
          aria-invalid={isInvalid}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={() => field.handleBlur()}
          className={cn(className, 'min-w-[120px]')}
          {...props}
        />
        {icon && <InputGroupAddon>{icon}</InputGroupAddon>}
      </InputGroup>
    </Field>
  )
}
