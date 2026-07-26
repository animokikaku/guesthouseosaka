import messages from '@/messages/en.json'
import { store } from '@/lib/store'
import type { GalleryCategories } from '@/lib/gallery'
import { toGalleryCategories } from '@/lib/transforms/gallery'
import { NextIntlClientProvider } from 'next-intl'
import { useLayoutEffect } from 'react'
import { HouseGallery } from './house-gallery'
import { GalleryModal } from './gallery-modal'

const galleryCategories = [
  {
    _key: 'bedrooms',
    category: {
      _id: 'bedrooms',
      label: 'Bedrooms',
      orderRank: 'a'
    },
    items: [
      {
        _key: 'first-room',
        image: {
          asset: {
            _ref: 'image-111111111111111111111111-1200x800-jpg',
            _type: 'reference'
          },
          hotspot: null,
          crop: null,
          alt: 'First room',
          preview: null
        }
      },
      {
        _key: 'second-room',
        image: {
          asset: {
            _ref: 'image-222222222222222222222222-1200x800-jpg',
            _type: 'reference'
          },
          hotspot: null,
          crop: null,
          alt: 'Second room',
          preview: null
        }
      },
      {
        _key: 'third-room',
        image: {
          asset: {
            _ref: 'image-333333333333333333333333-1200x800-jpg',
            _type: 'reference'
          },
          hotspot: null,
          crop: null,
          alt: 'Third room',
          preview: null
        }
      }
    ]
  }
] satisfies GalleryCategories

function useInitialPhoto(photoId: string | null) {
  useLayoutEffect(() => {
    store.setState((state) => ({ ...state, photoId }))

    return () => {
      store.setState((state) => ({ ...state, photoId: null }))
    }
  }, [photoId])
}

export function Open() {
  useInitialPhoto('first-room')

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <GalleryModal galleryCategories={galleryCategories} title="Orange House" />
    </NextIntlClientProvider>
  )
}

export function Interactive() {
  useInitialPhoto(null)

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <main className="p-6">
        <HouseGallery categories={toGalleryCategories(galleryCategories)} />
      </main>
      <GalleryModal galleryCategories={galleryCategories} title="Orange House" />
    </NextIntlClientProvider>
  )
}
