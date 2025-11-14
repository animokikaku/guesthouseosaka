'use client'

import { useFieldContext } from '@/components/forms'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field'

type CheckboxProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  'id' | 'name' | 'checked' | 'onCheckedChange' | 'onBlur' | 'aria-invalid'
>

interface CheckboxFieldProps extends CheckboxProps {
  label?: React.ReactNode
  legend?: React.ReactNode
  description?: string
}

export function CheckboxField({
  label,
  description,
  legend,
  ...props
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet data-invalid={isInvalid}>
      {legend && <FieldLegend variant="label">{legend}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup data-slot="checkbox-group">
        <Field orientation="horizontal" data-invalid={isInvalid}>
          <Checkbox
            id={`form-tanstack-checkbox-${field.name}`}
            name={field.name}
            checked={field.state.value}
            aria-invalid={isInvalid}
            onCheckedChange={(checked) => field.handleChange(checked === true)}
            onBlur={() => field.handleBlur()}
            {...props}
          />
          <FieldLabel
            htmlFor={`form-tanstack-checkbox-${field.name}`}
            className="text-muted-foreground font-normal"
          >
            {label}
          </FieldLabel>
        </Field>
      </FieldGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  )
}
