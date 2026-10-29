import { test as base } from './test'
import { createServer, type IncomingMessage } from 'node:http'
import type { AddressInfo } from 'node:net'
import { TEST_PROXY_HEADER, type TestProxyReply } from '../../lib/test-proxy.server'

/**
 * Answers one `fetch` the server makes while handling this test's requests:
 * a `Response` to reply with, `'continue'` to let it through, `'abort'` to
 * fail it, or `undefined` to leave it to the next handler.
 */
type FetchHandler = (
  request: Request
) =>
  | Response
  | 'continue'
  | 'abort'
  | undefined
  | Promise<Response | 'continue' | 'abort' | undefined>

export type ServerFetch = {
  /** Handlers run last registered first; a fetch none of them answers is aborted. */
  onFetch: (handler: FetchHandler) => void
}

type TestProxy = { url: string; handlers: Map<string, FetchHandler[]> }

async function readJson(request: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of request) chunks.push(Buffer.from(chunk))
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
    url: string
    method: string
    headers: [string, string][]
    body: string | null
  }
}

async function reply(handlers: FetchHandler[], request: Request): Promise<TestProxyReply> {
  for (const handler of handlers.toReversed()) {
    const result = await handler(request.clone())
    if (result === undefined) continue
    if (result === 'continue' || result === 'abort') return { action: result }
    const body = await result.arrayBuffer()
    return {
      action: 'respond',
      status: result.status,
      headers: [...result.headers],
      body: body.byteLength ? Buffer.from(body).toString('base64') : null
    }
  }
  return { action: 'abort' }
}

/**
 * Mocks the server's outbound requests per test, as Next's
 * `next/experimental/testmode/playwright` did: requests to the app carry
 * {@link TEST_PROXY_HEADER}, so a build made with `E2E_TEST_PROXY=1` sends
 * every `fetch` it makes for them to this worker's proxy (see
 * `lib/test-proxy.server.ts`), which asks the test's handlers.
 */
export const test = base.extend<{ serverFetch: ServerFetch }, { testProxy: TestProxy }>({
  testProxy: [
    // oxlint-disable-next-line no-empty-pattern -- Playwright requires the destructuring
    async ({}, use) => {
      const handlers = new Map<string, FetchHandler[]>()
      const server = createServer(async (incoming, outgoing) => {
        const testId = decodeURIComponent(incoming.url?.slice(1) ?? '')
        const { url, method, headers, body } = await readJson(incoming)
        const request = new Request(url, {
          method,
          headers: headers.filter(([name]) => !['content-length', 'host'].includes(name)),
          body: body === null ? undefined : Buffer.from(body, 'base64')
        })
        outgoing.setHeader('content-type', 'application/json')
        outgoing.end(JSON.stringify(await reply(handlers.get(testId) ?? [], request)))
      })
      await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
      const { port } = server.address() as AddressInfo

      await use({ url: `http://127.0.0.1:${port}`, handlers })
      server.close()
    },
    { scope: 'worker' }
  ],

  serverFetch: async ({ page, baseURL, testProxy }, use, testInfo) => {
    const handlers: FetchHandler[] = []
    testProxy.handlers.set(testInfo.testId, handlers)

    // Only the app's own requests (documents, server functions) carry the header.
    const appOrigin = new URL(baseURL ?? '').origin
    const proxyUrl = `${testProxy.url}/${encodeURIComponent(testInfo.testId)}`
    await page.route('**', (route) => {
      const request = route.request()
      if (new URL(request.url()).origin !== appOrigin) return route.fallback()
      return route.fallback({ headers: { ...request.headers(), [TEST_PROXY_HEADER]: proxyUrl } })
    })

    await use({ onFetch: (handler) => handlers.push(handler) })
    testProxy.handlers.delete(testInfo.testId)
  }
})

export { expect } from './test'
