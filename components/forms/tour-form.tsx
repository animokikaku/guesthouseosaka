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
import { TourFormSchema } from './schema'

export function TourForm() {
  const t = useExtracted()
  const router = useRouter()
  const { places, account, message, date, hour, privacyPolicy } =
    contactFormDefaultValues

  const form = useAppForm({
    defaultValues: { places, account, message, date, hour, privacyPolicy },
    validators: {
      onSubmit: TourFormSchema
    },
    onSubmit: async ({ value }) => {
      const promise = submitContactForm({ type: 'tour', data: value })

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
              { email: 'noreply@guesthouseosaka.com' }
            )
          }
        }
      })
    }
  })

  return (
    <Card className="mx-auto w-full sm:max-w-2xl">
      <CardHeader>
        <CardTitle>{t('Tour request')}</CardTitle>
        <CardDescription>
          {t(
            'Schedule a visit to see our share houses and get a feel for what we offer.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="tour-form"
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
              description={t('Which places would you like to get a tour?')}
            />
            <form.AppField
              name="date"
              children={(field) => (
                <field.DateField
                  required
                  label={t('Tour date')}
                  description={t('When would you like to get a tour?')}
                  orientation="responsive"
                />
              )}
            />
            <form.AppField
              name="hour"
              children={(field) => (
                <field.InputField
                  label={t('Tour hour')}
                  description={t('Our operating hours are from 10AM to 8PM.')}
                  orientation="responsive"
                  className="sm:min-w-[220px]"
                  type="time"
                  min="10:00"
                  max="20:00"
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
      <CardFooter className="flex flex-col gap-3">
        <Field orientation="horizontal">
          <form.AppForm>
            <form.ResetButton />
            <form.SubmitButton form="tour-form" />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  )
}
