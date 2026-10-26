export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
}

/** The production origin, for canonical links when `VITE_APP_URL` isn't set. */
export const SITE_URL = 'https://guesthouseosaka.com'

/** The public R2 bucket holding the logos and Open Graph images (see `lib/assets.ts`). */
export const ASSETS_URL = 'https://assets.guesthouseosaka.com'

/** The Sanity project, for every environment; only the dataset differs (see vite.config.ts). */
export const SANITY_PROJECT_ID = '515wijoz'

/** The GROQ API version the queries and generated types are written against. */
export const SANITY_API_VERSION = '2026-03-14'

/**
 * The hosted Studio (`<host>.sanity.studio`) editing each dataset, which
 * `/studio` redirects to and `.github/workflows/studio.yml` deploys.
 */
export const SANITY_STUDIO_HOSTS = {
  production: 'guesthouseosaka',
  development: 'guesthouseosaka-dev'
} as const

export const CONTACT_EMAIL_DOMAIN = 'guesthouseosaka.com'
export const CONTACT_EMAIL = `info@${CONTACT_EMAIL_DOMAIN}`

/**
 * Cloudflare's always-passing Turnstile sitekey, which works on any hostname.
 * Every build but production uses it (see vite.config.ts), paired with the
 * matching test secret in wrangler.jsonc.
 * @see https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 */
export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
