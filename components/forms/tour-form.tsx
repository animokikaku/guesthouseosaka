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
import { useTourFormSchema } from '@/components/forms/schema'
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

type TourFormProps = {
  title?: string
  description?: string
}

export function TourForm({ title, description }: TourFormProps) {
  const t = useTranslations('forms')
  const router = useRouter()
  const schema = useTourFormSchema()
  const { places, account, message, date, hour, privacyPolicy } =
    contactFormDefaultValues

  const form = useAppForm({
    defaultValues: { places, account, message, date, hour, privacyPolicy },
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
      const promise = submitContactForm({ type: 'tour', data: value })

      toast.promise(promise, {
        loading: t('status.sending'),
        success: () => {
          router.push('/contact')
          return {
            message: t('status.success.message'),
            description: t('status.success.description', {
              name: value.account.name
            })
          }
        },
        error: (error) => {
          return {
            message: error.message || t('status.error.message'),
            description: t('status.error.description', {
              email: 'info@guesthouseosaka.com'
            })
          }
        }
      })
    }
  })

  return (
    <Card className="mx-auto w-full sm:max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
              label={t('fields.places.label')}
              description={t('fields.places.tour_description')}
            />
            <form.AppField
              name="date"
              children={(field) => (
                <field.DateField
                  required
                  label={t('fields.date.tour_label')}
                  description={t('fields.date.tour_description')}
                  orientation="responsive"
                />
              )}
            />
            <form.AppField
              name="hour"
              children={(field) => (
                <field.InputField
                  label={t('fields.hour.tour_label')}
                  description={t('fields.hour.tour_description')}
                  orientation="responsive"
                  className="sm:min-w-[220px]"
                  type="time"
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
                  placeholder={t('fields.message.contact_placeholder')}
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
                      {t.rich('fields.privacy_policy_agreement', {
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
            <form.SubmitButton form="tour-form" />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  )
}
