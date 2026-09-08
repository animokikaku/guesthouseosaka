import type { NextFixture } from 'next/experimental/testmode/playwright'

type MockResendAPIOptions = {
  body?: Record<string, unknown>
  status?: number
}

/**
 * Mock Resend API responses for E2E tests.
 *
 * Runs through Next's test proxy (`experimental.testProxy`), so each test gets
 * its own interception scope and outgoing submissions never reach the real API.
 *
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
export function mockResendAPI(next: NextFixture, options: MockResendAPIOptions = {}) {
  const requests: Record<string, unknown>[] = []

  next.onFetch(async (request) => {
    if (request.url === 'https://api.resend.com/emails') {
      requests.push((await request.json()) as Record<string, unknown>)
      return Response.json(options.body ?? { id: 'e2e-mock-email-id', object: 'email' }, {
        status: options.status ?? 200
      })
    }
    // Let other requests pass through
    return 'continue'
  })

  return requests
}
