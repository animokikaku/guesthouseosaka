'use client'

import { useTheme } from 'next-themes'
import { useEffect, useEffectEvent } from 'react'

import { Button } from '@/components/ui/button'
import { useSyncMetaColor } from '@/hooks/use-meta-color'
import { useTranslations } from 'next-intl'

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true

  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true" i], [contenteditable="plaintext-only" i]'
    )
  )
}

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const t = useTranslations('ModeSwitcher')
  useSyncMetaColor()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const onShortcutKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
    if (isEditableTarget(event.target) || event.key.toLowerCase() !== 'd') return

    toggleTheme()
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => onShortcutKeyDown(event)

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group/toggle extend-touch-target size-8"
      onClick={toggleTheme}
      title={t('toggle_theme')}
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4.5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
      <span className="sr-only">{t('toggle_theme')}</span>
    </Button>
  )
}
