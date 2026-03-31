import { ENV } from 'varlock/env'

/**
 * Get the Vercel Blob Storage base URL from environment variables
 */
export function url(path: string): string {
  return new URL(path, ENV.NEXT_PUBLIC_BLOB_STORAGE_URL).toString()
}
