import { useFieldContext } from '@/components/forms'
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet
} from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

type ToggleGroupOption = {
  value: string
  label?: React.ReactNode
  description?: React.ReactNode
  className?: string
}

interface ToggleGroupFieldProps extends Omit<
  React.ComponentProps<typeof ToggleGroup>,
  'value' | 'onValueChange' | 'onBlur' | 'type' | 'defaultValue'
> {
  label?: React.ReactNode
  options: ToggleGroupOption[]
  description?: string
}

export function ToggleGroupField({
  label,
  options,
  description,
  className,
  ...props
}: ToggleGroupFieldProps) {
  const field = useFieldContext<string[]>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet data-invalid={isInvalid}>
      {label && <FieldLegend variant="label">{label}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <ToggleGroup
        type="multiple"
        data-slot="checkbox-group"
        variant="outline"
        className={cn('flex flex-col items-start sm:flex-row', className)}
        spacing={2}
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={() => field.handleBlur()}
        {...props}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            name={field.name}
            value={option.value}
            aria-invalid={isInvalid}
            className={option.className}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  )
}
