/* eslint-disable react/no-children-prop */
import { withFieldGroup } from '@/components/forms'
import { ContactFormFields } from '@/components/forms/schema'
import { LegalNoticeDialog } from '@/components/legal-notice-dialog'
import { useTranslations } from 'next-intl'

export const PrivacyPolicyField = withFieldGroup({
  defaultValues: {
    privacyPolicy: false as ContactFormFields['privacyPolicy']
  },
  render: function Render({ group }) {
    const t = useTranslations('forms')

    return (
      <group.AppField
        name="privacyPolicy"
        children={(field) => (
          <field.CheckboxField
            required
            label={
              <p className="text-muted-foreground">
                {t.rich('fields.privacy_policy_agreement', {
                  link: (chunks) => (
                    <LegalNoticeDialog>{chunks}</LegalNoticeDialog>
                  )
                })}
              </p>
            }
          />
        )}
      />
    )
  }
})
