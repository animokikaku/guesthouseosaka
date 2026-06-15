import { HouseIdentifierSchema } from '@/lib/types'
import { isMobilePhone } from 'validator'
import { z } from 'zod'

export type ContactFormValidationMessages = {
  places_min: string
  places_max: string
  name_min: string
  age_positive: string
  gender_required: string
  nationality_required: string
  nationality_max: string
  email: string
  phone: string
  message_max: string
  message_min: string
  date_future: string
  privacy_policy: string
  stay_duration: string
  time_range: string
}

const defaultContactFormValidationMessages: ContactFormValidationMessages = {
  places_min: 'Invalid places',
  places_max: 'Invalid places',
  name_min: 'Invalid name',
  age_positive: 'Invalid age',
  gender_required: 'Invalid gender',
  nationality_required: 'Invalid nationality',
  nationality_max: 'Invalid nationality',
  email: 'Invalid email',
  phone: 'Invalid phone',
  message_max: 'Invalid message',
  message_min: 'Invalid message',
  date_future: 'Invalid date',
  privacy_policy: 'Privacy policy required',
  stay_duration: 'Invalid stay duration',
  time_range: 'Invalid time'
}

const japanDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'Asia/Tokyo',
  year: 'numeric'
})

function getTodayInJapan() {
  const parts = Object.fromEntries(
    japanDateFormatter.formatToParts(new Date()).map((part) => [part.type, part.value])
  )

  return `${parts.year}-${parts.month}-${parts.day}`
}

export function createContactFormSchema(messages: ContactFormValidationMessages) {
  return z.object({
    places: z.array(HouseIdentifierSchema).min(1, messages.places_min).max(3, messages.places_max),
    account: z.object({
      name: z.string().min(2, messages.name_min),
      age: z.string().refine(
        (value) => {
          const age = Number(value)
          return !isNaN(age) && age > 0
        },
        { message: messages.age_positive }
      ),
      gender: z.enum(['male', 'female'], {
        error: messages.gender_required
      }),
      nationality: z
        .string()
        .min(1, messages.nationality_required)
        .max(100, messages.nationality_max),
      email: z.email(messages.email),
      phone: z.string().refine((value) => (value ? isMobilePhone(value, 'any') : true), {
        message: messages.phone
      })
    }),
    message: z.string().max(3000, messages.message_max),
    date: z.iso.date().refine(
      (value) => {
        return value >= getTodayInJapan()
      },
      { message: messages.date_future }
    ),
    privacyPolicy: z.literal(true, {
      error: messages.privacy_policy
    }),
    stayDuration: z.enum(['1-month', '3-months', 'long-term'], {
      error: messages.stay_duration
    }),
    hour: z.iso.time().refine(
      (value) => {
        const [hours, minutes] = value.split(':').map(Number)
        const totalMinutes = hours * 60 + minutes
        return totalMinutes >= 10 * 60 && totalMinutes <= 20 * 60
      },
      { message: messages.time_range }
    )
  })
}

export function createTourFormSchema(messages: ContactFormValidationMessages) {
  return createContactFormSchema(messages).pick({
    places: true,
    date: true,
    hour: true,
    account: true,
    message: true,
    privacyPolicy: true
  })
}

export function createMoveInFormSchema(messages: ContactFormValidationMessages) {
  return createContactFormSchema(messages).pick({
    places: true,
    date: true,
    stayDuration: true,
    account: true,
    message: true,
    privacyPolicy: true
  })
}

export function createGeneralInquirySchema(messages: ContactFormValidationMessages) {
  const schema = createContactFormSchema(messages)
  return schema
    .pick({
      places: true,
      account: true,
      privacyPolicy: true
    })
    .extend({
      message: schema.shape.message.refine((value) => value.length >= 5, {
        message: messages.message_min
      })
    })
}

export function createContactFormPayloadSchema(messages: ContactFormValidationMessages) {
  return z.discriminatedUnion('type', [
    z.object({
      type: z.literal('tour'),
      data: createTourFormSchema(messages)
    }),
    z.object({
      type: z.literal('move-in'),
      data: createMoveInFormSchema(messages)
    }),
    z.object({
      type: z.literal('other'),
      data: createGeneralInquirySchema(messages)
    })
  ])
}

export const contactFormPayloadSchema = createContactFormPayloadSchema(
  defaultContactFormValidationMessages
)

export type ContactFormFields = z.infer<ReturnType<typeof createContactFormSchema>>
export type TourFormFields = z.infer<ReturnType<typeof createTourFormSchema>>
export type MoveInFormFields = z.infer<ReturnType<typeof createMoveInFormSchema>>
export type GeneralInquiryFields = z.infer<ReturnType<typeof createGeneralInquirySchema>>
export type ContactFormPayload = z.infer<typeof contactFormPayloadSchema>
