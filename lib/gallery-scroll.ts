'use client'

export function scrollToGalleryCategory(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
