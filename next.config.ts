import { env } from '@/lib/env'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    srcPath: ['./app', './components'],
    extract: {
      sourceLocale: 'en'
    },
    messages: {
      // Relative path to the directory
      path: './messages',
      // Either 'json' or 'po'
      format: 'po',
      // Either 'infer' to automatically detect locales based on
      // matching files in `path` or an explicit array of locales
      locales: 'infer'
    }
  }
})

const nextConfig: NextConfig = {
  reactCompiler: env.NODE_ENV === 'production' ? true : false,
  experimental: {
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
      }
    ]
  }
}

export default withNextIntl(nextConfig)
