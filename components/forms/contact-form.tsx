/* eslint-disable react/no-children-prop */
'use client'

import { submitContactForm } from '@/app/actions/contact'
import { contactFormDefaultValues, useAppForm } from '@/components/forms'
import { useGeneralInquirySchema } from '@/components/forms/schema'
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
import { useRouter } from '@/i18n/navigation'
import { MailIcon, UserIcon } from 'lucide-react'
import { useExtracted } from 'next-intl'
import { toast } from 'sonner'

export function ContactForm() {
  const t = useExtracted()
  const router = useRouter()
  const schema = useGeneralInquirySchema()
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
    onSubmit: async ({ value }) => {
      const promise = submitContactForm({ type: 'other', data: value })

      toast.promise(promise, {
        loading: t('Sending message...'),
        success: () => {
          router.push('/contact')
          return {
            message: t('Message sent successfully!'),
            description: t(
              'Thank you for contacting us {name}. We will get back to you shortly.',
              { name: value.account.name }
            )
          }
        },
        error: (error) => {
          return {
            message: error.message || t('Failed to send message.'),
            description: t(
              'Please try again later or contact us directly at {email}.',
              { email: 'info@guesthouseosaka.com' }
            )
          }
        }
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
                        'By submitting this form, you agree to the <link>Privacy Policy</link>.',
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
