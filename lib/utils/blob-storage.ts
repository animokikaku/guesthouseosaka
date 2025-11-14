/**
 * Get the Vercel Blob Storage base URL from environment variables
 */
export function getBlobStorageUrl(): string {
  const url = process.env.NEXT_PUBLIC_BLOB_STORAGE_URL

  if (!url) {
    throw new Error('NEXT_PUBLIC_BLOB_STORAGE_URL is not set')
  }

  return url
}

/**
 * Construct a full URL from a blob storage path
 */
export function blobUrl(path: string): string {
  const baseUrl = getBlobStorageUrl()
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return new URL(cleanPath, baseUrl).toString()
}
