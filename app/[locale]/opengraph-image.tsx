/* eslint-disable jsx-a11y/alt-text */
import { assets } from '@/lib/assets'
import { ImageResponse } from 'next/og'

export const alt = 'Guest House Osaka'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div tw="relative flex h-full w-full">
        <img {...assets.og} tw="h-full w-full" />
        <div tw="absolute left-4 top-4 flex items-center justify-center">
          <img {...assets.logo} width={322} height={209} />
        </div>
      </div>
    ),
    { ...size }
  )
}
