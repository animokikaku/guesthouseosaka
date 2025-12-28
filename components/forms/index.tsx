/* eslint-disable react/no-children-prop */
'use client'

import { ResetButton, SubmitButton } from '@/components/forms/components'
import {
  CheckboxField,
  DateField,
  InputField,
  InputGroupField,
  MessageField,
  SelectField,
  ToggleGroupField
} from '@/components/forms/fields'
import { ContactFormFields } from '@/components/forms/schema'
import { HouseIcon } from '@/components/house-icon'
import { HouseIdentifier, HouseIdentifierValues } from '@/lib/types'
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

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxField,
    InputField,
    InputGroupField,
    ToggleGroupField,
    SelectField,
    MessageField,
    DateField
  },
  formComponents: {
    SubmitButton,
    ResetButton
  }
})

export const userAccountDefaultValues = {
  name: '',
  age: '',
  gender: '' as 'male' | 'female',
  nationality: '',
  email: '',
  phone: ''
} satisfies ContactFormFields['account']

export const FieldGroupUserAccount = withFieldGroup({
  defaultValues: userAccountDefaultValues,
  render: function Render({ group }) {
    const t = useTranslations('forms')

    return (
      <>
        <group.AppField
          name="gender"
          children={(field) => (
            <field.SelectField
              required
              orientation="responsive"
              label={t('fields.gender.label')}
              placeholder={t('fields.gender.placeholder')}
              description={t('fields.gender.description')}
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
              placeholder={t('fields.name.placeholder')}
              orientation="responsive"
              description={t('fields.name.description')}
              label={t('fields.name.label')}
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
              description={t('fields.age.description')}
              icon={<CakeIcon />}
              orientation="responsive"
              placeholder={t('fields.age.placeholder')}
              label={t('fields.age.label')}
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
              label={t('fields.nationality.label')}
              description={t('fields.nationality.description')}
              icon={<GlobeIcon />}
              type="text"
              placeholder={t('fields.nationality.placeholder')}
            />
          )}
        />
        <group.AppField
          name="email"
          children={(field) => (
            <field.InputGroupField
              required
              orientation="responsive"
              placeholder={t('fields.email.placeholder')}
              description={t('fields.email.description')}
              type="email"
              label={t('fields.email.label')}
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
              placeholder={t('fields.phone.placeholder')}
              type="tel"
              description={t('fields.phone.description')}
              label={
                <div>
                  {t('fields.phone.label')}{' '}
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

export type HouseTitles = NonNullable<HousesTitlesQueryResult>

export const FieldGroupPlaces = withFieldGroup({
  defaultValues: {
    places: [] as HouseIdentifier[]
  },
  props: {
    label: '',
    description: '',
    houseTitles: [] as HouseTitles
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
