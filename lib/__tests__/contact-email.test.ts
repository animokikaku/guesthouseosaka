import { describe, expect, it } from 'vitest'

import { DEFAULT_PREVIEW_CONTACT_RECIPIENT, getContactRecipient } from '@/lib/contact-email'

const mockEnv = vi.hoisted(() => ({
  VERCEL_ENV: undefined as 'development' | 'preview' | 'production' | undefined,
  NODE_ENV: 'test' as 'development' | 'production' | 'test'
}))

vi.mock('@/lib/env', () => ({
  env: mockEnv
}))

describe('getContactRecipient', () => {
  beforeEach(() => {
    mockEnv.VERCEL_ENV = undefined
    mockEnv.NODE_ENV = 'test'
  })

  it('routes Vercel preview submissions to the preview recipient', () => {
    mockEnv.NODE_ENV = 'production'
    mockEnv.VERCEL_ENV = 'preview'

    expect(getContactRecipient(['orange'])).toBe(DEFAULT_PREVIEW_CONTACT_RECIPIENT)
  })

  it('routes preview submissions to the preview recipient regardless of selected places', () => {
    mockEnv.NODE_ENV = 'production'
    mockEnv.VERCEL_ENV = 'preview'

    expect(getContactRecipient(['orange', 'apple'])).toBe(DEFAULT_PREVIEW_CONTACT_RECIPIENT)
  })

  it('keeps local and test submissions on the dev recipient', () => {
    expect(getContactRecipient(['orange'])).toBe('dev@guesthouseosaka.com')
  })

  it('keeps production single-house submissions routed to the selected house', () => {
    mockEnv.NODE_ENV = 'production'
    mockEnv.VERCEL_ENV = 'production'

    expect(getContactRecipient(['orange'])).toBe('orange@guesthouseosaka.com')
  })

  it('keeps production multi-house submissions routed to info', () => {
    mockEnv.NODE_ENV = 'production'
    mockEnv.VERCEL_ENV = 'production'

    expect(getContactRecipient(['orange', 'apple'])).toBe('info@guesthouseosaka.com')
  })
})
