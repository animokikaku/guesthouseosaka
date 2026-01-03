/* eslint-disable react/no-children-prop */
'use client'

import {
  contactFormDefaultValues,
  useAppForm,
  useFormSubmit
} from '@/components/forms'
import { FormCard } from '@/components/forms/form-card'
import { useGeneralInquirySchema } from '@/components/forms/schema'
import { FieldSeparator } from '@/components/ui/field'
import type { ContactFormConfig } from '@/lib/types/components'
import { MailIcon, UserIcon } from 'lucide-react'

type ContactFormProps = ContactFormConfig

export function ContactForm({ title, description, fields }: ContactFormProps) {
  const schema = useGeneralInquirySchema()
  const { onSubmitInvalid, createOnSubmit } = useFormSubmit()
  const { message, privacyPolicy, account } = contactFormDefaultValues

  const form = useAppForm({
    defaultValues: {
      message,
      privacyPolicy,
      account: { name: account.name, email: account.email }
    },
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
      <form.AppField
        name="account.name"
        children={(field) => (
          <field.InputGroupField
            required
            type="text"
            label={fields.name.label}
            placeholder={fields.name.placeholder}
            icon={<UserIcon />}
            autoComplete="name"
          />
        )}
      />
      <form.AppField
        name="account.email"
        children={(field) => (
          <field.InputGroupField
            required
            type="email"
            label={fields.email.label}
            placeholder={fields.email.placeholder}
            icon={<MailIcon />}
            autoComplete="email"
          />
        )}
      />
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
