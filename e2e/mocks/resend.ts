/**
 * A stand-in for Resend's API, which the E2E build sends its emails to
 * (`RESEND_BASE_URL`, see playwright.config.ts): it accepts every email and
 * keeps it for the tests to read back, so a submission never reaches Resend and
 * the key in `.env` is never sent anywhere.
 *
 * Served by `resend-server.ts`, one of the suite's web servers.
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
export const RESEND_MOCK_PORT = 3101
export const RESEND_MOCK_BASE_URL = `http://127.0.0.1:${RESEND_MOCK_PORT}`

/** An email as the server sent it to Resend. */
export type SentEmail = Record<string, unknown> & { reply_to?: string | string[] }

/** The emails the server sent with `replyTo` set to `email`, which each test makes its own. */
export async function sentEmails(email: string): Promise<SentEmail[]> {
  const response = await fetch(`${RESEND_MOCK_BASE_URL}/emails`)
  const emails = (await response.json()) as SentEmail[]
  return emails.filter(({ reply_to }) => [reply_to].flat().includes(email))
}
