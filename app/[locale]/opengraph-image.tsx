import { url } from '@/lib/utils/blob-storage'
import { Locale } from 'next-intl'
import { getExtracted } from 'next-intl/server'
import { ImageResponse } from 'next/og'

export const alt = 'Share House Osaka'
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getExtracted({ locale: locale as Locale })
  const imageUrl = url('og-image.jpg')
  const logoUrl = url('logo.png')

  return new ImageResponse(
    (
      <div tw="relative flex h-full w-full">
        <img src={imageUrl} alt={t('Share House Osaka')} tw="h-full w-full" />
        <div tw="absolute left-4 top-4 flex items-center justify-center">
          <img src={logoUrl} alt="Guest House Osaka" width={322} height={209} />
        </div>
      </div>
    ),
    {
      ...size
    }
  )
}
