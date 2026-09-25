'use server'

import {
  GeneralInquiryEmail,
  MoveInRequestEmail,
  TourRequestEmail
} from '@/components/email-template'
import { env } from '@/lib/env'
import { contactFormPayloadSchema, type ContactFormPayload } from '@/lib/schemas/contact-form'
import type { HouseIdentifier } from '@/lib/types'
import { Resend, type CreateEmailOptions } from 'resend'

const { emails } = new Resend(env.RESEND_API_KEY)

export type ContactSubmissionResult =
  | { ok: true }
  | { ok: false; code: 'delivery_failed' | 'invalid_submission' }

async function sendEmail(payload: CreateEmailOptions): Promise<ContactSubmissionResult> {
  const { error } = await emails.send(payload)

  if (error) {
    console.error('Failed to send contact form email', error)
    return { ok: false, code: 'delivery_failed' }
  }

  return { ok: true }
}

const DEFAULT_CONTACT = {
  from: 'Guest House Osaka <info@guesthouseosaka.com>',
  to: (places?: HouseIdentifier[]) => {
    if (env.VERCEL_ENV === 'preview') {
      return 'delivered+guesthouseosaka@resend.dev'
    }
    if (env.NODE_ENV !== 'production') {
      return 'dev@guesthouseosaka.com'
    }
    if (places?.length === 1) {
      return `${places[0]}@guesthouseosaka.com`
    }
    return 'info@guesthouseosaka.com'
  }
}

export async function submitContactForm(
  payload: ContactFormPayload
): Promise<ContactSubmissionResult> {
  const parsedPayload = contactFormPayloadSchema.safeParse(payload)
  if (!parsedPayload.success) {
    return { ok: false, code: 'invalid_submission' }
  }

  const { data } = parsedPayload.data

  return sendEmail({
    from: DEFAULT_CONTACT.from,
    to: DEFAULT_CONTACT.to(data.places),
    replyTo: data.account.email,
    ...composeEmail(parsedPayload.data)
  })
}

/** The per-form-type part of the notification: its subject line and template. */
function composeEmail({ type, data }: ContactFormPayload) {
  const { name } = data.account

  switch (type) {
    case 'tour':
      return { subject: `内覧希望: ${name}`, react: TourRequestEmail({ data }) }
    case 'move-in':
      return { subject: `入居希望: ${name}`, react: MoveInRequestEmail({ data }) }
    case 'other':
      return { subject: `お問い合わせ: ${name}`, react: GeneralInquiryEmail({ data }) }
  }
}
