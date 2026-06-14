import {
  assertWithinContactSubmissionRateLimit,
  resetContactSubmissionRateLimit
} from '@/lib/rate-limit/contact-submissions'

describe('assertWithinContactSubmissionRateLimit', () => {
  beforeEach(() => {
    resetContactSubmissionRateLimit()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2030-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows a requester again after the rate limit window expires', () => {
    const identifier = '203.0.113.10'

    for (let index = 0; index < 5; index += 1) {
      assertWithinContactSubmissionRateLimit(identifier)
    }

    expect(() => assertWithinContactSubmissionRateLimit(identifier)).toThrow()

    vi.setSystemTime(new Date('2030-01-01T00:10:01Z'))

    expect(() => assertWithinContactSubmissionRateLimit(identifier)).not.toThrow()
  })
})
