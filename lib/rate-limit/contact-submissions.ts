import { ContactFormRejectedError } from '@/lib/errors/contact-form'

// Best-effort per-instance limiter. Resend also enforces provider-side limits.
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5

const contactSubmissionAttempts = new Map<string, { count: number; resetAt: number }>()

export function assertWithinContactSubmissionRateLimit(identifier: string) {
  const now = Date.now()
  const attempts = contactSubmissionAttempts.get(identifier)

  if (attempts && attempts.resetAt <= now) {
    contactSubmissionAttempts.delete(identifier)
  }

  if (!attempts || attempts.resetAt <= now) {
    contactSubmissionAttempts.set(identifier, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS
    })
    return
  }

  if (attempts.count >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    throw new ContactFormRejectedError('rate_limit')
  }

  attempts.count += 1
}

export function resetContactSubmissionRateLimit() {
  contactSubmissionAttempts.clear()
}
