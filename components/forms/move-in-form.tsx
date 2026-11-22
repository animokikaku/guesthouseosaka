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
import { toRoomOptions, type RoomsByHouse } from '@/lib/rooms'
import type { ContactFormFields } from '@/lib/schemas/contact-form'
import type { ContactFormConfig } from '@/lib/types/components'
import { HouseIdentifierValues, type HouseTitles } from '@/lib/types'
import { useSelector } from '@tanstack/react-form'
import { useTranslations } from 'use-intl'

interface MoveInFormProps extends ContactFormConfig {
  houseTitles: HouseTitles
  /** The rooms a visitor can ask for; without them, the form has no "Rooms" field. */
  rooms?: RoomsByHouse | null
  /** The room a house page's link asks for (see `roomKey`), chosen from the start when it's on offer. */
  room?: string
}

export function MoveInForm({
  title,
  description,
  fields,
  houseTitles,
  rooms,
  room
}: MoveInFormProps) {
  const t = useTranslations('forms')
  const schema = useMoveInFormSchema()
  const { onSubmitInvalid, createOnSubmit, turnstile } = useFormSubmit()
  const { stayDuration, account, message, privacyPolicy } = contactFormDefaultValues

  const options = rooms ? toRoomOptions(rooms, HouseIdentifierValues) : []
  // An address anyone can edit: only a room on offer counts.
  const asked = options.flatMap((house) => house.rooms).find(({ key }) => key === room)

  const form = useAppForm({
    defaultValues: {
      places: asked ? [asked.house] : contactFormDefaultValues.places,
      rooms: asked ? [asked.key] : contactFormDefaultValues.rooms,
      // A room that isn't free yet can't be moved into before its date.
      date: (asked && !asked.free && asked.availableFrom) || contactFormDefaultValues.date,
      stayDuration,
      account,
      message,
      privacyPolicy
    },
    validators: [{ run: schema, triggers: [] }],
    onSubmitInvalid,
    onSubmit: createOnSubmit('move-in')
  })

  // The "Rooms" field offers the rooms of the houses selected so far.
  const places = useSelector(form.atom, (state) => state.values.places)

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
    <FormCard
      title={title}
      description={description}
      formId="move-in-form"
      form={form}
      turnstile={turnstile}
    >
      <FieldGroupPlaces
        fields={{ places: 'places' }}
        form={form}
        label={fields.places.label}
        description={fields.places.description}
        houseTitles={houseTitles}
      />
      <form.Field
        name="rooms"
        children={(field) => (
          <field.RoomsField
            groups={houseTitles.flatMap((house) =>
              places.includes(house.slug)
                ? [
                    {
                      house: house.slug,
                      title: house.title ?? house.slug,
                      rooms: options.find((option) => option.house === house.slug)?.rooms ?? []
                    }
                  ]
                : []
            )}
          />
        )}
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
