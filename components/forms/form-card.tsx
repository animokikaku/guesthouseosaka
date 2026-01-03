'use client'

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
import * as React from 'react'

interface FormCardProps {
  title?: string | null
  description?: string | null
  formId: string
  form: {
    handleSubmit: () => void
    AppForm: React.ComponentType<{ children?: React.ReactNode }>
    ResetButton: React.ComponentType
    SubmitButton: React.ComponentType<{ form: string }>
  }
  children: React.ReactNode
  className?: string
}

export function FormCard({
  title,
  description,
  formId,
  form,
  children,
  className
}: FormCardProps) {
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
            form.handleSubmit()
          }}
        >
          <FieldGroup>{children}</FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <form.AppForm>
            <form.ResetButton />
            <form.SubmitButton form={formId} />
          </form.AppForm>
        </Field>
      </CardFooter>
    </Card>
  )
}
