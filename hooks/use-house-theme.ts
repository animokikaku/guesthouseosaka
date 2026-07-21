'use client'

import { applyActiveTheme, getHouseTheme } from '@/lib/utils/theme'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export function useHouseTheme() {
  const { house } = useParams<{ house?: string }>()

  useEffect(() => {
    applyActiveTheme(getHouseTheme(house))
    return () => applyActiveTheme('default')
  }, [house])
}
