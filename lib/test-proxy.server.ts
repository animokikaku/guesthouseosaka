import { AsyncLocalStorage } from 'node:async_hooks'

/**
 * Lets each Playwright test answer the outbound `fetch` calls the server makes
 * on its behalf, as Next's `experimental.testProxy` did: the suite's fixture
 * (`e2e/fixtures/server-fetch.ts`) tags same-origin requests with
 * {@link TEST_PROXY_HEADER}, and every `fetch` made while serving one is sent
 * to that test's proxy first, which answers it or lets it through.
 *
 * Only compiled into builds made with `E2E_TEST_PROXY=1`; see `app/start.ts`.
 */
export const TEST_PROXY_HEADER = 'x-e2e-test-proxy'

/** What the fixture's proxy answers for one intercepted request. */
export type TestProxyReply =
  | { action: 'continue' | 'abort' }
  | { action: 'respond'; status: number; headers: [string, string][]; body: string | null }

const scope = new AsyncLocalStorage<string>()
const originalFetch = globalThis.fetch

async function proxiedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const proxyUrl = scope.getStore()
  if (!proxyUrl) return originalFetch(input, init)

  const request = new Request(input, init)
  const body = request.body ? Buffer.from(await request.clone().arrayBuffer()) : null
  const proxyResponse = await originalFetch(proxyUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      url: request.url,
      method: request.method,
      headers: [...request.headers],
      body: body?.toString('base64') ?? null
    })
  })
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- written by the fixture
  const reply = (await proxyResponse.json()) as TestProxyReply

  switch (reply.action) {
    case 'continue':
      return originalFetch(request)
    case 'abort':
      throw new Error(`Test proxy aborted ${request.method} ${request.url}`)
    case 'respond':
      return new Response(reply.body === null ? null : Buffer.from(reply.body, 'base64'), {
        status: reply.status,
        headers: reply.headers
      })
  }
}

/** Runs `handle` with its outbound `fetch` calls routed to the request's test proxy, if any. */
export function withTestProxy<T>(request: Request, handle: () => T): T {
  const proxyUrl = request.headers.get(TEST_PROXY_HEADER)
  if (!proxyUrl) return handle()

  globalThis.fetch = Object.assign(proxiedFetch, { preconnect: originalFetch.preconnect })
  return scope.run(proxyUrl, handle)
}
