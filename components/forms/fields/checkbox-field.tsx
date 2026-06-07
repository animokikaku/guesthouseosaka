'use client'

import { useFieldValidation } from '@/components/forms/hooks'
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
  'id' | 'name' | 'checked' | 'onCheckedChange' | 'onBlur' | 'aria-invalid' | 'aria-labelledby'
>

interface CheckboxFieldProps extends CheckboxProps {
  label?: React.ReactNode
  legend?: React.ReactNode
  description?: string
}

export function CheckboxField({ label, description, legend, ...props }: CheckboxFieldProps) {
  const { field, isInvalid, errors } = useFieldValidation<boolean>()
  const checkboxId = `form-tanstack-checkbox-${field.name}`
  const labelId = `${checkboxId}-label`

  return (
    <FieldSet data-invalid={isInvalid}>
      {legend && <FieldLegend variant="label">{legend}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup data-slot="checkbox-group">
        <Field orientation="horizontal" data-invalid={isInvalid}>
          <Checkbox
            id={checkboxId}
            name={field.name}
            nativeButton
            render={<button type="button" aria-labelledby={labelId} />}
            checked={field.state.value}
            aria-labelledby={labelId}
            aria-invalid={isInvalid}
            onCheckedChange={(checked) => field.handleChange(checked === true)}
            onBlur={() => field.handleBlur()}
            {...props}
          />
          <FieldLabel
            id={labelId}
            htmlFor={checkboxId}
            className="text-muted-foreground font-normal"
          >
            {label}
          </FieldLabel>
        </Field>
      </FieldGroup>
      {isInvalid && <FieldError errors={errors} />}
    </FieldSet>
  )
}
