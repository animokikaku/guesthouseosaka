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
import { AccountFields, ContactFormFields } from '@/components/forms/schema'
import { HouseIcon } from '@/components/house-icon'
import { HouseIdentifier } from '@/lib/types'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import {
  CakeIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  UserIcon
} from 'lucide-react'
import { useExtracted } from 'next-intl'
import router from 'next/dist/client/router'
import { toast } from 'sonner'

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
} satisfies AccountFields

export const FieldGroupUserAccount = withFieldGroup({
  defaultValues: userAccountDefaultValues,
  render: function Render({ group }) {
    const t = useExtracted()

    return (
      <>
        <group.AppField
          name="gender"
          children={(field) => (
            <field.SelectField
              required
              orientation="responsive"
              label={t('Gender')}
              placeholder={t('Select your gender')}
              description={t('What is your gender?')}
              options={[
                { label: t('Male'), value: 'male' },
                { label: t('Female'), value: 'female' }
              ]}
            />
          )}
        />
        <group.AppField
          name="name"
          children={(field) => (
            <field.InputGroupField
              required
              placeholder={t('Enter your name')}
              orientation="responsive"
              description={t('How should we address you?')}
              label={t('Name')}
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
              description={t('How old are you?')}
              icon={<CakeIcon />}
              orientation="responsive"
              placeholder={t('Enter your age')}
              label={t('Age')}
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
              label={t('Nationality')}
              description={t('Let us know your nationality.')}
              icon={<GlobeIcon />}
              type="text"
              placeholder={t('Japanese')}
            />
          )}
        />
        <group.AppField
          name="email"
          children={(field) => (
            <field.InputGroupField
              required
              orientation="responsive"
              placeholder={t('Enter your email')}
              description={t(
                "We'll use this email to share with you more details."
              )}
              type="email"
              label={t('Email')}
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
              placeholder={t('070-1234-5678')}
              type="tel"
              description={t(
                'We may use this number to contact you on the visit day.'
              )}
              label={
                <div>
                  {t('Phone')}{' '}
                  <span className="text-muted-foreground text-xs">
                    {t('(optional)')}
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
    label: '',
    description: ''
  },
  render: function Render({ group, description, label }) {
    const t = useExtracted()

    const placeOptions = [
      {
        value: 'orange',
        label: (
          <>
            <HouseIcon name="orange" />
            {t('Orange House')}
          </>
        ),
        className:
          'data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-orange-500 data-[state=on]:*:[svg]:stroke-orange-500'
      },
      {
        value: 'apple',
        label: (
          <>
            <HouseIcon name="apple" />
            {t('Apple House')}
          </>
        ),
        className:
          'data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500'
      },
      {
        value: 'lemon',
        label: (
          <>
            <HouseIcon name="lemon" />
            {t('Lemon House')}
          </>
        ),
        className:
          'data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500'
      }
    ]

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

export function useSubmitToast(promise: Promise<unknown>, name: string) {
  const t = useExtracted()

  toast.promise(promise, {
    loading: t('Sending message...'),
    success: () => {
      router.push('/contact')
      return {
        message: t('Message sent successfully!'),
        description: t(
          'Thank you for contacting us {name}. We will get back to you shortly.',
          { name }
        )
      }
    },
    error: (error) => {
      return {
        message: error.message || t('Failed to send message.'),
        description: t(
          'Please try again later or contact us directly at {email}.',
          { email: 'info@guesthouseosaka.com' }
        )
      }
    }
  })
}
