'use client'

import { ResetButton } from '@/components/forms/components/reset-button'
import { SubmitButton } from '@/components/forms/components/submit-button'
import {
  CheckboxField,
  DateField,
  InputField,
  InputGroupField,
  MessageField,
  PrivacyPolicyField,
  SelectField,
  ToggleGroupField
} from '@/components/forms/fields'
import { fieldContext, formContext } from '@/components/forms/form-context'
import { ContactFormFields } from '@/components/forms/schema'
import { HouseIcon } from '@/components/house-icon'
import { HouseIdentifier } from '@/lib/types'
import type { FormFieldsConfig } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/utils/theme'
import { HousesTitlesQueryResult } from '@/sanity.types'
import { createFormHook } from '@tanstack/react-form'
import { CakeIcon, GlobeIcon, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export { useFormSubmit } from './use-form-submit'

export type HouseTitles = HousesTitlesQueryResult

const formHook = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxField,
    DateField,
    InputField,
    InputGroupField,
    MessageField,
    PrivacyPolicyField,
    SelectField,
    ToggleGroupField
  },
  formComponents: {
    SubmitButton,
    ResetButton
  }
})

export const useAppForm = formHook.useAppForm
const withFieldGroup = formHook.withFieldGroup

const userAccountDefaultValues = {
  name: '',
  age: '',
  gender: '' as 'male' | 'female',
  nationality: '',
  email: '',
  phone: ''
} satisfies ContactFormFields['account']

export const FieldGroupUserAccount = withFieldGroup({
  defaultValues: userAccountDefaultValues,
  props: {
    config: {} as FormFieldsConfig
  },
  render: function Render({ group, config }) {
    const t = useTranslations('forms')

    return (
      <>
        <group.AppField
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
        <group.AppField
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
        <group.AppField
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
              autoComplete="age"
            />
          )}
        />
        <group.AppField
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
            />
          )}
        />
        <group.AppField
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
            />
          )}
        />
        <group.AppField
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
                  <span className="text-muted-foreground text-xs">
                    {t('fields.phone.optional')}
                  </span>
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
})

export const FieldGroupPlaces = withFieldGroup({
  defaultValues: {
    places: [] as HouseIdentifier[]
  },
  props: {
    label: '' as string | null | undefined,
    description: '' as string | null | undefined,
    houseTitles: [] as HousesTitlesQueryResult
  },
  render: function Render({ group, description, label, houseTitles }) {
    const placeOptions = houseTitles.map(({ slug, title }) => ({
      value: slug,
      label: (
        <>
          <HouseIcon name={slug} />
          {title ?? slug}
        </>
      ),
      className: cn('data-[state=on]:bg-transparent', HOUSE_COLORS[slug].toggleSvg)
    }))

    return (
      <group.AppField
        name="places"
        children={(field) => (
          <field.ToggleGroupField label={label} description={description} options={placeOptions} />
        )}
      />
    )
  }
})

export const contactFormDefaultValues = {
  places: [] as HouseIdentifier[],
  account: userAccountDefaultValues,
  message: '',
  date: '',
  privacyPolicy: false as ContactFormFields['privacyPolicy'],
  stayDuration: '' as ContactFormFields['stayDuration'],
  hour: ''
} satisfies ContactFormFields
