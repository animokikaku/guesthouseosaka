import { useFieldContext } from '@/components/forms'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea
} from '@/components/ui/input-group'
import { useTranslations } from 'next-intl'

type InputGroupTextareaFormProps = Omit<
  React.ComponentProps<typeof InputGroupTextarea>,
  'onChange' | 'onBlur' | 'value' | 'aria-invalid' | 'id' | 'name'
>

type Orientation = Pick<React.ComponentProps<typeof Field>, 'orientation'>

interface MessageFieldProps extends InputGroupTextareaFormProps, Orientation {
  label?: React.ReactNode
  description?: string
}

const MAX_LENGTH = 3000

export function MessageField({
  label,
  description,
  orientation,
  required,
  ...props
}: MessageFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const t = useTranslations()

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && (
          <FieldLabel
            htmlFor={`form-tanstack-message-${field.name}`}
            className="flex items-center gap-1"
          >
            {label}
            {!required && (
              <span className="text-muted-foreground text-xs">
                ({t('common.optional')})
              </span>
            )}
          </FieldLabel>
        )}
      </FieldContent>
      <InputGroup>
        <InputGroupTextarea
          aria-invalid={isInvalid}
          id={`form-tanstack-message-${field.name}`}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...props}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {t('common.charactersCounter', {
              count: `${field.state.value.length}`,
              max: `${MAX_LENGTH}`
            })}
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
