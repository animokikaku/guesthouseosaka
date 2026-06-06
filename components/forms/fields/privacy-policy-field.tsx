'use client'

import { useFieldValidation } from '@/components/forms/hooks'
import { LegalNoticeDialog } from '@/components/legal-notice-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

function renderPrivacyPolicyLink(chunks: ReactNode, onAgree: () => void) {
  return <LegalNoticeDialog onAgree={onAgree}>{chunks}</LegalNoticeDialog>
}

export function PrivacyPolicyField() {
  const { field, isInvalid, errors } = useFieldValidation<boolean>()
  const t = useTranslations('forms')

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldGroup data-slot="checkbox-group">
        <Field orientation="horizontal" data-invalid={isInvalid}>
          <Checkbox
            id={`form-tanstack-checkbox-${field.name}`}
            name={field.name}
            checked={field.state.value}
            aria-invalid={isInvalid}
            onCheckedChange={(checked) => field.handleChange(checked === true)}
            onBlur={() => field.handleBlur()}
          />
          <FieldLabel
            htmlFor={`form-tanstack-checkbox-${field.name}`}
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
      {isInvalid && <FieldError errors={errors} />}
    </FieldSet>
  )
}
