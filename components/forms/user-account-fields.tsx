import { defineAppFieldGroup } from '@/components/forms/app-form'
import type { ContactFormFields } from '@/lib/schemas/contact-form'
import type { FormFieldsConfig } from '@/lib/types/components'
import { CakeIcon, GlobeIcon, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'use-intl'

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
  name: strict<UserAccountDraft['name']>(),
  age: strict<UserAccountDraft['age']>(),
  gender: strict<UserAccountDraft['gender']>(),
  nationality: strict<UserAccountDraft['nationality']>(),
  email: strict<UserAccountDraft['email']>(),
  phone: strict<UserAccountDraft['phone']>()
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
            {...config.gender}
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
            {...config.name}
            orientation="responsive"
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
            {...config.age}
            icon={<CakeIcon />}
            orientation="responsive"
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
            {...config.nationality}
            icon={<GlobeIcon />}
            type="text"
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
            {...config.email}
            type="email"
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
            {...config.phone}
            type="tel"
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

/**
 * Left unannotated so the bound component infers the parent form shape from its
 * `form` prop: annotating these bindings against a concrete form shape makes
 * that inference pick the annotation instead of the actual form.
 */
export const userAccountFieldBindings = {
  name: 'account.name',
  age: 'account.age',
  gender: 'account.gender',
  nationality: 'account.nationality',
  email: 'account.email',
  phone: 'account.phone'
} as const
