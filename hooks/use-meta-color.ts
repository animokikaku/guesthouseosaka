import { META_THEME_COLORS } from '@/lib/config'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

/**
 * Keeps `<meta name="theme-color">` matching the resolved theme, including
 * when it follows a system preference change rather than a toggle.
 */
export function useSyncMetaColor() {
  const { resolvedTheme } = useTheme()

  const metaColor = resolvedTheme === 'dark' ? META_THEME_COLORS.dark : META_THEME_COLORS.light

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', metaColor)
  }, [metaColor])
}
