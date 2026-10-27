import { timeZone } from '@/i18n/formats'
import { HouseIdentifierValues } from '@/lib/types'
import { z } from '@/lib/zod'
import type { Messages } from 'use-intl'
import { isMobilePhone } from 'validator'

type ValidationMessageKey = keyof Messages['forms']['validation']

/**
 * The copy for every validation rule, as `useValidationMessages` reads it.
 * The server parses without it and falls back to zod's English defaults.
 */
export type ValidationMessages = Record<ValidationMessageKey, string>

const error = (value?: string) => (value ? { error: value } : undefined)

function isPositiveNumberString(value: string) {
  const age = Number(value)
  return !Number.isNaN(age) && age > 0
}

// `en-CA` formats dates as YYYY-MM-DD, matching the date input's value.
const tokyoDateFormat = new Intl.DateTimeFormat('en-CA', { timeZone })

/**
 * Compares against today's date in Osaka, where the tour or move-in happens,
 * rather than the local date: the browser and the server (UTC) disagree on
 * "today" for part of the day, which let a date pass in the form and then fail
 * on the server.
 */
function isTodayOrLater(value: string) {
  return value >= tokyoDateFormat.format(new Date())
}

function isContactHour(value: string) {
  const [hour, minute] = value.split(':').map(Number)
  const totalMinutes = hour * 60 + minute
  return totalMinutes >= 10 * 60 && totalMinutes <= 20 * 60
}

/** The longest message the forms accept, which the message field counts down from. */
export const MESSAGE_MAX_LENGTH = 3000

export function createContactFormSchema(messages?: ValidationMessages) {
  const m = (key: ValidationMessageKey) => messages?.[key]

  return z.object({
    places: z
      .array(z.enum(HouseIdentifierValues))
      .check(z.minLength(1, m('places_min')), z.maxLength(3, m('places_max'))),
    account: z.object({
      name: z.string().check(z.minLength(2, m('name_min')), z.maxLength(100, m('name_max'))),
      age: z.string().check(z.refine(isPositiveNumberString, error(m('age_positive')))),
      gender: z.enum(['male', 'female'], error(m('gender_required'))),
      nationality: z
        .string()
        .check(z.minLength(1, m('nationality_required')), z.maxLength(100, m('nationality_max'))),
      email: z.email(m('email')),
      phone: z
        .string()
        .check(z.refine((value) => (value ? isMobilePhone(value, 'any') : true), error(m('phone'))))
    }),
    message: z.string().check(z.maxLength(MESSAGE_MAX_LENGTH, m('message_max'))),
    date: z.iso.date().check(z.refine(isTodayOrLater, error(m('date_future')))),
    privacyPolicy: z.literal(true, error(m('privacy_policy'))),
    stayDuration: z.enum(['1-month', '3-months', 'long-term'], error(m('stay_duration'))),
    hour: z.iso.time().check(z.refine(isContactHour, error(m('time_range'))))
  })
}

export function createTourFormSchema(messages?: ValidationMessages) {
  return z.pick(createContactFormSchema(messages), {
    places: true,
    date: true,
    hour: true,
    account: true,
    message: true,
    privacyPolicy: true
  })
}

export function createMoveInFormSchema(messages?: ValidationMessages) {
  return z.pick(createContactFormSchema(messages), {
    places: true,
    date: true,
    stayDuration: true,
    account: true,
    message: true,
    privacyPolicy: true
  })
}

export function createGeneralInquirySchema(messages?: ValidationMessages) {
  const schema = createContactFormSchema(messages)
  const baseSchema = z.pick(schema, { places: true, account: true, privacyPolicy: true })
  return z.extend(baseSchema, {
    message: schema.shape.message.check(z.minLength(5, messages?.message_min))
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
