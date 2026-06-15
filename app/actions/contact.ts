'use server'

import {
  GeneralInquiryEmail,
  MoveInRequestEmail,
  TourRequestEmail
} from '@/components/email-template'
import { env } from '@/lib/env'
import { ContactFormRejectedError } from '@/lib/errors/contact-form'
import { assertWithinContactSubmissionRateLimit } from '@/lib/rate-limit/contact-submissions'
import { contactFormPayloadSchema, type ContactFormPayload } from '@/lib/schemas/contact-form'
import { HouseIdentifier } from '@/lib/types'
import { headers } from 'next/headers'
import { Resend } from 'resend'

const { emails } = new Resend(env.RESEND_API_KEY)

async function getRequesterIdentifier() {
  const headerList = await headers()
  const forwardedFor = headerList.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || headerList.get('x-real-ip') || 'unknown'
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

export type { ContactFormPayload } from '@/lib/schemas/contact-form'

export async function submitContactForm(payload: ContactFormPayload) {
  const result = contactFormPayloadSchema.safeParse(payload)

  if (!result.success) {
    throw new ContactFormRejectedError('validation')
  }

  const { type, data } = result.data
  assertWithinContactSubmissionRateLimit(await getRequesterIdentifier())

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
