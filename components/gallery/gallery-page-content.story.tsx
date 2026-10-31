import { GalleryModalCloseButton } from '@/components/gallery/gallery-back-button'
import { GalleryModal } from '@/components/gallery/gallery-modal'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import type { GalleryCategories } from '@/lib/gallery'
import messages from '@/messages/en.json'
import { IntlProvider } from 'use-intl'

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
          blurHash: null
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
          blurHash: null
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
          blurHash: null
        }
      }
    ]
  }
] satisfies GalleryCategories

export function Default() {
  return (
    <IntlProvider locale="en" messages={messages}>
      <div className="h-screen w-screen">
        <GalleryPageContent
          documentId="house-1"
          documentType="house"
          galleryCategories={galleryCategories}
          title="Orange House"
          backButton={<span>Back</span>}
        />
      </div>
    </IntlProvider>
  )
}

// Mirrors app/routes/$locale/$house/_house/photos.tsx: the lightbox nested
// inside the route-intercept modal, so Escape-key handling between the two can
// be exercised the way it actually renders in production.
export function WithModal() {
  return (
    <IntlProvider locale="en" messages={messages}>
      <GalleryModal house="orange" title="Orange House">
        <GalleryPageContent
          documentId="house-1"
          documentType="house"
          galleryCategories={galleryCategories}
          title="Orange House"
          backButton={<GalleryModalCloseButton />}
        />
      </GalleryModal>
    </IntlProvider>
  )
}
