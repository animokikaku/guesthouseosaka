import type { APIRequestContext } from '@playwright/test'

/** Port the Resend stub server listens on during E2E runs. */
export const RESEND_MOCK_PORT = Number(process.env.RESEND_MOCK_PORT ?? 3999)

/** Base URL handed to the Next server through `RESEND_BASE_URL`. */
export const RESEND_MOCK_BASE_URL = `http://localhost:${RESEND_MOCK_PORT}`

/** Reply-to addresses starting with this prefix are rejected by the stub. */
export const DELIVERY_FAILURE_PREFIX = 'delivery-failure'

/**
 * Build a unique reply-to address so parallel tests and retries never observe
 * each other's emails.
 */
export function uniqueReplyTo(prefix = 'e2e') {
  return `${prefix}-${crypto.randomUUID()}@example.com`
}

/**
 * Read the emails the stub server received for a given reply-to address.
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
export async function getSentEmails(request: APIRequestContext, replyTo: string) {
  const response = await request.get(`${RESEND_MOCK_BASE_URL}/emails`, { params: { replyTo } })

  if (!response.ok()) {
    throw new Error(`Resend stub returned ${response.status()} when listing emails`)
  }

  const { data } = (await response.json()) as { data: Record<string, unknown>[] }
  return data
}
