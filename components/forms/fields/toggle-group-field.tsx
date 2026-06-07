import { useFieldValidation } from '@/components/forms/hooks'
import { FieldDescription, FieldError, FieldLegend, FieldSet } from '@/components/ui/field'
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
  description?: string | null
}

export function ToggleGroupField({
  label,
  options,
  description,
  className,
  ...props
}: ToggleGroupFieldProps) {
  const { field, isInvalid, errors } = useFieldValidation<string[]>()

  return (
    <FieldSet data-invalid={isInvalid}>
      {label && <FieldLegend variant="label">{label}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <ToggleGroup
        multiple
        data-slot="checkbox-group"
        variant="outline"
        className={cn(
          'grid w-full max-w-88 grid-cols-3 items-stretch sm:flex sm:w-fit sm:max-w-none sm:flex-row sm:items-center',
          className
        )}
        spacing={2}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        onBlur={() => field.handleBlur()}
        {...props}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            name={field.name}
            value={option.value}
            aria-invalid={isInvalid}
            className={cn(
              'h-auto w-full min-w-0 flex-col gap-2 rounded-xl px-3 py-3 text-center text-[11px] leading-none whitespace-nowrap max-[360px]:text-[10px] sm:h-9 sm:w-auto sm:min-w-9 sm:flex-row sm:rounded-md sm:px-2.5 sm:py-0 sm:text-left sm:text-sm sm:leading-normal [&_svg:not([class*=size-])]:size-7 sm:[&_svg:not([class*=size-])]:size-4',
              option.className
            )}
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {isInvalid && <FieldError errors={errors} />}
    </FieldSet>
  )
}
