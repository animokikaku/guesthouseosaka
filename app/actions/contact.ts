'use server'

import {
  GeneralInquiryEmail,
  MoveInRequestEmail,
  TourRequestEmail
} from '@/components/email-template'
import {
  GeneralInquiryFields,
  MoveInFormFields,
  TourFormFields
} from '@/components/forms/schema'
import { env } from '@/lib/env'
import { HouseIdentifier } from '@/lib/types'
import { Resend } from 'resend'

const { emails } = new Resend(env.RESEND_API_KEY)

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
        to: to(),
        replyTo: email,
        subject: `お問い合わせ: ${name}`,
        react: GeneralInquiryEmail({ data })
      })
  }
}
