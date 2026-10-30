// @vitest-environment node

const { sendMock, env } = vi.hoisted(() => {
  const serverEnv = {
    RESEND_API_KEY: 're_test',
    TURNSTILE_SECRET_KEY: 'turnstile-secret'
  }
  return { sendMock: vi.fn(), env: serverEnv }
})

vi.mock('resend', () => ({
  Resend: class ResendMock {
    emails = { send: sendMock }
  }
}))

vi.mock('@/env', () => ({ env }))

import type { ContactFormPayload } from '@/lib/schemas/contact-form'
import { submitContactForm as submitWithOrigin, type SubmissionOrigin } from '../contact.server'

const siteverifyMock = vi.fn<typeof fetch>()

/** Answers Siteverify with this body, as Cloudflare does for a checked token. */
const siteverifyReplies = (body: Record<string, unknown>) =>
  siteverifyMock.mockImplementation(async () => Response.json(body))

/** A submission from a visitor whose browser passed the Turnstile challenge. */
const submitContactForm = (
  submission: ContactFormPayload,
  origin: SubmissionOrigin = { turnstileToken: 'turnstile-token' }
) => submitWithOrigin(submission, origin)

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
    vi.stubGlobal('__DEPLOY_ENV__', 'development')
    vi.stubGlobal('fetch', siteverifyMock.mockReset())
    siteverifyReplies({ success: true })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  // Each house has its own inbox; a question about several goes to the shared
  // one. Previews and local runs must never reach a real inbox.
  it.each([
    {
      name: 'one house in production',
      deployEnv: 'production',
      places: ['apple'],
      to: 'apple@guesthouseosaka.com'
    },
    {
      name: 'several houses in production',
      deployEnv: 'production',
      places: ['apple', 'lemon'],
      to: 'info@guesthouseosaka.com'
    },
    {
      name: 'a preview deployment',
      deployEnv: 'preview',
      places: ['apple'],
      to: 'delivered+guesthouseosaka@resend.dev'
    },
    {
      name: 'a local build',
      deployEnv: 'development',
      places: ['apple'],
      to: 'dev@guesthouseosaka.com'
    }
  ] as const)('sends $name to $to', async ({ deployEnv, places, to }) => {
    vi.stubGlobal('__DEPLOY_ENV__', deployEnv)

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

  describe('Turnstile', () => {
    it('checks the token with Cloudflare before sending', async () => {
      await expect(
        submitWithOrigin(payload, { turnstileToken: 'turnstile-token', remoteIp: '203.0.113.7' })
      ).resolves.toEqual({ ok: true })

      const [url, init] = siteverifyMock.mock.calls[0]
      expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
      expect(init?.body).toBe(
        JSON.stringify({
          secret: 'turnstile-secret',
          response: 'turnstile-token',
          remoteip: '203.0.113.7'
        })
      )
    })

    it.each(['invalid-input-response', 'timeout-or-duplicate', 'bad-request'])(
      'rejects a token Cloudflare fails with %s',
      async (errorCode) => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
        siteverifyReplies({ success: false, 'error-codes': [errorCode] })

        await expect(submitContactForm(payload)).resolves.toEqual({
          ok: false,
          code: 'verification_failed'
        })
        expect(sendMock).not.toHaveBeenCalled()
        expect(warn).toHaveBeenCalledWith('Turnstile rejected a contact form submission', [
          errorCode
        ])
      }
    )

    it.each([
      { name: 'no token', turnstileToken: undefined },
      { name: 'an empty token', turnstileToken: '' },
      { name: 'a token that is not a string', turnstileToken: { forged: true } },
      { name: 'a token longer than Cloudflare issues', turnstileToken: 'x'.repeat(2049) }
    ])('rejects $name without asking Cloudflare', async ({ turnstileToken }) => {
      await expect(submitWithOrigin(payload, { turnstileToken })).resolves.toEqual({
        ok: false,
        code: 'verification_failed'
      })
      expect(siteverifyMock).not.toHaveBeenCalled()
      expect(sendMock).not.toHaveBeenCalled()
    })

    it('fails the submission when Cloudflare cannot be reached', async () => {
      siteverifyMock.mockRejectedValue(new Error('Network unavailable'))

      await expect(submitContactForm(payload)).rejects.toThrow('Network unavailable')
      expect(sendMock).not.toHaveBeenCalled()
    })
  })
})
