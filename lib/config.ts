export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
}

/** The production origin, for canonical links when `VITE_APP_URL` isn't set. */
export const SITE_URL = 'https://guesthouseosaka.com'

/** The public Vercel Blob store holding the logos and Open Graph images (see `lib/assets.ts`). */
export const BLOB_STORAGE_URL = 'https://mnaukbn4lqwsvyid.public.blob.vercel-storage.com'

/** The Sanity project, for every environment; only the dataset differs (see wrangler.jsonc). */
export const SANITY_PROJECT_ID = '515wijoz'

/** The GROQ API version the queries and generated types are written against. */
export const SANITY_API_VERSION = '2026-03-14'

export const CONTACT_EMAIL_DOMAIN = 'guesthouseosaka.com'
export const CONTACT_EMAIL = `info@${CONTACT_EMAIL_DOMAIN}`
