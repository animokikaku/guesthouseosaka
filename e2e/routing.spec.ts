import { expect, test } from './fixtures'

// Old URLs still carry links and search ranking, so each legacy pattern must
// keep answering with a permanent redirect to its current page.
const redirects = [
  ['/jp', '/ja'],
  ['/jp/faq', '/ja/faq'],
  ['/zh', '/zh-cn'],
  ['/zh-hant/contact', '/zh-tw/contact'],
  ['/ko', '/en'],
  ['/en/orange-house', '/en/orange'],
  ['/fr/apple/access', '/fr/apple'],
  ['/en/banana', '/en'],
  ['/ja/melon/gallery', '/ja'],
  ['/en/blog', '/en'],
  ['/en/wp-content/uploads/photo.jpg', '/en'],
  ['/en/reservation', '/en/contact']
] as const

test.describe('legacy URLs', () => {
  for (const [from, to] of redirects) {
    test(`${from} redirects permanently to ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 })

      expect(response.status()).toBe(308)
      expect(response.headers().location).toBe(to)
    })
  }
})

test.describe('missing pages', () => {
  for (const path of ['/en/pear', '/en/pear/gallery', '/en/contact/visit', '/fr/no-such-page']) {
    test(`${path} answers 404 with the localized not-found page`, async ({ page }) => {
      const response = await page.goto(path)

      expect(response?.status()).toBe(404)
      if (path.startsWith('/en')) {
        await expect(page.getByRole('link', { name: 'Back to home page' })).toBeVisible()
      }
    })
  }
})

test('serves a sitemap with every locale of each page', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  const xml = await response.text()

  expect(response.ok()).toBe(true)
  for (const hreflang of ['en', 'ja', 'fr', 'zh-CN', 'zh-TW']) {
    expect(xml).toContain(`hreflang="${hreflang}"`)
  }
  expect(xml).toContain('/zh-tw/orange/gallery')
})
