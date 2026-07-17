'use server'

import {
  GeneralInquiryEmail,
  MoveInRequestEmail,
  TourRequestEmail
} from '@/components/email-template'
import { env } from '@/lib/env'
import { contactFormPayloadSchema, type ContactFormPayload } from '@/lib/schemas/contact-form'
import type { HouseIdentifier } from '@/lib/types'
import { headers } from 'next/headers'
import { Resend, type CreateEmailOptions } from 'resend'

const { emails } = new Resend(env.RESEND_API_KEY)
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5
const contactSubmissionAttempts = new Map<string, { count: number; resetAt: number }>()

export type ContactSubmissionResult =
  | { ok: true }
  | { ok: false; code: 'delivery_failed' | 'invalid_submission' | 'rate_limited' }

async function sendEmail(payload: CreateEmailOptions): Promise<ContactSubmissionResult> {
  const { error } = await emails.send(payload)

  if (error) {
    console.error('Failed to send contact form email', error)
    return { ok: false, code: 'delivery_failed' }
  }

  return { ok: true }
}

async function getRequesterIdentifier() {
  const headerList = await headers()
  const forwardedFor = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || headerList.get('x-real-ip') || 'unknown'
}

function recordSubmissionAttempt(identifier: string) {
  const now = Date.now()
  const attempts = contactSubmissionAttempts.get(identifier)

  if (!attempts || attempts.resetAt <= now) {
    contactSubmissionAttempts.set(identifier, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS
    })
    return true
  }

  if (attempts.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  attempts.count += 1
  return true
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
  if (!recordSubmissionAttempt(await getRequesterIdentifier())) {
    return { ok: false, code: 'rate_limited' }
  }

  const parsedPayload = contactFormPayloadSchema.safeParse(payload)
  if (!parsedPayload.success) {
    return { ok: false, code: 'invalid_submission' }
  }

  const { type, data } = parsedPayload.data
  const { from, to } = DEFAULT_CONTACT
  const { name, email } = data.account

  switch (type) {
    case 'tour':
      return sendEmail({
        from,
        to: to(data.places),
        replyTo: email,
        subject: `内覧希望: ${name}`,
        react: TourRequestEmail({ data })
      })
    case 'move-in':
      return sendEmail({
        from,
        to: to(data.places),
        replyTo: email,
        subject: `入居希望: ${name}`,
        react: MoveInRequestEmail({ data })
      })
    case 'other':
      return sendEmail({
        from,
        to: to(data.places),
        replyTo: email,
        subject: `お問い合わせ: ${name}`,
        react: GeneralInquiryEmail({ data })
      })
  }
}
