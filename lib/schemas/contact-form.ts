import { HouseIdentifierSchema } from '@/lib/types'
import { isMobilePhone } from 'validator'
import { z } from 'zod'

export type ContactFormValidationMessages = Partial<
  Record<
    | 'places_min'
    | 'places_max'
    | 'name_min'
    | 'age_positive'
    | 'gender_required'
    | 'nationality_required'
    | 'nationality_max'
    | 'email'
    | 'phone'
    | 'message_max'
    | 'message_min'
    | 'date_future'
    | 'privacy_policy'
    | 'stay_duration'
    | 'time_range',
    string
  >
>

const message = (value?: string) => (value ? { message: value } : undefined)
const error = (value?: string) => (value ? { error: value } : undefined)

function isPositiveNumberString(value: string) {
  const age = Number(value)
  return !Number.isNaN(age) && age > 0
}

function isTodayOrLater(value: string) {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return value >= `${year}-${month}-${day}`
}

function isContactHour(value: string) {
  const [hour, minute] = value.split(':').map(Number)
  const totalMinutes = hour * 60 + minute
  return totalMinutes >= 10 * 60 && totalMinutes <= 20 * 60
}

export function createContactFormSchema(messages: ContactFormValidationMessages = {}) {
  const m = (key: keyof ContactFormValidationMessages) => messages[key]

  return z.object({
    places: z.array(HouseIdentifierSchema).min(1, m('places_min')).max(3, m('places_max')),
    account: z.object({
      name: z.string().min(2, m('name_min')),
      age: z.string().refine(isPositiveNumberString, message(m('age_positive'))),
      gender: z.enum(['male', 'female'], error(m('gender_required'))),
      nationality: z.string().min(1, m('nationality_required')).max(100, m('nationality_max')),
      email: z.email(m('email')),
      phone: z.string().refine((value) => (value ? isMobilePhone(value, 'any') : true), {
        message: m('phone')
      })
    }),
    message: z.string().max(3000, m('message_max')),
    date: z.iso.date().refine(isTodayOrLater, message(m('date_future'))),
    privacyPolicy: z.literal(true, error(m('privacy_policy'))),
    stayDuration: z.enum(['1-month', '3-months', 'long-term'], error(m('stay_duration'))),
    hour: z.iso.time().refine(isContactHour, message(m('time_range')))
  })
}

export function createTourFormSchema(messages?: ContactFormValidationMessages) {
  return createContactFormSchema(messages).pick({
    places: true,
    date: true,
    hour: true,
    account: true,
    message: true,
    privacyPolicy: true
  })
}

export function createMoveInFormSchema(messages?: ContactFormValidationMessages) {
  return createContactFormSchema(messages).pick({
    places: true,
    date: true,
    stayDuration: true,
    account: true,
    message: true,
    privacyPolicy: true
  })
}

export function createGeneralInquirySchema(messages?: ContactFormValidationMessages) {
  const schema = createContactFormSchema(messages)
  return schema
    .pick({
      places: true,
      account: true,
      privacyPolicy: true
    })
    .extend({
      message: schema.shape.message.refine((value) => value.length >= 5, {
        message: messages?.message_min
      })
    })
}

export type ContactFormFields = z.infer<ReturnType<typeof createContactFormSchema>>
export type TourFormFields = z.infer<ReturnType<typeof createTourFormSchema>>
export type MoveInFormFields = z.infer<ReturnType<typeof createMoveInFormSchema>>
export type GeneralInquiryFields = z.infer<ReturnType<typeof createGeneralInquirySchema>>

export type ContactFormPayload =
  | { type: 'tour'; data: TourFormFields }
  | { type: 'move-in'; data: MoveInFormFields }
  | { type: 'other'; data: GeneralInquiryFields }

export const contactFormPayloadSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('tour'),
    data: createTourFormSchema()
  }),
  z.object({
    type: z.literal('move-in'),
    data: createMoveInFormSchema()
  }),
  z.object({
    type: z.literal('other'),
    data: createGeneralInquirySchema()
  })
])
