/* eslint-disable react/no-children-prop */
'use client'

import { toast } from 'sonner'

import { submitContactForm } from '@/app/actions/contact'
import {
  contactFormDefaultValues,
  FieldGroupPlaces,
  FieldGroupUserAccount,
  useAppForm
} from '@/components/forms'
import {
  ContactFormFields,
  useMoveInFormSchema
} from '@/components/forms/schema'
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
import { useExtracted } from 'next-intl'

export function MoveInForm() {
  const t = useExtracted()
  const router = useRouter()
  const schema = useMoveInFormSchema()
  const { places, date, stayDuration, account, message, privacyPolicy } =
    contactFormDefaultValues

  const form = useAppForm({
    defaultValues: {
      places,
      date,
      stayDuration,
      account,
      message,
      privacyPolicy
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
      const promise = submitContactForm({ type: 'move-in', data: value })

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

  const stayDurationOptions: {
    value: ContactFormFields['stayDuration']
    label: string
  }[] = [
    {
      value: '1-month',
      label: t('1 month or more')
    },
    {
      value: '3-months',
      label: t('3 months or more')
    },
    {
      value: 'long-term',
      label: t('Long term')
    }
  ]

  return (
    <Card className="mx-auto w-full sm:max-w-2xl">
      <CardHeader>
        <CardTitle>{t('Move in request')}</CardTitle>
        <CardDescription>
          {t(
            'Ready to become a resident? Let us know your preferences and timeline.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="move-in-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <FieldGroupPlaces
              fields={{ places: 'places' }}
              form={form}
              label={t('Places')}
              description={t('Which places would you like to move in?')}
            />
            <form.AppField
              name="date"
              children={(field) => (
                <field.DateField
                  orientation="responsive"
                  label={t('Move-in date')}
                  description={t('When would you like to move in?')}
                />
              )}
            />
            <form.AppField
              name="stayDuration"
              children={(field) => (
                <field.SelectField
                  required
                  orientation="responsive"
                  label={t('Length of stay')}
                  description={t('How long would you like to stay?')}
                  placeholder={t('Choose a duration')}
                  options={stayDurationOptions}
                />
              )}
            />
            <FieldSeparator />
            <FieldGroupUserAccount fields="account" form={form} />
            <FieldSeparator />
            <form.AppField
              name="message"
              children={(field) => (
                <field.MessageField
                  label={t('Message')}
                  rows={6}
                  className="min-h-24 resize-none"
                  placeholder={t(
                    'Share any special requirements for your move-in or questions you might have.'
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
      <CardFooter className="flex flex-col gap-3">
        <Field orientation="horizontal">
          <form.AppForm>
            <form.ResetButton />
            <form.SubmitButton form="move-in-form" />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  )
}
