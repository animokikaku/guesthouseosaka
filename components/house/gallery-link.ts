import type { HouseIdentifier } from '@/lib/types'
import { linkOptions } from '@tanstack/react-router'
import type { Locale } from 'use-intl'

/**
 * Opens a house's gallery as a modal over its page while the address bar shows
 * the gallery page, which a reload or a shared link then opens in full.
 */
export function galleryLink(locale: Locale, house: HouseIdentifier) {
  return linkOptions({
    to: '/$locale/$house/photos',
    params: { locale, house },
    mask: { to: '/$locale/$house/gallery', params: { locale, house } },
    resetScroll: false,
    // The dialog animates itself, and its lightbox runs view transitions of
    // its own, which a page transition would cut short.
    viewTransition: false
  })
}

export type GalleryLink = ReturnType<typeof galleryLink>
