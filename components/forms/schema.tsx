import { HouseIdentifierSchema } from '@/lib/types'
import { useTranslations } from 'next-intl'
import { isMobilePhone } from 'validator'
import z from 'zod'

function useContactFormSchema() {
  const t = useTranslations('forms.validation')
  return z.object({
    places: z
      .array(HouseIdentifierSchema)
      .min(1, t('placesMin'))
      .max(3, t('placesMax')),
    account: z.object({
      name: z.string().min(2, t('nameMin')),
      age: z.string().refine(
        (v) => {
          const age = Number(v)
          return !isNaN(age) && age > 0
        },
        { message: t('agePositive') }
      ),
      gender: z.enum(['male', 'female'], {
        error: t('genderRequired')
      }),
      nationality: z
        .string()
        .min(1, t('nationalityRequired'))
        .max(100, t('nationalityMax')),
      email: z.email(t('email')),
      phone: z.string().refine((v) => (v ? isMobilePhone(v, 'any') : true), {
        message: t('phone')
      })
    }),
    message: z
      .string()
      .max(3000, t('messageMax')),
    date: z.iso.date().refine(
      (val) => {
        const inputDate = new Date(val)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        inputDate.setHours(0, 0, 0, 0)
        return inputDate >= today
      },
      { message: t('dateFuture') }
    ),
    privacyPolicy: z.literal(true, {
      error: t('privacyPolicy')
    }),
    stayDuration: z.enum(['1-month', '3-months', 'long-term'], {
      error: t('stayDuration')
    }),
    hour: z.iso.time().refine(
      (val) => {
        const [h, m] = val.split(':').map(Number)
        const totalMinutes = h * 60 + m
        const start = 10 * 60
        const end = 20 * 60
        return totalMinutes >= start && totalMinutes <= end
      },
      { message: t('timeRange') }
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
  const t = useTranslations('forms.validation')
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
        message: t('messageMin')
      })
    })
}

export type GeneralInquiryFields = z.infer<
  ReturnType<typeof useGeneralInquirySchema>
>
