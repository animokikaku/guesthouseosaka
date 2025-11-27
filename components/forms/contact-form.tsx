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
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function ContactForm() {
  const t = useTranslations('forms')
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
    onSubmitInvalid: () => {
      const firstErrorInput = document.querySelector(
        '[aria-invalid="true"]'
      ) as HTMLElement | null
      firstErrorInput?.focus()
    },
    onSubmit: async ({ value }) => {
      const promise = submitContactForm({ type: 'other', data: value })

      toast.promise(promise, {
        loading: t('status.sending'),
        success: () => {
          router.push('/contact')
          return {
            message: t('status.success'),
            description: t('status.successDescription', {
              name: value.account.name
            })
          }
        },
        error: (error) => {
          return {
            message: error.message || t('status.failure'),
            description: t('status.errorDescription', {
              email: 'info@guesthouseosaka.com'
            })
          }
        }
      })
    }
  })

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{t('contactForm.title')}</CardTitle>
        <CardDescription>{t('contactForm.description')}</CardDescription>
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
                  placeholder={t('fields.message.contactPlaceholder')}
                  description={t('fields.message.description')}
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
                      {t.rich('fields.privacyPolicyAgreement', {
                        link: (chunks) => (
                          <LegalNoticeDialog>{chunks}</LegalNoticeDialog>
                        )
                      })}
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
