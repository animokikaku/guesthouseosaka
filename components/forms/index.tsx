'use client'

import {
  DateField,
  InputField,
  InputGroupField,
  MessageField,
  PrivacyPolicyField,
  SelectField,
  ToggleGroupField
} from '@/components/forms/fields'
import type { ContactFormFields } from '@/components/forms/schema'
import { HouseIcon } from '@/components/house-icon'
import { HouseIdentifier } from '@/lib/types'
import type { FormFieldsConfig } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/utils/theme'
import { HousesTitlesQueryResult } from '@/sanity.types'
import { createFormHook, getFormHookHelpers } from '@tanstack/react-form'
import { CakeIcon, GlobeIcon, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export { useFormSubmit } from './use-form-submit'

export type HouseTitles = HousesTitlesQueryResult

const { fieldComponent } = getFormHookHelpers()

const formHook = createFormHook({
  fieldComponents: {
    DateField: fieldComponent.loose(DateField, 'field'),
    InputField: fieldComponent.loose(InputField, 'field'),
    InputGroupField: fieldComponent.loose(InputGroupField, 'field'),
    MessageField: fieldComponent.loose(MessageField, 'field'),
    PrivacyPolicyField: fieldComponent.loose(PrivacyPolicyField, 'field'),
    SelectField: fieldComponent.loose(SelectField, 'field'),
    ToggleGroupField: fieldComponent.loose(ToggleGroupField, 'field')
  },
  formComponents: {}
})

export const useAppForm = formHook.useAppForm
const defineAppFieldGroup = formHook.defineAppFieldGroup

const userAccountDefaultValues = {
  name: '',
  age: '',
  // The form starts unselected; schema validation narrows this before submission.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  gender: '' as 'male' | 'female',
  nationality: '',
  email: '',
  phone: ''
} satisfies ContactFormFields['account']

const userAccountFieldGroup = defineAppFieldGroup(({ strict }) => ({
  name: strict<string>(),
  age: strict<string>(),
  gender: strict<'male' | 'female'>(),
  nationality: strict<string>(),
  email: strict<string>(),
  phone: strict<string>()
}))

interface UserAccountFieldsProps {
  fields: typeof userAccountFieldGroup.fields
  config: FormFieldsConfig
}

function UserAccountFields({ fields, config }: UserAccountFieldsProps) {
  const t = useTranslations('forms')

  return (
    <>
      <fields.Field
        name="gender"
        children={(field) => (
          <field.SelectField
            required
            orientation="responsive"
            label={config.gender.label}
            placeholder={config.gender.placeholder}
            description={config.gender.description}
            options={[
              { label: t('fields.gender.options.male'), value: 'male' },
              { label: t('fields.gender.options.female'), value: 'female' }
            ]}
          />
        )}
      />
      <fields.Field
        name="name"
        children={(field) => (
          <field.InputGroupField
            required
            placeholder={config.name.placeholder}
            orientation="responsive"
            description={config.name.description}
            label={config.name.label}
            icon={<UserIcon />}
            type="text"
            autoComplete="name"
          />
        )}
      />
      <fields.Field
        name="age"
        children={(field) => (
          <field.InputGroupField
            required
            description={config.age.description}
            icon={<CakeIcon />}
            orientation="responsive"
            placeholder={config.age.placeholder}
            label={config.age.label}
            type="number"
            min={1}
            inputMode="numeric"
            autoComplete="off"
          />
        )}
      />
      <fields.Field
        name="nationality"
        children={(field) => (
          <field.InputGroupField
            required
            orientation="responsive"
            label={config.nationality?.label}
            description={config.nationality.description}
            icon={<GlobeIcon />}
            type="text"
            placeholder={config.nationality.placeholder}
            autoComplete="country-name"
          />
        )}
      />
      <fields.Field
        name="email"
        children={(field) => (
          <field.InputGroupField
            required
            orientation="responsive"
            placeholder={config.email.placeholder}
            description={config.email.description}
            type="email"
            label={config.email.label}
            icon={<MailIcon />}
            autoComplete="email"
            spellCheck={false}
          />
        )}
      />
      <fields.Field
        name="phone"
        children={(field) => (
          <field.InputGroupField
            orientation="responsive"
            placeholder={config.phone.placeholder}
            type="tel"
            description={config.phone.description}
            label={
              <div>
                {config.phone.label}{' '}
                <span className="text-muted-foreground text-xs">{t('fields.phone.optional')}</span>
              </div>
            }
            icon={<PhoneIcon />}
            autoComplete="tel"
          />
        )}
      />
    </>
  )
}

export const FieldGroupUserAccount = userAccountFieldGroup.bindComponent(
  UserAccountFields,
  'fields'
)

export const userAccountFieldBindings = {
  name: 'account.name',
  age: 'account.age',
  gender: 'account.gender',
  nationality: 'account.nationality',
  email: 'account.email',
  phone: 'account.phone'
} as const

const placesFieldGroup = defineAppFieldGroup(({ strict }) => ({
  places: strict<HouseIdentifier[]>()
}))

interface PlacesFieldsProps {
  fields: typeof placesFieldGroup.fields
  label: string
  description: string | undefined
  houseTitles: HousesTitlesQueryResult
}

function PlacesFields({ fields, description, label, houseTitles }: PlacesFieldsProps) {
  const placeOptions = houseTitles.map(({ slug, title }) => ({
    value: slug,
    label: (
      <>
        <HouseIcon name={slug} strokeWidth={1.25} />
        <span className="text-muted-foreground sm:text-inherit">{title ?? slug}</span>
      </>
    ),
    className: cn('data-pressed:bg-transparent', HOUSE_COLORS[slug].toggleSvg)
  }))

  return (
    <fields.Field
      name="places"
      children={(field) => (
        <field.ToggleGroupField label={label} description={description} options={placeOptions} />
      )}
    />
  )
}

export const FieldGroupPlaces = placesFieldGroup.bindComponent(PlacesFields, 'fields')

export const contactFormDefaultValues = {
  places: [] as HouseIdentifier[],
  account: userAccountDefaultValues,
  message: '',
  date: '',
  // These empty states are invalid until the user completes the form.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  privacyPolicy: false as ContactFormFields['privacyPolicy'],
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  stayDuration: '' as ContactFormFields['stayDuration'],
  hour: ''
} satisfies ContactFormFields
