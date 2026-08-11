'use client'

import { defineAppFieldGroup } from '@/components/forms/app-form'
import type { ContactFormFields } from '@/components/forms/schema'
import type { FormFieldsConfig } from '@/lib/types/components'
import { CakeIcon, GlobeIcon, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Account = ContactFormFields['account']

/**
 * The account fields as the user edits them.
 *
 * `gender` has no selection until the user picks one, so the editable state is
 * wider than the validated state. Submit validation narrows it back.
 */
export interface UserAccountDraft extends Omit<Account, 'gender'> {
  gender: Account['gender'] | ''
}

export const userAccountDefaultValues: UserAccountDraft = {
  name: '',
  age: '',
  gender: '',
  nationality: '',
  email: '',
  phone: ''
}

const userAccountFieldGroup = defineAppFieldGroup(({ strict }) => ({
  name: strict<string>(),
  age: strict<string>(),
  gender: strict<UserAccountDraft['gender']>(),
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
