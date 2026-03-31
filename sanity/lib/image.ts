import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { ENV } from 'varlock/env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({
  projectId: ENV.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: ENV.NEXT_PUBLIC_SANITY_DATASET
})

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
