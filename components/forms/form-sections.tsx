'use client'

import type { FormFieldsConfig } from '@/lib/types/components'
import type { ReactNode } from 'react'

interface FormMessageSectionProps {
  form: {
    AppField: React.ComponentType<{
      name: 'message' | 'privacyPolicy'
      children: (field: {
        MessageField: React.ComponentType<{
          required?: boolean
          label: string
          rows: number
          className: string
          placeholder?: string
          description?: string
        }>
        PrivacyPolicyField: React.ComponentType
      }) => ReactNode
    }>
  }
  fields: Pick<FormFieldsConfig, 'message'>
  messageRequired?: boolean
}

export function FormMessageSection({
  form,
  fields,
  messageRequired = false
}: FormMessageSectionProps) {
  return (
    <>
      <form.AppField
        name="message"
        children={(field) => (
          <field.MessageField
            required={messageRequired}
            label={fields.message.label}
            rows={6}
            className="min-h-24 resize-none"
            placeholder={fields.message.placeholder}
            description={fields.message.description}
          />
        )}
      />
      <form.AppField name="privacyPolicy" children={(field) => <field.PrivacyPolicyField />} />
    </>
  )
}
