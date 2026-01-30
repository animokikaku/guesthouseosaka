import { env } from '@/lib/env'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json',
    messages: {
      path: './messages',
      locales: 'infer',
      format: 'json',
      precompile: true
    }
  }
})

const nextConfig: NextConfig = {
  reactCompiler: env.NODE_ENV === 'production' ? true : false,
  typedRoutes: true,
  redirects: async () => [
    // Typos / wrong paths
    { source: '/en/oranged', destination: '/en/orange', permanent: true },
    { source: '/en/link', destination: '/en', permanent: true },
    // Wrong locale: jp → ja
    { source: '/jp', destination: '/ja', permanent: true },
    { source: '/jp/:path*', destination: '/ja/:path*', permanent: true },
    { source: '/:locale(en|ja|fr)/jp/:path*', destination: '/ja/:path*', permanent: true },
    // Unsupported locale: ko → default (en)
    { source: '/ko', destination: '/en', permanent: true },
    { source: '/ko/:path*', destination: '/en/:path*', permanent: true },
    // Non-existent house slugs (valid: orange, apple, lemon)
    { source: '/:locale(en|ja|fr)/:house(banana|melon)', destination: '/:locale', permanent: true },
    { source: '/:locale(en|ja|fr)/:house(banana|melon)/:path*', destination: '/:locale', permanent: true },
    // Legacy content (no locale prefix)
    { source: '/:legacy(column|seo-blog|category)', destination: '/en', permanent: true },
    { source: '/:legacy(column|seo-blog|category)/:path*', destination: '/en', permanent: true },
    { source: '/2013/:path*', destination: '/en', permanent: true },
    // Locale-prefixed legacy content
    { source: '/:locale(en|ja|fr)/column', destination: '/:locale', permanent: true },
    { source: '/:locale(en|ja|fr)/column/:path*', destination: '/:locale', permanent: true }
  ],
  experimental: {
    typedEnv: true,
    turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
    testProxy: true
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
