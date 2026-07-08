import type { NextFixture } from 'next/experimental/testmode/playwright'

/**
 * Mock Resend API responses for E2E tests
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
export function mockResendAPI(next: NextFixture) {
  const requests: Record<string, unknown>[] = []

  // Mock the Resend send email endpoint using onFetch
  next.onFetch(async (request) => {
    if (request.url === 'https://api.resend.com/emails') {
      requests.push((await request.json()) as Record<string, unknown>)
      return Response.json({
        id: 'e2e-mock-email-id',
        object: 'email'
      })
    }
    // Let other requests pass through
    return 'continue'
  })

  return requests
}
