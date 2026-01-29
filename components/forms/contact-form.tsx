/* eslint-disable react/no-children-prop */
'use client'

import {
  contactFormDefaultValues,
  FieldGroupPlaces,
  FieldGroupUserAccount,
  HouseTitles,
  useAppForm,
  useFormSubmit
} from '@/components/forms'
import { FormCard } from '@/components/forms/form-card'
import { useGeneralInquirySchema } from '@/components/forms/schema'
import { FieldSeparator } from '@/components/ui/field'
import type { ContactFormConfig } from '@/lib/types/components'

interface ContactFormProps extends ContactFormConfig {
  houseTitles: HouseTitles
}

export function ContactForm({
  title,
  description,
  fields,
  houseTitles
}: ContactFormProps) {
  const schema = useGeneralInquirySchema()
  const { onSubmitInvalid, createOnSubmit } = useFormSubmit()
  const { places, account, message, privacyPolicy } = contactFormDefaultValues

  const form = useAppForm({
    defaultValues: { places, account, message, privacyPolicy },
    validators: {
      onSubmit: schema
    },
    onSubmitInvalid,
    onSubmit: createOnSubmit('other')
  })

  return (
    <FormCard
      title={title}
      description={description}
      formId="other-form"
      form={form}
    >
      <FieldGroupPlaces
        fields={{ places: 'places' }}
        form={form}
        label={fields.places.label}
        description={fields.places.description}
        houseTitles={houseTitles}
      />
      <FieldSeparator />
      <FieldGroupUserAccount fields="account" form={form} config={fields} />
      <FieldSeparator />
      <form.AppField
        name="message"
        children={(field) => (
          <field.MessageField
            required
            label={fields.message.label}
            rows={6}
            className="min-h-24 resize-none"
            placeholder={fields.message.placeholder}
            description={fields.message.description}
          />
        )}
      />
      <form.AppField
        name="privacyPolicy"
        children={(field) => <field.PrivacyPolicyField />}
      />
    </FormCard>
  )
}
