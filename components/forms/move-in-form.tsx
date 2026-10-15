'use client'

import {
  contactFormDefaultValues,
  FieldGroupPlaces,
  FieldGroupUserAccount,
  userAccountFieldBindings,
  useAppForm,
  useFormSubmit
} from '@/components/forms'
import { FormCard } from '@/components/forms/form-card'
import { useMoveInFormSchema } from '@/components/forms/schema'
import { FieldSeparator } from '@/components/ui/field'
import type { ContactFormFields } from '@/lib/schemas/contact-form'
import type { ContactFormConfig } from '@/lib/types/components'
import type { HousesTitlesQueryResult } from '@/sanity.types'
import { useTranslations } from 'next-intl'

interface MoveInFormProps extends ContactFormConfig {
  houseTitles: HousesTitlesQueryResult
}

export function MoveInForm({ title, description, fields, houseTitles }: MoveInFormProps) {
  const t = useTranslations('forms')
  const schema = useMoveInFormSchema()
  const { onSubmitInvalid, createOnSubmit } = useFormSubmit()
  const { places, date, stayDuration, account, message, privacyPolicy } = contactFormDefaultValues

  const form = useAppForm({
    defaultValues: {
      places,
      date,
      stayDuration,
      account,
      message,
      privacyPolicy
    },
    validators: [{ run: schema, triggers: [] }],
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
    <FormCard title={title} description={description} formId="move-in-form" form={form}>
      <FieldGroupPlaces
        fields={{ places: 'places' }}
        form={form}
        label={fields.places.label}
        description={fields.places.description}
        houseTitles={houseTitles}
      />
      <form.Field
        name="date"
        children={(field) => (
          <field.InputField required type="date" orientation="responsive" {...fields.date} />
        )}
      />
      <form.Field
        name="stayDuration"
        children={(field) => (
          <field.SelectField
            required
            orientation="responsive"
            {...fields.stayDuration}
            options={stayDurationOptions}
          />
        )}
      />
      <FieldSeparator />
      <FieldGroupUserAccount fields={userAccountFieldBindings} form={form} config={fields} />
      <FieldSeparator />
      <form.Field
        name="message"
        children={(field) => (
          <field.MessageField {...fields.message} rows={6} className="min-h-24 resize-none" />
        )}
      />
      <form.Field name="privacyPolicy" children={(field) => <field.PrivacyPolicyField />} />
    </FormCard>
  )
}
