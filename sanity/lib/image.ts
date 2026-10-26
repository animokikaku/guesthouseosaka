import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { SANITY_PROJECT_ID } from '@/lib/config'
import { env } from '@/lib/env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET
})

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
