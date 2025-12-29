/* eslint-disable react/no-children-prop */
'use client'

import {
  contactFormDefaultValues,
  useAppForm,
  useFormSubmit
} from '@/components/forms'
import { useGeneralInquirySchema } from '@/components/forms/schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field'
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
    <Card className="mx-auto w-full max-w-2xl">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form
          id="other-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField
              name="account.name"
              children={(field) => (
                <field.InputGroupField
                  required
                  type="text"
                  label={fields.name?.label}
                  placeholder={fields.name?.placeholder ?? undefined}
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
                  label={fields.email?.label}
                  placeholder={fields.email?.placeholder ?? undefined}
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
                  label={fields.message?.label}
                  rows={6}
                  className="min-h-24 resize-none"
                  placeholder={fields.message?.placeholder ?? undefined}
                  description={fields.message?.description ?? undefined}
                />
              )}
            />
            <form.AppField
              name="privacyPolicy"
              children={(field) => <field.PrivacyPolicyField />}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <form.AppForm>
            <form.ResetButton />
            <form.SubmitButton form="other-form" />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  )
}
