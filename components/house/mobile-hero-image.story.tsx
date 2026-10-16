import { MobileHeroImage } from '@/components/house/mobile-hero-image'
import type { GallerySlide } from '@/lib/gallery'
import messages from '@/messages/en.json'
import { NextIntlClientProvider } from 'next-intl'

const images = ['Living room', 'Kitchen', 'Rooftop'].map((alt, index): GallerySlide => ({
  _key: `slide-${index}`,
  image: {
    asset: { _ref: `image-${String(index + 1).repeat(24)}-1200x800-jpg`, _type: 'reference' },
    hotspot: null,
    crop: null,
    alt,
    preview: null
  }
}))

const href = { pathname: '/[house]/gallery', params: { house: 'orange' } } as const

function Page({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <main>{children}</main>
    </NextIntlClientProvider>
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
