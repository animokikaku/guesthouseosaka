'use client'

import type { CarouselApi } from '@/components/ui/carousel'
import { useEffect, useState } from 'react'

/** The zero-based index of the carousel's selected slide, kept in sync as it scrolls. */
export function useCarouselIndex(api: CarouselApi) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!api) return

    const updateIndex = () => {
      setIndex(api.selectedScrollSnap())
    }

    updateIndex()
    api.on('select', updateIndex)
    api.on('reInit', updateIndex)

    return () => {
      api.off('select', updateIndex)
      api.off('reInit', updateIndex)
    }
  }, [api])

  return index
}
