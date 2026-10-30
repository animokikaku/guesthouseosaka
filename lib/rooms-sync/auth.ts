/**
 * Whether the request carries `Authorization: Bearer <token>`; always false
 * without a token. Compares digests, so the time taken doesn't reveal how much
 * of the token matched.
 */
export async function hasBearerToken(request: Request, token: string | undefined) {
  if (!token) return false
  const digest = async (value: string) =>
    new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
  const [given, expected] = await Promise.all([
    digest(request.headers.get('Authorization') ?? ''),
    digest(`Bearer ${token}`)
  ])
  return given.every((byte, index) => byte === expected[index])
}
