'use client'

import { ResetButton } from '@/components/forms/components/reset-button'
import { SubmitButton } from '@/components/forms/components/submit-button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import type { AnyReactFormApi } from '@tanstack/react-form'

interface FormCardProps {
  title?: string | null
  description?: string | null
  formId: string
  form: AnyReactFormApi
  children: React.ReactNode
  className?: string
}

export function FormCard({ title, description, formId, form, children, className }: FormCardProps) {
  return (
    <Card className={cn('mx-auto w-full sm:max-w-2xl', className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>{children}</FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <ResetButton formApi={form} />
          <SubmitButton formApi={form} formId={formId} />
        </Field>
      </CardFooter>
    </Card>
  )
}
