/* eslint-disable react/no-children-prop */
'use client'

import {
  contactFormDefaultValues,
  FormCard,
  useAppForm,
  useFormSubmit
} from '@/components/forms'
import { useGeneralInquirySchema } from '@/components/forms/schema'
import { FieldGroup, FieldSeparator } from '@/components/ui/field'
import { ContactTypeQueryResult } from '@/sanity.types'
import { MailIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type ContactFormProps = {
  title?: NonNullable<ContactTypeQueryResult>['title']
  description?: NonNullable<ContactTypeQueryResult>['description']
}

export function ContactForm({ title, description }: ContactFormProps) {
  const t = useTranslations('forms')
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
      onSubmit={form.handleSubmit}
      footer={
        <form.AppForm>
          <form.ResetButton />
          <form.SubmitButton form="other-form" />
        </form.AppForm>
      }
    >
      <FieldGroup>
        <form.AppField
          name="account.name"
          children={(field) => (
            <field.InputGroupField
              required
              type="text"
              label={t('fields.name.label')}
              placeholder={t('fields.name.placeholder')}
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
              label={t('fields.email.label')}
              placeholder={t('fields.email.placeholder')}
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
              label={t('fields.message.label')}
              rows={6}
              className="min-h-24 resize-none"
              placeholder={t('fields.message.contact_placeholder')}
              description={t('fields.message.description')}
            />
          )}
        />
        <form.AppField
          name="privacyPolicy"
          children={(field) => <field.PrivacyPolicyField />}
        />
      </FieldGroup>
    </FormCard>
  )
}
