import { HouseIdentifierSchema } from '@/lib/types'
import { useExtracted } from 'next-intl'
import { isMobilePhone } from 'validator'
import z from 'zod'

function useContactFormSchema() {
  const t = useExtracted('ContactForm')
  return z.object({
    places: z
      .array(HouseIdentifierSchema)
      .min(1, t('Please select at least one share house.'))
      .max(3, t('You can select up to 3 share houses.')),
    account: z.object({
      name: z.string().min(2, t('Name must be at least 2 characters long.')),
      age: z.string().refine(
        (v) => {
          const age = Number(v)
          return !isNaN(age) && age > 0
        },
        { message: t('Age must be a positive number.') }
      ),
      gender: z.enum(['male', 'female'], {
        error: t('Please select your gender.')
      }),
      nationality: z
        .string()
        .min(1, t('Please enter your nationality.'))
        .max(100, t('Nationality must be at most 100 characters.')),
      email: z.email(t('Invalid email address.')),
      phone: z.string().refine((v) => (v ? isMobilePhone(v, 'any') : true), {
        message: t('Invalid phone number')
      })
    }),
    message: z
      .string()
      .max(3000, t('Message must be at most 3000 characters.')),
    date: z.iso.date().refine(
      (val) => {
        const inputDate = new Date(val)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        inputDate.setHours(0, 0, 0, 0)
        return inputDate >= today
      },
      { message: t('Date must be today or later.') }
    ),
    privacyPolicy: z.literal(true, {
      error: t('You must agree to the privacy policy.')
    }),
    stayDuration: z.enum(['1-month', '3-months', 'long-term'], {
      error: t('Please select your desired minimum stay.')
    }),
    hour: z.iso.time().refine(
      (val) => {
        const [h, m] = val.split(':').map(Number)
        const totalMinutes = h * 60 + m
        const start = 10 * 60
        const end = 20 * 60
        return totalMinutes >= start && totalMinutes <= end
      },
      { message: t('Time must be between 10:00 and 20:00.') }
    )
  })
}

export type ContactFormFields = z.infer<ReturnType<typeof useContactFormSchema>>

// --- Specific Schemas ---

export function useTourFormSchema() {
  const schema = useContactFormSchema()
  return schema.pick({
    places: true,
    date: true,
    hour: true,
    account: true,
    message: true,
    privacyPolicy: true
  })
}

export type TourFormFields = z.infer<ReturnType<typeof useTourFormSchema>>

export function useMoveInFormSchema() {
  const schema = useContactFormSchema()
  return schema.pick({
    places: true,
    date: true,
    stayDuration: true,
    account: true,
    message: true,
    privacyPolicy: true
  })
}

export type MoveInFormFields = z.infer<ReturnType<typeof useMoveInFormSchema>>

export function useGeneralInquirySchema() {
  const t = useExtracted('ContactForm')
  const schema = useContactFormSchema()
  return schema
    .pick({
      privacyPolicy: true
    })
    .extend({
      account: schema.shape.account.pick({
        name: true,
        email: true
      }),
      message: schema.shape.message.refine((val) => val.length >= 5, {
        message: t('Message must be at least 5 characters long.')
      })
    })
}

export type GeneralInquiryFields = z.infer<
  ReturnType<typeof useGeneralInquirySchema>
>
