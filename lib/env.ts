import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const vercelBlobHostname = /\.public\.blob\.vercel-storage\.com$/i

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test'])
  },
  client: {
    NEXT_PUBLIC_APP_URL: z
      .url()
      .default(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`),
    NEXT_PUBLIC_BLOB_STORAGE_URL: z
      .url()
      .refine((value) => vercelBlobHostname.test(new URL(value).hostname), {
        message: 'Must be a Vercel Blob Storage public URL'
      }),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1)
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BLOB_STORAGE_URL: process.env.NEXT_PUBLIC_BLOB_STORAGE_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  },
  emptyStringAsUndefined: true
})
