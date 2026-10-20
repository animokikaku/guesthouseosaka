import { createHmac, timingSafeEqual } from 'node:crypto'
import { z } from './zod'

/** Whether the `x-line-signature` header signs the raw request body with the channel secret. */
export function isValidLineSignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false
  const expected = createHmac('sha256', secret).update(body).digest()
  const received = Buffer.from(signature, 'base64')
  return received.length === expected.length && timingSafeEqual(received, expected)
}

// Only the fields the bot reads; LINE sends many more event and message types.
const textMessageEventSchema = z.object({
  type: z.literal('message'),
  replyToken: z.string(),
  source: z.object({ userId: z.optional(z.string()) }),
  message: z.object({ type: z.literal('text'), text: z.string() })
})

const webhookSchema = z.object({ events: z.array(z.unknown()) })

export type LineTextMessageEvent = z.infer<typeof textMessageEventSchema>

/** The text messages in a webhook body. Stickers, follows and other events are skipped. */
export function textMessageEvents(payload: unknown): LineTextMessageEvent[] {
  const webhook = webhookSchema.safeParse(payload)
  if (!webhook.success) return []
  return webhook.data.events.flatMap((event) => {
    const parsed = textMessageEventSchema.safeParse(event)
    return parsed.success ? [parsed.data] : []
  })
}

const profileSchema = z.object({ displayName: z.string() })

/** The user's LINE display name, or undefined if LINE won't give it (e.g. they blocked the account). */
export async function getLineDisplayName(userId: string, accessToken: string) {
  const response = await fetch(`https://api.line.me/v2/bot/profile/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!response.ok) return undefined
  const profile = profileSchema.safeParse(await response.json())
  return profile.success ? profile.data.displayName : undefined
}

/**
 * Answers a message with its reply token. Replies are free on every LINE plan,
 * unlike push messages, which count against the monthly quota.
 */
export async function replyToLine(replyToken: string, text: string, accessToken: string) {
  const response = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyToken, messages: [{ type: 'text', text }] })
  })
  if (!response.ok) {
    console.error('LINE reply failed', response.status, await response.text())
  }
}
