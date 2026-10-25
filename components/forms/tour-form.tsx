import {
  contactFormDefaultValues,
  FieldGroupPlaces,
  FieldGroupUserAccount,
  userAccountFieldBindings,
  useAppForm,
  useFormSubmit
} from '@/components/forms'
import { FormCard } from '@/components/forms/form-card'
import { useTourFormSchema } from '@/components/forms/schema'
import { FieldSeparator } from '@/components/ui/field'
import type { ContactFormConfig } from '@/lib/types/components'
import type { HousesTitlesQueryResult } from '@/sanity.types'

interface TourFormProps extends ContactFormConfig {
  houseTitles: HousesTitlesQueryResult
}

export function TourForm({ title, description, fields, houseTitles }: TourFormProps) {
  const schema = useTourFormSchema()
  const { onSubmitInvalid, createOnSubmit } = useFormSubmit()
  const { places, account, message, date, hour, privacyPolicy } = contactFormDefaultValues

  const form = useAppForm({
    defaultValues: { places, account, message, date, hour, privacyPolicy },
    validators: [{ run: schema, triggers: [] }],
    onSubmitInvalid,
    onSubmit: createOnSubmit('tour')
  })

  return (
    <FormCard title={title} description={description} formId="tour-form" form={form}>
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
          <field.InputField required type="date" {...fields.date} orientation="responsive" />
        )}
      />
      <form.Field
        name="hour"
        children={(field) => (
          <field.InputField {...fields.hour} orientation="responsive" type="time" />
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
