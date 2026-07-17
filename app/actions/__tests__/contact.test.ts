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
  beforeEach(() => {
    vi.clearAllMocks()
    headersMock.mockResolvedValue(new Headers({ 'x-forwarded-for': '198.51.100.10' }))
  })

  it('returns the created email when Resend accepts it', async () => {
    sendMock.mockResolvedValue({
      data: { id: 'email-id' },
      error: null,
      headers: {}
    })

    await expect(submitContactForm(payload)).resolves.toEqual({ id: 'email-id' })
  })

  it('rejects when Resend returns an API error', async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: {
        message: 'The email could not be delivered.',
        name: 'validation_error',
        statusCode: 422
      },
      headers: {}
    })

    await expect(submitContactForm(payload)).rejects.toThrow('Failed to send contact form email')
  })
})
