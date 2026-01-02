'use client'

import type { LegalNoticeQueryResult } from '@/sanity.types'
import { createContext, useContext, type ReactNode } from 'react'

type LegalNoticeData = NonNullable<LegalNoticeQueryResult>

const LegalNoticeContext = createContext<LegalNoticeData | null>(null)

export function LegalNoticeProvider({
  children,
  data
}: {
  children: ReactNode
  data: LegalNoticeData | null
}) {
  return (
    <LegalNoticeContext.Provider value={data}>
      {children}
    </LegalNoticeContext.Provider>
  )
}

export function useLegalNotice(): LegalNoticeData | null {
  const context = useContext(LegalNoticeContext)
  if (context === undefined) {
    throw new Error('useLegalNotice must be used within LegalNoticeProvider')
  }
  return context
}
