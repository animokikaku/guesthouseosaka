'use client'

import type { LegalNoticeQueryResult } from '@/sanity.types'
import { createContext, use, type ReactNode } from 'react'

type LegalNoticeData = NonNullable<LegalNoticeQueryResult>

// `undefined` marks a missing provider; `null` is a provider with no legal notice.
const LegalNoticeContext = createContext<LegalNoticeData | null | undefined>(undefined)

export function LegalNoticeProvider({
  children,
  data
}: {
  children: ReactNode
  data: LegalNoticeData | null
}) {
  return <LegalNoticeContext.Provider value={data}>{children}</LegalNoticeContext.Provider>
}

export function useLegalNotice(): LegalNoticeData | null {
  const context = use(LegalNoticeContext)
  if (context === undefined) {
    throw new Error('useLegalNotice must be used within LegalNoticeProvider')
  }
  return context
}
