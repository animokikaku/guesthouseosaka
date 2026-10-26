import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useImperativeHandle, type Ref } from 'react'

export const TURNSTILE_TOKEN = 'turnstile-token'

/**
 * Stands in for `@marsidev/react-turnstile`, whose Cloudflare script jsdom
 * never loads: the challenge passes at once.
 */
export function Turnstile({
  ref
}: {
  ref?: Ref<Pick<TurnstileInstance, 'getResponse' | 'reset'>>
}) {
  useImperativeHandle(ref, () => ({ getResponse: () => TURNSTILE_TOKEN, reset: () => {} }))
  return null
}
