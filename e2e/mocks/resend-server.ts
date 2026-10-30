// The Resend stand-in described in `resend.ts`, run by playwright.config.ts.
import { createServer } from 'node:http'
import { RESEND_MOCK_PORT, type SentEmail } from './resend'

const emails: SentEmail[] = []

createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/emails') {
    response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(emails))
    return
  }
  if (request.method === 'POST' && request.url === '/emails') {
    const chunks: Buffer[] = []
    for await (const chunk of request) chunks.push(Buffer.from(chunk))
    emails.push(JSON.parse(Buffer.concat(chunks).toString('utf8')) as SentEmail)
    response
      .writeHead(200, { 'content-type': 'application/json' })
      .end(JSON.stringify({ id: `e2e-mock-email-${emails.length}`, object: 'email' }))
    return
  }
  // Any other endpoint (batch send, retrieval, …) is unmocked: fail the call.
  response
    .writeHead(404, { 'content-type': 'application/json' })
    .end(
      JSON.stringify({ name: 'not_found', message: `Unmocked: ${request.method} ${request.url}` })
    )
}).listen(RESEND_MOCK_PORT, '127.0.0.1')
