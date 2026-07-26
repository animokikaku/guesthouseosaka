import { CategoryThumbnail } from '@/components/gallery/gallery-category-thumbnail'
import type { GalleryCategory } from '@/lib/gallery'

const category = {
  _key: 'living-room',
  _id: 'living-room',
  label: 'Living Room',
  thumbnail: {
    asset: {
      _ref: 'image-111111111111111111111111-640x480-jpg',
      _type: 'reference'
    },
    hotspot: null,
    crop: null,
    alt: 'Living room thumbnail',
    preview: null
  },
  items: [
    {
      _key: 'living-room-image',
      image: {
        asset: {
          _ref: 'image-222222222222222222222222-1200x800-jpg',
          _type: 'reference'
        },
        hotspot: null,
        crop: null,
        alt: 'Living room',
        preview: null
      }
    }
  ]
} satisfies GalleryCategory

export function WithTarget() {
  return (
    <main className="p-6">
      <CategoryThumbnail category={category} />
      <div aria-hidden className="h-300" />
      <section id={category._id} className="h-64 scroll-mt-3">
        <h2>Living Room Gallery</h2>
      </section>
    </main>
  )
}
