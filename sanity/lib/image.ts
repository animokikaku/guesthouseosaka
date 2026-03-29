import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
})

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
