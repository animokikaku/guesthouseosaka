import { LegalNoticeDialog } from '@/components/legal-notice-dialog'
import { fieldComponent } from '@/components/forms/field-brand'
import { useFieldControl } from '@/components/forms/fields/field-control'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import type { FieldWithValue } from '@tanstack/react-form'
import { useTranslations } from 'use-intl'
import type { ReactNode } from 'react'

function renderPrivacyPolicyLink(chunks: ReactNode, onAgree: () => void) {
  return <LegalNoticeDialog onAgree={onAgree}>{chunks}</LegalNoticeDialog>
}

interface PrivacyPolicyFieldProps {
  field: FieldWithValue<boolean>
}

function PrivacyPolicyField({ field }: PrivacyPolicyFieldProps) {
  const { isInvalid, ids, controlProps } = useFieldControl('checkbox', field)
  const labelId = `${ids.control}-label`
  const t = useTranslations('forms')

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldGroup data-slot="checkbox-group">
        <Field orientation="horizontal" data-invalid={isInvalid}>
          <Checkbox
            {...controlProps}
            name={field.name}
            nativeButton
            render={<button type="button" aria-labelledby={labelId} />}
            checked={field.value}
            onCheckedChange={(checked) => field.handleChange(checked)}
            onBlur={() => field.handleBlur()}
          />
          <FieldLabel
            id={labelId}
            htmlFor={ids.control}
            className="text-muted-foreground font-normal"
          >
            <span className="text-muted-foreground">
              {t.rich('fields.privacy_policy_agreement', {
                link: (chunks) => renderPrivacyPolicyLink(chunks, () => field.handleChange(true))
              })}
            </span>
          </FieldLabel>
        </Field>
      </FieldGroup>
      {isInvalid && <FieldError id={ids.error} errors={field.errors} />}
    </FieldSet>
  )
}

export default fieldComponent.loose(PrivacyPolicyField, 'field')
