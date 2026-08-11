import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import type { GalleryCategories } from '@/lib/gallery'
import messages from '@/messages/en.json'
import { NextIntlClientProvider } from 'next-intl'

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

export function Default() {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <div className="h-screen w-screen">
        <GalleryPageContent
          documentId="house-1"
          documentType="house"
          galleryCategories={galleryCategories}
          title="Orange House"
          backButton={<span>Back</span>}
        />
      </div>
    </NextIntlClientProvider>
  )
}
