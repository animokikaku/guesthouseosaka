'use server'

import {
  GeneralInquiryEmail,
  MoveInRequestEmail,
  TourRequestEmail
} from '@/components/email-template'
import { env } from '@/lib/env'
import { contactFormPayloadSchema, type ContactFormPayload } from '@/lib/schemas/contact-form'
import type { HouseIdentifier } from '@/lib/types'
import { Data, Effect } from 'effect'
import { headers } from 'next/headers'
import { Resend, type CreateEmailOptions } from 'resend'

const { emails } = new Resend(env.RESEND_API_KEY)
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5
const contactSubmissionAttempts = new Map<string, { count: number; resetAt: number }>()

class InvalidContactSubmission extends Data.TaggedError('InvalidContactSubmission') {}
class ContactRateLimitExceeded extends Data.TaggedError('ContactRateLimitExceeded') {}
class ContactEmailDeliveryFailed extends Data.TaggedError('ContactEmailDeliveryFailed')<{
  readonly reason: unknown
}> {}

export type ContactSubmissionResult =
  | { ok: true }
  | { ok: false; code: 'delivery_failed' | 'invalid_submission' | 'rate_limited' }

const getRequesterIdentifier = Effect.promise(async () => {
  const headerList = await headers()
  const forwardedFor = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || headerList.get('x-real-ip') || 'unknown'
})

function recordSubmissionAttempt(identifier: string) {
  return Effect.suspend(() => {
    const now = Date.now()
    const attempts = contactSubmissionAttempts.get(identifier)

    if (!attempts || attempts.resetAt <= now) {
      contactSubmissionAttempts.set(identifier, {
        count: 1,
        resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS
      })
      return Effect.succeed(undefined)
    }

    if (attempts.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
      return Effect.fail(new ContactRateLimitExceeded())
    }

    attempts.count += 1
    return Effect.succeed(undefined)
  })
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

function validateContactForm(payload: ContactFormPayload) {
  const result = contactFormPayloadSchema.safeParse(payload)
  return result.success ? Effect.succeed(result.data) : Effect.fail(new InvalidContactSubmission())
}

function sendEmail(payload: CreateEmailOptions) {
  return Effect.tryPromise({
    try: () => emails.send(payload),
    catch: (reason) => new ContactEmailDeliveryFailed({ reason })
  }).pipe(
    Effect.flatMap(({ error }) =>
      error
        ? Effect.fail(new ContactEmailDeliveryFailed({ reason: error }))
        : Effect.succeed(undefined)
    ),
    Effect.tapError(({ reason }) =>
      Effect.sync(() => console.error('Failed to send contact form email', reason))
    )
  )
}

function submitContactFormEffect(
  payload: ContactFormPayload
): Effect.Effect<ContactSubmissionResult> {
  return Effect.gen(function* () {
    yield* recordSubmissionAttempt(yield* getRequesterIdentifier)

    const { type, data } = yield* validateContactForm(payload)
    const { from, to } = DEFAULT_CONTACT
    const { name, email } = data.account

    switch (type) {
      case 'tour':
        yield* sendEmail({
          from,
          to: to(data.places),
          replyTo: email,
          subject: `内覧希望: ${name}`,
          react: TourRequestEmail({ data })
        })
        break
      case 'move-in':
        yield* sendEmail({
          from,
          to: to(data.places),
          replyTo: email,
          subject: `入居希望: ${name}`,
          react: MoveInRequestEmail({ data })
        })
        break
      case 'other':
        yield* sendEmail({
          from,
          to: to(data.places),
          replyTo: email,
          subject: `お問い合わせ: ${name}`,
          react: GeneralInquiryEmail({ data })
        })
        break
    }

    return { ok: true } as const
  }).pipe(
    Effect.catchTags({
      ContactEmailDeliveryFailed: () =>
        Effect.succeed({ ok: false, code: 'delivery_failed' } as const),
      ContactRateLimitExceeded: () => Effect.succeed({ ok: false, code: 'rate_limited' } as const),
      InvalidContactSubmission: () =>
        Effect.succeed({ ok: false, code: 'invalid_submission' } as const)
    })
  )
}

export async function submitContactForm(
  payload: ContactFormPayload
): Promise<ContactSubmissionResult> {
  return Effect.runPromise(submitContactFormEffect(payload))
}
