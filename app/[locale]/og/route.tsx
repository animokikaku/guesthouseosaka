/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const imageUrl = new URL('/og-image.jpg', request.url).toString()
  const logoUrl = new URL('/logo.png', request.url).toString()

  return new ImageResponse(
    (
      <div tw="relative flex h-full w-full">
        <img src={imageUrl} alt="Guest House Osaka" tw="h-full w-full" />
        <div tw="absolute left-4 top-4 flex items-center justify-center">
          <img
            src={logoUrl}
            alt="Guest House Osaka logo"
            width={322}
            height={209}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628
    }
  )
}
