import { fieldComponent } from '@/components/forms/field-brand'
import {
  useFieldControl,
  type FieldOrientation,
  type FieldOwnedProps
} from '@/components/forms/fields/field-control'
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

type InputGroupTextareaFormProps = Omit<
  React.ComponentProps<typeof InputGroupTextarea>,
  FieldOwnedProps
>

interface MessageFieldProps extends InputGroupTextareaFormProps, FieldOrientation {
  field: FieldWithValue<string>
  label?: React.ReactNode
  description?: string | null
}

const MAX_LENGTH = 3000

function MessageField({
  field,
  label,
  description,
  orientation,
  required,
  ...props
}: MessageFieldProps) {
  const { isInvalid, ids, controlProps } = useFieldControl('message', field, description)
  const t = useTranslations('MessageField')

  return (
    <Field orientation={orientation} data-invalid={isInvalid}>
      <FieldContent>
        {label && (
          <FieldLabel htmlFor={ids.control} className="flex items-center gap-1">
            {label}
            {!required && (
              <>
                {/* Flex gap spaces it visually; the text space keeps the accessible name readable. */}{' '}
                <span className="text-muted-foreground text-xs">({t('optional_hint')})</span>
              </>
            )}
          </FieldLabel>
        )}
      </FieldContent>
      <InputGroup>
        <InputGroupTextarea
          maxLength={MAX_LENGTH}
          {...props}
          {...controlProps}
          name={field.name}
          value={field.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
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
      {description && <FieldDescription id={ids.description}>{description}</FieldDescription>}
      {isInvalid && <FieldError id={ids.error} errors={field.errors} />}
    </Field>
  )
}

export default fieldComponent.loose(MessageField, 'field')
