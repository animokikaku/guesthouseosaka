import { env } from '@/lib/env'
import { HouseIdentifier } from '@/lib/types'

export const CONTACT_EMAIL_FROM = 'Guest House Osaka <info@guesthouseosaka.com>'
export const DEFAULT_PREVIEW_CONTACT_RECIPIENT =
  'delivered+guesthouseosaka-contact-preview@resend.dev'

export function getContactRecipient(places?: HouseIdentifier[]) {
  if (env.VERCEL_ENV === 'preview') {
    return DEFAULT_PREVIEW_CONTACT_RECIPIENT
  }

  if (env.NODE_ENV !== 'production') {
    return 'dev@guesthouseosaka.com'
  }

  if (places?.length === 1) {
    return `${places[0]}@guesthouseosaka.com`
  }

  return 'info@guesthouseosaka.com'
}
