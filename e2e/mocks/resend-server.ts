import { DELIVERY_FAILURE_PREFIX, RESEND_MOCK_PORT } from './resend'

/**
 * Stub of the Resend send-email endpoint, started by Playwright and wired into
 * the Next server through `RESEND_BASE_URL` so contact form submissions never
 * reach the real API.
 *
 * - `POST /emails` records the payload and answers 200, or 422 when the
 *   reply-to address starts with {@link DELIVERY_FAILURE_PREFIX}.
 * - `GET /emails?replyTo=…` returns the recorded payloads for that address.
 *
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
const sentEmails: Record<string, unknown>[] = []

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, init)
}

const server = Bun.serve({
  port: RESEND_MOCK_PORT,
  async fetch(request) {
    const { pathname, searchParams } = new URL(request.url)

    if (pathname !== '/emails') {
      return json({ message: 'Not found', name: 'not_found', statusCode: 404 }, { status: 404 })
    }

    if (request.method === 'GET') {
      const replyTo = searchParams.get('replyTo')
      return json({
        data: replyTo ? sentEmails.filter((email) => email.reply_to === replyTo) : sentEmails
      })
    }

    if (request.method !== 'POST') {
      return json(
        { message: 'Method not allowed', name: 'method_not_allowed', statusCode: 405 },
        { status: 405 }
      )
    }

    let email: Record<string, unknown>
    try {
      const body: unknown = await request.json()
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return json(
          { message: 'Invalid JSON body', name: 'validation_error', statusCode: 400 },
          { status: 400 }
        )
      }
      email = body as Record<string, unknown>
    } catch {
      return json(
        { message: 'Invalid JSON body', name: 'validation_error', statusCode: 400 },
        { status: 400 }
      )
    }

    sentEmails.push(email)

    const replyTo = typeof email.reply_to === 'string' ? email.reply_to : ''
    if (replyTo.startsWith(DELIVERY_FAILURE_PREFIX)) {
      return json(
        { message: 'The email could not be delivered.', name: 'validation_error', statusCode: 422 },
        { status: 422 }
      )
    }

    return json({ id: 'e2e-mock-email-id', object: 'email' })
  }
})

console.log(`Resend stub listening on http://localhost:${server.port}`)
