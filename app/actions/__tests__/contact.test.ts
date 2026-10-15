// @vitest-environment node

const { sendMock, env } = vi.hoisted(() => {
  const mutableEnv: { NODE_ENV: string; RESEND_API_KEY: string; VERCEL_ENV?: string } = {
    NODE_ENV: 'test',
    RESEND_API_KEY: 're_test'
  }
  return { sendMock: vi.fn(), env: mutableEnv }
})

vi.mock('resend', () => ({
  Resend: class ResendMock {
    emails = { send: sendMock }
  }
}))

vi.mock('@/lib/env', () => ({ env }))

vi.mock('@/components/email-template', () => ({
  GeneralInquiryEmail: vi.fn(() => null),
  MoveInRequestEmail: vi.fn(() => null),
  TourRequestEmail: vi.fn(() => null)
}))

import type { ContactFormPayload } from '@/lib/schemas/contact-form'
import { submitContactForm } from '../contact'

const payload: ContactFormPayload = {
  type: 'other',
  data: {
    places: ['orange'],
    account: {
      name: 'Test User',
      age: '25',
      gender: 'male',
      nationality: 'Japan',
      email: 'test@example.com',
      phone: ''
    },
    message: 'A valid contact message.',
    privacyPolicy: true
  }
}

const successfulSubmissionCases = [
  {
    name: 'general inquiry',
    payload,
    subject: 'お問い合わせ: Test User'
  },
  {
    name: 'tour request',
    payload: {
      type: 'tour',
      data: {
        ...payload.data,
        date: '2030-01-15',
        hour: '14:00:00'
      }
    } satisfies ContactFormPayload,
    subject: '内覧希望: Test User'
  },
  {
    name: 'move-in request',
    payload: {
      type: 'move-in',
      data: {
        ...payload.data,
        date: '2030-01-15',
        stayDuration: '1-month'
      }
    } satisfies ContactFormPayload,
    subject: '入居希望: Test User'
  }
] satisfies { name: string; payload: ContactFormPayload; subject: string }[]

describe('submitContactForm', () => {
  beforeEach(() => {
    sendMock.mockReset().mockResolvedValue({ data: { id: 'email-id' }, error: null, headers: {} })
    Object.assign(env, { NODE_ENV: 'test', VERCEL_ENV: undefined })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Each house has its own inbox; a question about several goes to the shared
  // one. Previews and local runs must never reach a real inbox.
  it.each([
    {
      name: 'one house in production',
      nodeEnv: 'production',
      vercelEnv: undefined,
      places: ['apple'],
      to: 'apple@guesthouseosaka.com'
    },
    {
      name: 'several houses in production',
      nodeEnv: 'production',
      vercelEnv: 'production',
      places: ['apple', 'lemon'],
      to: 'info@guesthouseosaka.com'
    },
    {
      name: 'a preview deployment',
      nodeEnv: 'production',
      vercelEnv: 'preview',
      places: ['apple'],
      to: 'delivered+guesthouseosaka@resend.dev'
    },
    {
      name: 'local development',
      nodeEnv: 'development',
      vercelEnv: undefined,
      places: ['apple'],
      to: 'dev@guesthouseosaka.com'
    }
  ] as const)('sends $name to $to', async ({ nodeEnv, vercelEnv, places, to }) => {
    Object.assign(env, { NODE_ENV: nodeEnv, VERCEL_ENV: vercelEnv })

    await submitContactForm({ ...payload, data: { ...payload.data, places: [...places] } })

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'Guest House Osaka <info@guesthouseosaka.com>', to })
    )
  })

  it.each(successfulSubmissionCases)(
    'returns success when Resend accepts a $name email',
    async ({ payload: submission, subject }) => {
      await expect(submitContactForm(submission)).resolves.toEqual({ ok: true })
      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'test@example.com',
          subject,
          to: 'dev@guesthouseosaka.com'
        })
      )
    }
  )

  it('returns a delivery failure when Resend returns an API error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    sendMock.mockResolvedValue({
      data: null,
      error: {
        message: 'The email could not be delivered.',
        name: 'validation_error',
        statusCode: 422
      },
      headers: {}
    })

    await expect(submitContactForm(payload)).resolves.toEqual({
      ok: false,
      code: 'delivery_failed'
    })
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to send contact form email',
      expect.objectContaining({ name: 'validation_error' })
    )
  })

  it('preserves unexpected transport failures as rejected actions', async () => {
    sendMock.mockRejectedValue(new Error('Network unavailable'))

    await expect(submitContactForm(payload)).rejects.toThrow('Network unavailable')
  })

  it('returns an invalid submission without sending an email', async () => {
    await expect(
      submitContactForm({ type: 'other', data: {} } as ContactFormPayload)
    ).resolves.toEqual({
      ok: false,
      code: 'invalid_submission'
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('rejects names longer than 100 characters', async () => {
    const longName = {
      ...payload.data,
      account: { ...payload.data.account, name: 'a'.repeat(101) }
    }

    await expect(submitContactForm({ type: 'other', data: longName })).resolves.toEqual({
      ok: false,
      code: 'invalid_submission'
    })
    expect(sendMock).not.toHaveBeenCalled()
  })
})
