'use client'

import dynamic from 'next/dynamic'

const VercelAnalytics = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  { ssr: false }
)

export function Analytics() {
  return <VercelAnalytics />
}
