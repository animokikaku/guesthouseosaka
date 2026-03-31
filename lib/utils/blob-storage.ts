import { env } from '@/lib/env'

/**
 * Get the Vercel Blob Storage base URL from environment variables
 */
export function url(path: string): string {
  return new URL(path, env.NEXT_PUBLIC_BLOB_STORAGE_URL).toString()
}
