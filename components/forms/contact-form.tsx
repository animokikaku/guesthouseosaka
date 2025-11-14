/* eslint-disable react/no-children-prop */
'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { contactFormDefaultValues, useAppForm } from '@/components/forms'
import { AccountSchema, ContactFormSchema } from '@/components/forms/schema'
import { LegalNoticeDialog } from '@/components/legal-notice-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { MailIcon, UserIcon } from 'lucide-react'
import { useExtracted } from 'next-intl'
import z from 'zod'

const MIN_MESSAGE_LENGTH = 5
const MAX_MESSAGE_LENGTH = 3000

export function ContactForm() {
  const t = useExtracted()
  const { message, privacyPolicy, account } = contactFormDefaultValues

  const formSchema = React.useMemo(
    () =>
      ContactFormSchema.pick({ privacyPolicy: true }).extend({
        account: AccountSchema.pick({ name: true, email: true }),
        message: z
          .string()
          .min(
            MIN_MESSAGE_LENGTH,
            t('Message must be at least {min} characters.', {
              min: `${MIN_MESSAGE_LENGTH}`
            })
          )
          .max(
            MAX_MESSAGE_LENGTH,
            t('Message must be at most {max} characters.', {
              max: `${MAX_MESSAGE_LENGTH}`
            })
          )
      }),
    [t]
  )

  const form = useAppForm({
    defaultValues: {
      message,
      privacyPolicy,
      account: { name: account.name, email: account.email }
    },
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      toast('You submitted the following values:', {
        description: (
          <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2'
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)'
        } as React.CSSProperties
      })
    }
  })

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{t('General inquiry')}</CardTitle>
        <CardDescription>
          {t(
            "Have questions about our services, pricing, or anything else? We're here to help."
          )}
        </CardDescription>
      </CardHeader>
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
                  label={t('Name')}
                  placeholder={t('Enter your name')}
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
                  label={t('Email')}
                  placeholder={t('Enter your email')}
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
                  label={t('Message')}
                  rows={6}
                  className="min-h-24 resize-none"
                  placeholder={t(
                    'Let us know any additional information or questions.'
                  )}
                  description={t(
                    'Do not include sensitive information such as your home address or credit card number.'
                  )}
                />
              )}
            />
            <form.AppField
              name="privacyPolicy"
              children={(field) => (
                <field.CheckboxField
                  required
                  label={
                    <p className="text-muted-foreground">
                      {t.rich(
                        'By submitting this form, you agree to the <link>Privacy Policy, Terms of Use, and Disclaimer</link>.',
                        {
                          link: (chunks) => (
                            <LegalNoticeDialog>{chunks}</LegalNoticeDialog>
                          )
                        }
                      )}
                    </p>
                  }
                />
              )}
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
