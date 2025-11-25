/* eslint-disable jsx-a11y/alt-text */
import { url } from '@/lib/utils/blob-storage'
import { ImageResponse } from 'next/og'

export const alt = 'Guest House Osaka'
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const imageUrl = url('og-image.jpg')
  const logoUrl = url('logo.png')

  return new ImageResponse(
    (
      <div tw="relative flex h-full w-full">
        <img src={imageUrl} tw="h-full w-full" />
        <div tw="absolute left-4 top-4 flex items-center justify-center">
          <img src={logoUrl} width={322} height={209} />
        </div>
      </div>
    ),
    {
      ...size
    }
  )
}
