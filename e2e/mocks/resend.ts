import type { NextFixture } from 'next/experimental/testmode/playwright'

/**
 * Base URL handed to the Resend SDK through `RESEND_BASE_URL` during E2E runs.
 *
 * `.invalid` is reserved by RFC 2606 and never resolves, so a submission this
 * mock fails to match cannot reach the real API with a live key — it fails the
 * test instead. `https` so that a resolver which hijacks NXDOMAIN still cannot
 * see the key: the handshake fails before the `Authorization` header is sent.
 */
export const RESEND_MOCK_BASE_URL = 'https://resend.invalid'

const RESEND_MOCK_ORIGIN = new URL(RESEND_MOCK_BASE_URL).origin

type MockResendAPIOptions = {
  body?: Record<string, unknown>
  status?: number
}

/**
 * Mock the Resend send-email endpoint for E2E tests.
 *
 * Runs through Next's test proxy (`experimental.testProxy`), so each test gets
 * its own interception scope and outgoing submissions never reach the real API.
 *
 * Requests to other hosts return `undefined` so later-registered handlers still
 * see them; only the fallback in the spec decides whether they pass through.
 *
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
export function mockResendAPI(next: NextFixture, options: MockResendAPIOptions = {}) {
  const requests: Record<string, unknown>[] = []

  next.onFetch(async (request) => {
    const url = new URL(request.url)

    // Not Resend — fall through to the next handler
    if (url.origin !== RESEND_MOCK_ORIGIN) {
      return undefined
    }

    // Any other Resend endpoint (batch send, retrieval, …) is unmocked. Answer
    // it here rather than passing it through, so the call cannot escape.
    if (url.pathname !== '/emails') {
      return Response.json(
        {
          message: `Unmocked Resend endpoint: ${request.method} ${url.pathname}`,
          name: 'not_found',
          statusCode: 404
        },
        { status: 404 }
      )
    }

    requests.push((await request.json()) as Record<string, unknown>)
    return Response.json(options.body ?? { id: 'e2e-mock-email-id', object: 'email' }, {
      status: options.status ?? 200
    })
  })

  return requests
}
