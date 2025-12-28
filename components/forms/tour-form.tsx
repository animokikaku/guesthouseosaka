/* eslint-disable react/no-children-prop */
'use client'

import {
  contactFormDefaultValues,
  FieldGroupPlaces,
  FieldGroupUserAccount,
  FormCard,
  HouseTitles,
  PrivacyPolicyField,
  useAppForm,
  useFormSubmit
} from '@/components/forms'
import { useTourFormSchema } from '@/components/forms/schema'
import { FieldGroup, FieldSeparator } from '@/components/ui/field'
import { ContactTypeQueryResult } from '@/sanity.types'
import { useTranslations } from 'next-intl'

type TourFormProps = {
  title?: NonNullable<ContactTypeQueryResult>['title']
  description?: NonNullable<ContactTypeQueryResult>['description']
  houseTitles: HouseTitles
}

export function TourForm({ title, description, houseTitles }: TourFormProps) {
  const t = useTranslations('forms')
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
    <FormCard
      title={title}
      description={description}
      formId="tour-form"
      onSubmit={form.handleSubmit}
      className="sm:max-w-2xl"
      footerClassName="flex flex-col gap-3"
      footer={
        <form.AppForm>
          <form.ResetButton />
          <form.SubmitButton form="tour-form" />
        </form.AppForm>
      }
    >
      <FieldGroup>
        <FieldGroupPlaces
          fields={{ places: 'places' }}
          form={form}
          label={t('fields.places.label')}
          description={t('fields.places.tour_description')}
          houseTitles={houseTitles}
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
        <PrivacyPolicyField fields={{ privacyPolicy: 'privacyPolicy' }} form={form} />
      </FieldGroup>
    </FormCard>
  )
}
