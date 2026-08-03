import { createServer } from 'node:http'
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

function json(body: unknown) {
  return JSON.stringify(body)
}

const server = createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url ?? '/', `http://localhost:${RESEND_MOCK_PORT}`)
  res.setHeader('content-type', 'application/json')

  if (pathname !== '/emails') {
    res.writeHead(404)
    res.end(json({ message: 'Not found', name: 'not_found', statusCode: 404 }))
    return
  }

  if (req.method === 'GET') {
    const replyTo = searchParams.get('replyTo')
    res.writeHead(200)
    res.end(
      json({
        data: replyTo ? sentEmails.filter((email) => email.reply_to === replyTo) : sentEmails
      })
    )
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405)
    res.end(json({ message: 'Method not allowed', name: 'method_not_allowed', statusCode: 405 }))
    return
  }

  const chunks: Buffer[] = []
  req.on('data', (chunk: Buffer) => chunks.push(chunk))
  req.on('end', () => {
    let email: Record<string, unknown>
    try {
      email = JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>
    } catch {
      res.writeHead(400)
      res.end(json({ message: 'Invalid JSON body', name: 'validation_error', statusCode: 400 }))
      return
    }

    sentEmails.push(email)

    const replyTo = typeof email.reply_to === 'string' ? email.reply_to : ''
    if (replyTo.startsWith(DELIVERY_FAILURE_PREFIX)) {
      res.writeHead(422)
      res.end(
        json({
          message: 'The email could not be delivered.',
          name: 'validation_error',
          statusCode: 422
        })
      )
      return
    }

    res.writeHead(200)
    res.end(json({ id: 'e2e-mock-email-id', object: 'email' }))
  })
})

server.listen(RESEND_MOCK_PORT, () => {
  console.log(`Resend stub listening on http://localhost:${RESEND_MOCK_PORT}`)
})
