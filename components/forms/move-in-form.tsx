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
import { useTranslations } from 'next-intl'

export function MoveInForm() {
  const t = useTranslations('forms')
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

  const stayDurationOptions: {
    value: ContactFormFields['stayDuration']
    label: string
  }[] = [
    {
      value: '1-month',
      label: t('moveInForm.durations.oneMonth')
    },
    {
      value: '3-months',
      label: t('moveInForm.durations.threeMonths')
    },
    {
      value: 'long-term',
      label: t('moveInForm.durations.longTerm')
    }
  ]

  return (
    <Card className="mx-auto w-full sm:max-w-2xl">
      <CardHeader>
        <CardTitle>{t('moveInForm.title')}</CardTitle>
        <CardDescription>{t('moveInForm.description')}</CardDescription>
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
              label={t('fields.places.label')}
              description={t('moveInForm.placesDescription')}
            />
            <form.AppField
              name="date"
              children={(field) => (
                <field.DateField
                  orientation="responsive"
                  label={t('moveInForm.moveInDateLabel')}
                  description={t('moveInForm.moveInDateDescription')}
                />
              )}
            />
            <form.AppField
              name="stayDuration"
              children={(field) => (
                <field.SelectField
                  required
                  orientation="responsive"
                  label={t('moveInForm.lengthOfStayLabel')}
                  description={t('moveInForm.lengthOfStayDescription')}
                  placeholder={t('moveInForm.lengthOfStayPlaceholder')}
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
                  label={t('fields.message.label')}
                  rows={6}
                  className="min-h-24 resize-none"
                  placeholder={t('fields.message.moveInPlaceholder')}
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
