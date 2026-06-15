'use server'

import {
  GeneralInquiryEmail,
  MoveInRequestEmail,
  TourRequestEmail
} from '@/components/email-template'
import { GeneralInquiryFields, MoveInFormFields, TourFormFields } from '@/components/forms/schema'
import { env } from '@/lib/env'
import { HouseIdentifier, HouseIdentifierSchema } from '@/lib/types'
import { headers } from 'next/headers'
import { Resend } from 'resend'
import { isMobilePhone } from 'validator'
import { z } from 'zod'

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

const accountSchema = z.object({
  name: z.string().min(2),
  age: z.string().refine((value) => {
    const age = Number(value)
    return !isNaN(age) && age > 0
  }),
  gender: z.enum(['male', 'female']),
  nationality: z.string().min(1).max(100),
  email: z.email(),
  phone: z.string().refine((value) => (value ? isMobilePhone(value, 'any') : true))
})

const baseContactFormPayloadSchema = z.object({
  places: z.array(HouseIdentifierSchema).min(1).max(3),
  account: accountSchema,
  message: z.string().max(3000),
  privacyPolicy: z.literal(true)
})

const contactFormPayloadSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('tour'),
    data: baseContactFormPayloadSchema.extend({
      date: z.iso.date(),
      hour: z.iso.time()
    })
  }),
  z.object({
    type: z.literal('move-in'),
    data: baseContactFormPayloadSchema.extend({
      date: z.iso.date(),
      stayDuration: z.enum(['1-month', '3-months', 'long-term'])
    })
  }),
  z.object({
    type: z.literal('other'),
    data: baseContactFormPayloadSchema.extend({
      message: baseContactFormPayloadSchema.shape.message.min(5)
    })
  })
])

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

type ContactFormPayload =
  | { type: 'tour'; data: TourFormFields }
  | { type: 'move-in'; data: MoveInFormFields }
  | { type: 'other'; data: GeneralInquiryFields }

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
