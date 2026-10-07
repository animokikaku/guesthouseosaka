// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { env } from '@/lib/env'
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type DefinedFetchType,
  type StrictDefinedFetchType
} from 'next-sanity/live'
import { cookies, draftMode } from 'next/headers'
import { client } from './client'

const token = env.SANITY_API_READ_TOKEN

const live = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true
})

export const { SanityLive } = live

// The defineLive fetch tags its result and sets its lifetime, but needs a
// cache boundary to attach them to.
const cachedSanityFetch: StrictDefinedFetchType = async (options) => {
  'use cache'
  return live.sanityFetch(options)
}

// cookies() is not allowed inside 'use cache', so the draft-mode perspective
// and stega are resolved here and passed into the cached fetch as arguments.
async function resolveDraftOptions() {
  if (!(await draftMode()).isEnabled) {
    return { perspective: 'published', variant: undefined, stega: false } as const
  }

  const jar = await cookies()
  const [perspective, variant] = await Promise.all([
    resolvePerspectiveFromCookies({ cookies: jar }),
    resolveVariantFromCookies({ cookies: jar })
  ])
  return { perspective: perspective ?? 'drafts', variant, stega: true } as const
}

export const sanityFetch: DefinedFetchType = async (options) => {
  const draft =
    options.perspective === undefined || options.stega === undefined
      ? await resolveDraftOptions()
      : undefined

  return cachedSanityFetch({
    ...options,
    perspective: options.perspective ?? draft?.perspective ?? 'published',
    variant: options.variant ?? draft?.variant,
    stega: options.stega ?? draft?.stega ?? false
  })
}
