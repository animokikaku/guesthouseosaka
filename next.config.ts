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
  reactCompiler: env.NODE_ENV === 'production',
  typedRoutes: true,
  redirects: async () => [
    // Locale corrections: jp → ja
    { source: '/jp', destination: '/ja', permanent: true },
    { source: '/jp/:path*', destination: '/ja/:path*', permanent: true },

    // Unsupported locales → default (en)
    { source: '/:locale(ko|kr|zh)', destination: '/en', permanent: true },
    {
      source: '/:locale(ko|kr|zh)/:path*',
      destination: '/en/:path*',
      permanent: true
    },

    // Renamed pages
    {
      source: '/:locale(en|ja|fr)/orange-house',
      destination: '/:locale/orange',
      permanent: true
    },
    {
      source: '/:locale(en|ja|fr)/oranged',
      destination: '/:locale/orange',
      permanent: true
    },
    {
      source: '/:locale(en|ja|fr)/:house(orange|apple|lemon)/access',
      destination: '/:locale/:house',
      permanent: true
    },

    // Removed houses
    {
      source: '/:locale(en|ja|fr)/:house(banana|melon)',
      destination: '/:locale',
      permanent: true
    },
    {
      source: '/:locale(en|ja|fr)/:house(banana|melon)/:path*',
      destination: '/:locale',
      permanent: true
    },

    // Removed pages
    {
      source:
        '/:locale(en|ja|fr)/:path(column|seo-blog|category|location|review|feed|rss|blog|news|about|gallery|rooms|price|prices|access|privacy|terms|link)',
      destination: '/:locale',
      permanent: true
    },
    {
      source:
        '/:locale(en|ja|fr)/:path(column|seo-blog|category|2013|wp-content)/:rest*',
      destination: '/:locale',
      permanent: true
    },
    {
      source: '/:locale(en|ja|fr)/:path(reservation|booking|contact-us)',
      destination: '/:locale/contact',
      permanent: true
    }
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
