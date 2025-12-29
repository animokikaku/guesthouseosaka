/* eslint-disable react/no-children-prop */
'use client'

import {
  contactFormDefaultValues,
  FieldGroupPlaces,
  FieldGroupUserAccount,
  HouseTitles,
  useAppForm,
  useFormSubmit
} from '@/components/forms'
import {
  ContactFormFields,
  useMoveInFormSchema
} from '@/components/forms/schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { ContactTypeQueryResult } from '@/sanity.types'
import { useTranslations } from 'next-intl'

type MoveInFormProps = {
  title: NonNullable<ContactTypeQueryResult>['title']
  description: NonNullable<ContactTypeQueryResult>['description']
  fields: NonNullable<ContactTypeQueryResult>['fields']
  houseTitles: HouseTitles
}

export function MoveInForm({
  title,
  description,
  fields,
  houseTitles
}: MoveInFormProps) {
  const t = useTranslations('forms')
  const schema = useMoveInFormSchema()
  const { onSubmitInvalid, createOnSubmit } = useFormSubmit()
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
    onSubmitInvalid,
    onSubmit: createOnSubmit('move-in')
  })

  // Stay duration options still use translations for the option labels
  const stayDurationOptions: {
    value: ContactFormFields['stayDuration']
    label: string
  }[] = [
    {
      value: '1-month',
      label: t('fields.stay_duration.options.one_month')
    },
    {
      value: '3-months',
      label: t('fields.stay_duration.options.three_month')
    },
    {
      value: 'long-term',
      label: t('fields.stay_duration.options.long_term')
    }
  ]

  return (
    <Card className="mx-auto w-full sm:max-w-2xl">
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
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
              label={fields.places.label ?? ''}
              description={fields.places.description ?? ''}
              houseTitles={houseTitles}
            />
            <form.AppField
              name="date"
              children={(field) => (
                <field.DateField
                  orientation="responsive"
                  label={fields.date.label}
                  description={fields.date.description ?? undefined}
                />
              )}
            />
            <form.AppField
              name="stayDuration"
              children={(field) => (
                <field.SelectField
                  required
                  orientation="responsive"
                  label={fields.stayDuration.label ?? undefined}
                  description={fields.stayDuration.description ?? undefined}
                  placeholder={fields.stayDuration.placeholder ?? undefined}
                  options={stayDurationOptions}
                />
              )}
            />
            <FieldSeparator />
            <FieldGroupUserAccount
              fields="account"
              form={form}
              config={fields}
            />
            <FieldSeparator />
            <form.AppField
              name="message"
              children={(field) => (
                <field.MessageField
                  label={fields.message.label}
                  rows={6}
                  className="min-h-24 resize-none"
                  placeholder={fields.message.placeholder ?? undefined}
                  description={fields.message.description ?? undefined}
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
