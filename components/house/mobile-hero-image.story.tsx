import { galleryLink } from '@/components/house/gallery-link'
import { MobileHeroImage } from '@/components/house/mobile-hero-image'
import type { GallerySlide } from '@/lib/gallery'
import messages from '@/messages/en.json'
import { IntlProvider } from 'use-intl'

const images = ['Living room', 'Kitchen', 'Rooftop'].map((alt, index): GallerySlide => ({
  _key: `slide-${index}`,
  image: {
    asset: { _ref: `image-${String(index + 1).repeat(24)}-1200x800-jpg`, _type: 'reference' },
    hotspot: null,
    crop: null,
    alt,
    blurHash: null
  }
}))

const href = galleryLink('en', 'orange')

function Page({ children }: { children: React.ReactNode }) {
  return (
    <IntlProvider locale="en" messages={messages}>
      <main>{children}</main>
    </IntlProvider>
  )
}

export function Photos() {
  return (
    <Page>
      <MobileHeroImage href={href} images={images} />
    </Page>
  )
}

export function NoPhotos() {
  return (
    <Page>
      <MobileHeroImage href={href} images={[]} />
    </Page>
  )
}
