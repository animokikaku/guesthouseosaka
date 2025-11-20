import { HouseIdentifierSchema } from '@/lib/types'
import { isMobilePhone } from 'validator'
import z from 'zod'

export const AccountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  age: z.string().refine(
    (v) => {
      const age = Number(v)
      return !isNaN(age) && age > 0
    },
    { message: 'Age must be a positive number.' }
  ),
  gender: z.enum(['male', 'female'], {
    error: 'Please select your gender.'
  }),
  nationality: z
    .string()
    .min(1, 'Please enter your nationality.')
    .max(100, 'Nationality must be at most 100 characters.'),
  email: z.email('Invalid email address.'),
  phone: z.string().refine((v) => (v ? isMobilePhone(v, 'any') : true), {
    message: 'Invalid phone number'
  })
})

export type AccountFields = z.infer<typeof AccountSchema>

export const ContactFormSchema = z.object({
  places: z
    .array(HouseIdentifierSchema)
    .min(1, 'Please select at least one share house.')
    .max(3, 'You can select up to 3 share houses.'),
  account: AccountSchema,
  message: z.string().max(3000, 'Message must be at most 3000 characters.'),
  date: z.iso.date().refine(
    (val) => {
      const inputDate = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      inputDate.setHours(0, 0, 0, 0)
      return inputDate >= today
    },
    { message: 'Date must be today or later.' }
  ),
  privacyPolicy: z.literal(true, {
    error: 'You must agree to the privacy policy.'
  }),
  stayDuration: z.enum(['1-month', '3-months', 'long-term'], {
    error: 'Please select your desired minimum stay.'
  }),
  hour: z.iso.time().refine(
    (val) => {
      const [h, m] = val.split(':').map(Number)
      const totalMinutes = h * 60 + m
      const start = 10 * 60
      const end = 20 * 60
      return totalMinutes >= start && totalMinutes <= end
    },
    { message: 'Time must be between 10:00 and 20:00.' }
  )
})

export type ContactFormFields = z.infer<typeof ContactFormSchema>

// --- Specific Schemas ---

export const TourFormSchema = ContactFormSchema.pick({
  places: true,
  date: true,
  hour: true,
  account: true,
  message: true,
  privacyPolicy: true
})

export type TourFormFields = z.infer<typeof TourFormSchema>

export const MoveInFormSchema = ContactFormSchema.pick({
  places: true,
  date: true,
  stayDuration: true,
  account: true,
  message: true,
  privacyPolicy: true
})

export type MoveInFormFields = z.infer<typeof MoveInFormSchema>

export const GeneralInquirySchema = ContactFormSchema.pick({
  privacyPolicy: true
}).extend({
  account: AccountSchema.pick({ name: true, email: true }),
  message: z.string().min(5).max(3000)
})

export type GeneralInquiryFields = z.infer<typeof GeneralInquirySchema>
