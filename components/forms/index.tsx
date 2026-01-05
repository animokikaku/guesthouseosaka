/* eslint-disable react/no-children-prop */
'use client'

import { ResetButton, SubmitButton } from '@/components/forms/components'
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
import { ContactFormFields } from '@/components/forms/schema'
import { HouseIcon } from '@/components/house-icon'
import { HouseIdentifier, HouseIdentifierValues } from '@/lib/types'
import type { FormFieldsConfig } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { HousesTitlesQueryResult } from '@/sanity.types'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import {
  CakeIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  UserIcon
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export { ContactForm } from './contact-form'
export { MoveInForm } from './move-in-form'
export { TourForm } from './tour-form'
export { useFormSubmit } from './use-form-submit'

export type HouseTitles = HousesTitlesQueryResult

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export { useFieldContext, useFormContext }

export const { useAppForm, withFieldGroup } = createFormHook({
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
    const classNames: Record<HouseIdentifier, string> = {
      orange:
        'data-[state=on]:*:[svg]:fill-orange-500 data-[state=on]:*:[svg]:stroke-orange-500',
      apple:
        'data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500',
      lemon:
        'data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500'
    }

    const placeOptions = HouseIdentifierValues.map((house) => {
      const houseData = houseTitles.find((h) => h.slug === house)
      return {
        value: house,
        label: (
          <>
            <HouseIcon name={house} />
            {houseData?.title ?? house}
          </>
        ),
        className: cn('data-[state=on]:bg-transparent', classNames[house])
      }
    })

    return (
      <group.AppField
        name="places"
        children={(field) => (
          <field.ToggleGroupField
            label={label}
            description={description}
            options={placeOptions}
          />
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
