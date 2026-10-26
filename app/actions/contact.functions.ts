import type { ContactFormPayload } from '@/lib/schemas/contact-form'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { submitContactForm as submit } from './contact.server'

/**
 * The contact forms' submission endpoint. The payload is only typed here:
 * `submit` validates it with the form schema and reports a malformed one as a
 * failed submission rather than throwing.
 */
export const submitContactForm = createServerFn({ method: 'POST' })
  .validator((input: { payload: ContactFormPayload; turnstileToken?: string }) => input)
  .handler(({ data: { payload, turnstileToken } }) =>
    submit(payload, {
      turnstileToken,
      // Set by Cloudflare on every request that reaches the Worker.
      remoteIp: getRequestHeader('cf-connecting-ip')
    })
  )
