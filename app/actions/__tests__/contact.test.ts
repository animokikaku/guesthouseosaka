const { headersMock, sendMock } = vi.hoisted(() => ({
  headersMock: vi.fn(),
  sendMock: vi.fn()
}))

vi.mock('next/headers', () => ({
  headers: headersMock
}))

vi.mock('resend', () => ({
  Resend: class ResendMock {
    emails = { send: sendMock }
  }
}))

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'test',
    RESEND_API_KEY: 're_test',
    VERCEL_ENV: undefined
  }
}))

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

describe('submitContactForm', () => {
  let requesterIndex = 0

  beforeEach(() => {
    vi.clearAllMocks()
    requesterIndex += 1
    headersMock.mockResolvedValue(
      new Headers({ 'x-forwarded-for': `198.51.100.${requesterIndex}` })
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns success when Resend accepts the email', async () => {
    sendMock.mockResolvedValue({
      data: { id: 'email-id' },
      error: null,
      headers: {}
    })

    await expect(submitContactForm(payload)).resolves.toEqual({ ok: true })
  })

  it('maps a Resend API error to a typed delivery failure', async () => {
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

  it('maps a rejected transport call to a typed delivery failure', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const transportError = new Error('Network unavailable')
    sendMock.mockRejectedValue(transportError)

    await expect(submitContactForm(payload)).resolves.toEqual({
      ok: false,
      code: 'delivery_failed'
    })
    expect(consoleError).toHaveBeenCalledWith('Failed to send contact form email', transportError)
  })

  it('rejects invalid input before sending an email', async () => {
    await expect(
      submitContactForm({ type: 'other', data: {} } as ContactFormPayload)
    ).resolves.toEqual({
      ok: false,
      code: 'invalid_submission'
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns a typed failure after five attempts from one requester', async () => {
    headersMock.mockResolvedValue(new Headers({ 'x-forwarded-for': '198.51.100.250' }))
    sendMock.mockResolvedValue({
      data: { id: 'email-id' },
      error: null,
      headers: {}
    })

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(submitContactForm(payload)).resolves.toEqual({ ok: true })
    }

    await expect(submitContactForm(payload)).resolves.toEqual({
      ok: false,
      code: 'rate_limited'
    })
    expect(sendMock).toHaveBeenCalledTimes(5)
  })
})
