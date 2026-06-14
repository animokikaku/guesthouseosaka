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
})
