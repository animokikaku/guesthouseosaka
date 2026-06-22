'use server'

import {
  GeneralInquiryEmail,
  MoveInRequestEmail,
  TourRequestEmail
} from '@/components/email-template'
import { env } from '@/lib/env'
import { contactFormPayloadSchema, type ContactFormPayload } from '@/lib/schemas/contact-form'
import { HouseIdentifier } from '@/lib/types'
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

const DEFAULT_CONTACT = {
  from: 'Guest House Osaka <info@guesthouseosaka.com>',
  to: (places?: HouseIdentifier[]) => {
    if (env.NODE_ENV !== 'production') {
      return 'dev@guesthouseosaka.com'
    }
    if (places?.length === 1) {
      return `${places[0]}@guesthouseosaka.com`
    }
    return 'info@guesthouseosaka.com'
  }
}

export async function submitContactForm({ type, data }: ContactFormPayload) {
  assertRateLimit(await getRequesterIdentifier())

  if (!contactFormPayloadSchema.safeParse({ type, data }).success) {
    throw new Error('Invalid contact form submission')
  }

  // Skip sending emails in CI (e2e tests)
  if (process.env.CI) {
    return { id: 'ci-skipped', object: 'email' }
  }

  const { from, to } = DEFAULT_CONTACT
  const { name, email } = data.account

  switch (type) {
    case 'tour':
      return emails.send({
        from,
        to: to(data.places),
        replyTo: email,
        subject: `内覧希望: ${name}`,
        react: TourRequestEmail({ data })
      })
    case 'move-in':
      return emails.send({
        from,
        to: to(data.places),
        replyTo: email,
        subject: `入居希望: ${name}`,
        react: MoveInRequestEmail({ data })
      })
    case 'other':
      return emails.send({
        from,
        to: to(data.places),
        replyTo: email,
        subject: `お問い合わせ: ${name}`,
        react: GeneralInquiryEmail({ data })
      })
  }
}
