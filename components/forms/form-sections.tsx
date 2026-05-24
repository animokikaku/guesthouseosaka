'use client'

import type { FormFieldsConfig } from '@/lib/types/components'
import type { ReactNode } from 'react'

type MessageSectionFieldApi = {
  MessageField: React.ComponentType<{
    required?: boolean
    label: string
    rows: number
    className: string
    placeholder?: string
    description?: string
  }>
  PrivacyPolicyField: React.ComponentType
}

/** Minimum form API for message + privacy policy fields (all contact form variants). */
export type MessageSectionForm = {
  AppField: (props: {
    name: 'message' | 'privacyPolicy'
    children: (field: MessageSectionFieldApi) => ReactNode
  }) => ReactNode | Promise<ReactNode>
}

interface FormMessageSectionProps<TForm extends MessageSectionForm> {
  form: TForm
  fields: Pick<FormFieldsConfig, 'message'>
  messageRequired?: boolean
}

export function FormMessageSection<TForm extends MessageSectionForm>({
  form,
  fields,
  messageRequired = false
}: FormMessageSectionProps<TForm>) {
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
