import { client } from '@/sanity/lib/client'
import { createDataAttribute as createSanityDataAttribute } from 'next-sanity'

type SanityDocument = {
  id: string
  type: string
}

export function createDataAttribute(data: SanityDocument) {
  const { projectId, dataset, stega } = client.config()
  const baseUrl = typeof stega.studioUrl === 'string' ? stega.studioUrl : ''

  return (fieldKey: string, itemKey?: string) => {
    const path = itemKey ? `${fieldKey}[_key=="${itemKey}"]` : fieldKey

    return createSanityDataAttribute({
      projectId,
      dataset,
      baseUrl,
      id: data.id,
      type: data.type,
      path
    }).toString()
  }
}
