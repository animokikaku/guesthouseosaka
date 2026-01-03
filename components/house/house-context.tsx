'use client'

import { createContext, useContext } from 'react'
import type { HouseIdentifier } from '@/lib/types'

interface HouseDocumentContext {
  id: string
  type: string
  slug: HouseIdentifier
}

const HouseContext = createContext<HouseDocumentContext | null>(null)

export function HouseProvider({
  id,
  type,
  slug,
  children
}: HouseDocumentContext & { children: React.ReactNode }) {
  return (
    <HouseContext.Provider value={{ id, type, slug }}>
      {children}
    </HouseContext.Provider>
  )
}

export function useHouseDocument() {
  const context = useContext(HouseContext)
  if (!context) {
    throw new Error('useHouseDocument must be used within a HouseProvider')
  }
  return context
}
