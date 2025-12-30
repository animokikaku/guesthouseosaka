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
import { useTourFormSchema } from '@/components/forms/schema'
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

interface TourFormProps extends ContactFormConfig {
  houseTitles: HouseTitles
}

export function TourForm({
  title,
  description,
  fields,
  houseTitles
}: TourFormProps) {
  const schema = useTourFormSchema()
  const { onSubmitInvalid, createOnSubmit } = useFormSubmit()
  const { places, account, message, date, hour, privacyPolicy } =
    contactFormDefaultValues

  const form = useAppForm({
    defaultValues: { places, account, message, date, hour, privacyPolicy },
    validators: {
      onSubmit: schema
    },
    onSubmitInvalid,
    onSubmit: createOnSubmit('tour')
  })

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
              label={fields.places.label}
              description={fields.places.description}
              houseTitles={houseTitles}
            />
            <form.AppField
              name="date"
              children={(field) => (
                <field.DateField
                  required
                  label={fields.date.label}
                  description={fields.date.description}
                  orientation="responsive"
                />
              )}
            />
            <form.AppField
              name="hour"
              children={(field) => (
                <field.InputField
                  label={fields.hour.label}
                  description={fields.hour.description}
                  orientation="responsive"
                  className="sm:min-w-[220px]"
                  type="time"
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
                  placeholder={fields.message.placeholder}
                  description={fields.message.description}
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
            <form.SubmitButton form="tour-form" />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  )
}
