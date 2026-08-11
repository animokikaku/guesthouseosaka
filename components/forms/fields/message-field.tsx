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
import type { FieldWithValue } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { useId } from 'react'

type InputGroupTextareaFormProps = Omit<
  React.ComponentProps<typeof InputGroupTextarea>,
  'onChange' | 'onBlur' | 'value' | 'aria-invalid' | 'id' | 'name'
>

type Orientation = Pick<React.ComponentProps<typeof Field>, 'orientation'>

interface MessageFieldProps extends InputGroupTextareaFormProps, Orientation {
  field: FieldWithValue<string>
  label?: React.ReactNode
  description?: string | null
}

const MAX_LENGTH = 3000

export function MessageField({
  field,
  label,
  description,
  orientation,
  required,
  ...props
}: MessageFieldProps) {
  const isInvalid = field.meta.isInvalid
  const instanceId = useId()
  const inputId = `form-tanstack-message-${instanceId}-${field.name}`
  const t = useTranslations('MessageField')

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && (
          <FieldLabel htmlFor={inputId} className="flex items-center gap-1">
            {label}
            {!required && (
              <span className="text-muted-foreground text-xs">({t('optional_hint')})</span>
            )}
          </FieldLabel>
        )}
      </FieldContent>
      <InputGroup>
        <InputGroupTextarea
          aria-invalid={isInvalid}
          id={inputId}
          name={field.name}
          maxLength={MAX_LENGTH}
          value={field.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...props}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums" aria-live="polite">
            {t('character_counter', {
              count: `${field.value.length}`,
              max: `${MAX_LENGTH}`
            })}
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.errors} />}
    </Field>
  )
}
