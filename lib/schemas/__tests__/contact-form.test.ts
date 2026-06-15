import { contactFormPayloadSchema } from '@/lib/schemas/contact-form'

const validGeneralInquiryPayload = {
  type: 'other' as const,
  data: {
    places: ['orange'],
    account: {
      name: 'John Doe',
      age: '29',
      gender: 'male' as const,
      nationality: 'USA',
      email: 'john@example.com',
      phone: ''
    },
    message: 'I have a question about the house.',
    privacyPolicy: true as const
  }
}

describe('contactFormPayloadSchema', () => {
  it('accepts a valid general inquiry payload', () => {
    const result = contactFormPayloadSchema.safeParse(validGeneralInquiryPayload)
    expect(result.success).toBe(true)
  })

  it('rejects malformed direct calls', () => {
    const result = contactFormPayloadSchema.safeParse({
      type: 'other',
      data: {
        places: [],
        account: {
          name: 'J',
          age: '0',
          gender: 'male',
          nationality: '',
          email: 'not-an-email',
          phone: ''
        },
        message: 'hey',
        privacyPolicy: false
      }
    })

    expect(result.success).toBe(false)
  })

  it('rejects arbitrary recipient targets', () => {
    const result = contactFormPayloadSchema.safeParse({
      ...validGeneralInquiryPayload,
      data: {
        ...validGeneralInquiryPayload.data,
        places: ['owner@example.com']
      }
    })

    expect(result.success).toBe(false)
  })

  it('validates tour dates against the current day in Japan', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2030-01-14T16:00:00Z'))

    try {
      const todayInJapanResult = contactFormPayloadSchema.safeParse({
        type: 'tour',
        data: {
          ...validGeneralInquiryPayload.data,
          date: '2030-01-15',
          hour: '14:00:00'
        }
      })
      const yesterdayInJapanResult = contactFormPayloadSchema.safeParse({
        type: 'tour',
        data: {
          ...validGeneralInquiryPayload.data,
          date: '2030-01-14',
          hour: '14:00:00'
        }
      })

      expect(todayInJapanResult.success).toBe(true)
      expect(yesterdayInJapanResult.success).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })
})
