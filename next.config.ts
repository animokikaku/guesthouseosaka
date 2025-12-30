import { env } from '@/lib/env'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json'
  }
})

const nextConfig: NextConfig = {
  reactCompiler: env.NODE_ENV === 'production' ? true : false,
  typedRoutes: true,
  experimental: {
    typedEnv: true,
    turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true
  },
  images: {
    qualities: [75, 90],
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1600],
    imageSizes: [16, 32, 64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io'
      }
    ]
  }
}

export default withNextIntl(nextConfig)
