import { createDataAttribute as createSanityDataAttribute } from 'next-sanity'

import { client } from '@/sanity/lib/client'

type SanityDocument = {
  id: string
  type: string
}

const { projectId, dataset, stega } = client.config()

const dataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === 'string' ? stega.studioUrl : ''
}

export function createDataAttribute(data: SanityDocument) {
  return (fieldKey: string, itemKey?: string) => {
    const path = itemKey
      ? `${fieldKey}[_key=="${itemKey}"]`
      : fieldKey

    return createSanityDataAttribute({
      ...dataAttributeConfig,
      id: data.id,
      type: data.type,
      path
    }).toString()
  }
}
