'use client'

import dynamic from 'next/dynamic'

import config from '@/sanity.config'

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((m) => ({ default: m.NextStudio })),
  { ssr: false }
)

export function StudioClientWrapper() {
  return <NextStudio config={config} />
}
