import { ContactFormRejectedError } from '@/lib/errors/contact-form'
import { resetContactSubmissionRateLimit } from '@/lib/rate-limit/contact-submissions'
import type { ContactFormPayload } from '@/lib/schemas/contact-form'
import { submitContactForm } from '../contact'

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  forwardedFor: '203.0.113.10',
  realIp: '198.51.100.20',
  env: {
    NODE_ENV: 'production',
    RESEND_API_KEY: 'test-resend-key'
  }
}))

vi.mock('@/lib/env', () => ({
  env: mocks.env
}))

vi.mock('next/headers', () => ({
  headers: async () =>
    new Headers({
      ...(mocks.forwardedFor && { 'x-forwarded-for': mocks.forwardedFor }),
      'x-real-ip': mocks.realIp
    })
}))

vi.mock('resend', () => ({
  Resend: vi.fn(
    class {
      emails = {
        send: mocks.send
      }
    }
  )
}))

vi.mock('@/components/email-template', () => ({
  GeneralInquiryEmail: vi.fn(() => null),
  MoveInRequestEmail: vi.fn(() => null),
  TourRequestEmail: vi.fn(() => null)
}))

const validGeneralInquiry: ContactFormPayload = {
  type: 'other',
  data: {
    places: ['orange'],
    account: {
      name: 'John Doe',
      age: '29',
      gender: 'male',
      nationality: 'USA',
      email: 'john@example.com',
      phone: ''
    },
    message: 'I have a question about the house.',
    privacyPolicy: true
  }
}

const validTourRequest: ContactFormPayload = {
  type: 'tour',
  data: {
    ...validGeneralInquiry.data,
    date: '2030-01-15',
    hour: '14:00:00'
  }
}

const validMoveInRequest: ContactFormPayload = {
  type: 'move-in',
  data: {
    ...validGeneralInquiry.data,
    date: '2030-01-15',
    stayDuration: '3-months'
  }
}

function emailSendSummaries() {
  return mocks.send.mock.calls.map(([message]) => {
    const { from, replyTo, subject, to } = message
    return { from, replyTo, subject, to }
  })
}

describe('submitContactForm', () => {
  beforeEach(() => {
    delete process.env.CI
    resetContactSubmissionRateLimit()
    mocks.forwardedFor = '203.0.113.10'
    mocks.realIp = '198.51.100.20'
    mocks.env.NODE_ENV = 'production'
    mocks.send.mockResolvedValue({ id: 'email-id', object: 'email' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('routes valid contact form emails', async () => {
    await expect(submitContactForm(validGeneralInquiry)).resolves.toEqual({
      id: 'email-id',
      object: 'email'
    })
    await submitContactForm(validTourRequest)
    await submitContactForm(validMoveInRequest)
    await submitContactForm({
      ...validGeneralInquiry,
      data: {
        ...validGeneralInquiry.data,
        places: ['orange', 'apple']
      }
    })
    mocks.env.NODE_ENV = 'development'
    await submitContactForm(validGeneralInquiry)

    expect(emailSendSummaries()).toMatchInlineSnapshot(`
      [
        {
          "from": "Guest House Osaka <info@guesthouseosaka.com>",
          "replyTo": "john@example.com",
          "subject": "お問い合わせ: John Doe",
          "to": "orange@guesthouseosaka.com",
        },
        {
          "from": "Guest House Osaka <info@guesthouseosaka.com>",
          "replyTo": "john@example.com",
          "subject": "内覧希望: John Doe",
          "to": "orange@guesthouseosaka.com",
        },
        {
          "from": "Guest House Osaka <info@guesthouseosaka.com>",
          "replyTo": "john@example.com",
          "subject": "入居希望: John Doe",
          "to": "orange@guesthouseosaka.com",
        },
        {
          "from": "Guest House Osaka <info@guesthouseosaka.com>",
          "replyTo": "john@example.com",
          "subject": "お問い合わせ: John Doe",
          "to": "info@guesthouseosaka.com",
        },
        {
          "from": "Guest House Osaka <info@guesthouseosaka.com>",
          "replyTo": "john@example.com",
          "subject": "お問い合わせ: John Doe",
          "to": "dev@guesthouseosaka.com",
        },
      ]
    `)
  })

  it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
    mocks.forwardedFor = ''

    for (let index = 0; index < 5; index += 1) {
      await submitContactForm(validGeneralInquiry)
    }

    await expect(submitContactForm(validGeneralInquiry)).rejects.toMatchObject({
      code: 'rate_limit'
    })
  })

  it('rejects invalid payloads before sending email', async () => {
    await expect(submitContactForm({ type: 'other', data: {} } as never)).rejects.toThrow(
      ContactFormRejectedError
    )

    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('rejects arbitrary recipient targets before sending email', async () => {
    await expect(
      submitContactForm({
        ...validGeneralInquiry,
        data: {
          ...validGeneralInquiry.data,
          places: ['owner@example.com']
        }
      } as never)
    ).rejects.toMatchObject({
      code: 'validation'
    })

    expect(mocks.send).not.toHaveBeenCalled()
  })

  it('rate limits repeated valid submissions from the same requester', async () => {
    for (let index = 0; index < 5; index += 1) {
      await submitContactForm(validGeneralInquiry)
    }

    await expect(submitContactForm(validGeneralInquiry)).rejects.toMatchObject({
      code: 'rate_limit'
    })

    expect(mocks.send).toHaveBeenCalledTimes(5)
  })

  it('skips validation and email sending in CI', async () => {
    process.env.CI = 'true'

    await expect(submitContactForm({ type: 'other', data: {} } as never)).resolves.toEqual({
      id: 'ci-skipped',
      object: 'email'
    })

    expect(mocks.send).not.toHaveBeenCalled()
  })
})
