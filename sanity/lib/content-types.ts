import { z } from '@/lib/zod'
import type { DocumentTypeName } from '@/studio/schemaTypes'

/**
 * The document types each loader in `loaders.functions.ts` reads, references
 * included. Its responses are tagged with them, so publishing a document only
 * purges what shows it (see `app/routes/api/revalidate.ts`). A query that
 * starts reading another type, directly or through `->`, must list it here,
 * or its responses miss that type's publishes until their cache expires.
 */
export const LOADER_CONTENT_TYPES = {
  // Every page renders the layout: its settings, and the houses in the header.
  localeLayout: ['settings', 'house'],
  homePage: ['homePage', 'house'],
  faqPage: ['faqPage', 'faqQuestion', 'house', 'pricingCategory'],
  contactLayout: ['contactPage', 'contactType'],
  legalNotice: ['legalNotice'],
  contactType: ['contactType'],
  housePage: ['house', 'galleryCategory', 'amenityCategory', 'amenity'],
  houseGallery: ['house', 'galleryCategory'],
  // The web app manifest's name.
  manifest: ['settings']
} as const satisfies Record<string, readonly DocumentTypeName[]>

const contentTypes = new Set<string>(Object.values(LOADER_CONTENT_TYPES).flat())

const webhookBodySchema = z.object({ _type: z.string() })

/**
 * The types to purge for a publish webhook's `{_id, _type}` body: its type when
 * a loader reads it, `null` for Sanity's own documents (assets show only once a
 * document using them is published), and `undefined`, everything, for any
 * other type or a body that doesn't say.
 */
export function typesToPurge(body: string): string[] | null | undefined {
  let json: unknown
  try {
    json = JSON.parse(body)
  } catch {
    return undefined
  }
  const parsed = webhookBodySchema.safeParse(json)
  if (!parsed.success) return undefined
  const type = parsed.data._type
  if (type.startsWith('sanity.') || type.startsWith('system.')) return null
  return contentTypes.has(type) ? [type] : undefined
}
