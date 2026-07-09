'use server'

import {
  GeneralInquiryEmail,
  MoveInRequestEmail,
  TourRequestEmail
} from '@/components/email-template'
import { CONTACT_EMAIL_FROM, getContactRecipient } from '@/lib/contact-email'
import { env } from '@/lib/env'
import { contactFormPayloadSchema, type ContactFormPayload } from '@/lib/schemas/contact-form'
import { headers } from 'next/headers'
import { Resend } from 'resend'

const { emails } = new Resend(env.RESEND_API_KEY)
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5
const contactSubmissionAttempts = new Map<string, { count: number; resetAt: number }>()

async function getRequesterIdentifier() {
  const headerList = await headers()
  const forwardedFor = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || headerList.get('x-real-ip') || 'unknown'
}

function assertRateLimit(identifier: string) {
  const now = Date.now()
  const attempts = contactSubmissionAttempts.get(identifier)

  if (!attempts || attempts.resetAt <= now) {
    contactSubmissionAttempts.set(identifier, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS
    })
    return
  }

  if (attempts.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    throw new Error('Too many contact form submissions')
  }

  attempts.count += 1
}

export async function submitContactForm({ type, data }: ContactFormPayload) {
  assertRateLimit(await getRequesterIdentifier())

  if (!contactFormPayloadSchema.safeParse({ type, data }).success) {
    throw new Error('Invalid contact form submission')
  }

  const { name, email } = data.account

  switch (type) {
    case 'tour':
      return emails.send({
        from: CONTACT_EMAIL_FROM,
        to: getContactRecipient(data.places),
        replyTo: email,
        subject: `内覧希望: ${name}`,
        react: TourRequestEmail({ data })
      })
    case 'move-in':
      return emails.send({
        from: CONTACT_EMAIL_FROM,
        to: getContactRecipient(data.places),
        replyTo: email,
        subject: `入居希望: ${name}`,
        react: MoveInRequestEmail({ data })
      })
    case 'other':
      return emails.send({
        from: CONTACT_EMAIL_FROM,
        to: getContactRecipient(data.places),
        replyTo: email,
        subject: `お問い合わせ: ${name}`,
        react: GeneralInquiryEmail({ data })
      })
  }
}
