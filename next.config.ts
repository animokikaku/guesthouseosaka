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
    // Locale corrections: jp → ja
    { source: '/jp', destination: '/ja', permanent: true },
    { source: '/jp/:path*', destination: '/ja/:path*', permanent: true },

    // Unsupported locales → default (en)
    { source: '/:locale(ko|kr|zh)', destination: '/en', permanent: true },
    { source: '/:locale(ko|kr|zh)/:path*', destination: '/en/:path*', permanent: true },

    // Legacy WordPress/old site content (no locale prefix)
    { source: '/:path(column|seo-blog|category)', destination: '/en', permanent: true },
    { source: '/:path(column|seo-blog|category|2013|wp-content)/:rest*', destination: '/en', permanent: true },

    // Legacy content (with locale prefix)
    { source: '/:locale(en|ja|fr)/column', destination: '/:locale', permanent: true },
    { source: '/:locale(en|ja|fr)/column/:path*', destination: '/:locale', permanent: true },

    // Removed pages
    { source: '/:locale(en|ja|fr)/:page(location|review)', destination: '/:locale', permanent: true },
    { source: '/:locale(en|ja|fr)/orange-house', destination: '/:locale/orange', permanent: true },
    { source: '/:locale(en|ja|fr)/:house(orange|apple|lemon)/access', destination: '/:locale/:house', permanent: true },

    // Non-existent house slugs
    { source: '/:locale(en|ja|fr)/:house(banana|melon)', destination: '/:locale', permanent: true },
    { source: '/:locale(en|ja|fr)/:house(banana|melon)/:path*', destination: '/:locale', permanent: true },

    // Typos
    { source: '/:locale(en|ja|fr)/oranged', destination: '/:locale/orange', permanent: true },
    { source: '/:locale(en|ja|fr)/link', destination: '/:locale', permanent: true }
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
