import { expect, test } from '@playwright/test'

// House slugs defined in lib/types/index.ts
const HOUSE_SLUGS = ['orange', 'apple', 'lemon'] as const

test.describe('House Page', () => {
  // Use the first house for detailed section tests
  const testHouse = HOUSE_SLUGS[0]

  test.describe('Page Loading', () => {
    for (const slug of HOUSE_SLUGS) {
      test(`${slug} house page loads correctly`, async ({ page }) => {
        await page.goto(`/en/${slug}`)

        await expect(page).toHaveURL(new RegExp(`/en/${slug}`))
        // The document is data-driven, so an empty title means the query failed
        await expect(page).toHaveTitle(/\S/)
        await expect(page.locator(`article#${slug}`)).toBeVisible()
      })
    }
  })

  // Search engines read the house as a lodging business from this block.
  test('describes the house in structured data', async ({ page }) => {
    await page.goto(`/en/${testHouse}`)

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    const house = blocks.map((block) => JSON.parse(block)).find((data) => data['@type'] === 'House')

    expect(house).toMatchObject({
      '@context': 'https://schema.org',
      url: expect.stringMatching(new RegExp(`/en/${testHouse}$`)),
      name: expect.any(String),
      telephone: expect.stringMatching(/^\+81/),
      image: expect.stringContaining('cdn.sanity.io')
    })
  })

  test('applies the house theme before hydration on direct visits', async ({ page }) => {
    await page.route('**/_next/static/chunks/*.js', (route) => route.abort())

    await page.goto(`/en/${testHouse}`, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('body')).toHaveClass(/theme-orange/)
  })

  test.describe('Navigation', () => {
    test('can navigate to other houses from tabs', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Find another house link in the navigation and click it
      const tabsNav = page.locator('#tabs')
      const houseLinks = tabsNav.getByRole('link')

      const firstLink = houseLinks.first()
      await firstLink.click()

      // Should navigate to another house page
      await expect(page).toHaveURL(new RegExp(`/en/(orange|apple|lemon)`))
      await expect(page.locator('body')).toHaveClass(/theme-(orange|red|yellow)/)
    })
  })

  test.describe('Availability', () => {
    test('jumps from the gallery badge to the availability list', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      const section = page.locator('section#availability')
      await page.locator('a[href$="#availability"]:visible').click()

      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}#availability$`))
      await expect(
        section.getByRole('heading', { level: 2, name: 'Availability' })
      ).toBeInViewport()
    })
  })

  test.describe('Gallery Modal', () => {
    // Cache Components keeps the closed modal alive in <Activity>, so reopening
    // it must not restore its closed state.
    test('reopens after being closed', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      const galleryLink = page
        .locator(`a[href="/en/${testHouse}/gallery"]`)
        .filter({ visible: true })
        .first()
      const dialog = page.getByRole('dialog')

      await galleryLink.click()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}/gallery$`))
      await expect(dialog).toBeVisible()

      await dialog.getByRole('button', { name: /\bclose\b/i }).click()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}$`))
      await expect(dialog).toBeHidden()

      await galleryLink.click()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}/gallery$`))
      await expect(dialog).toBeVisible()
    })

    test('reopens after browser back navigation', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      const galleryLink = page
        .locator(`a[href="/en/${testHouse}/gallery"]`)
        .filter({ visible: true })
        .first()
      const dialog = page.getByRole('dialog')

      await galleryLink.click()
      await expect(dialog).toBeVisible()

      await page.goBack()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}$`))
      await expect(dialog).toBeHidden()

      await galleryLink.click()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}/gallery$`))
      await expect(dialog).toBeVisible()
    })
  })

  // Note: Locale tests are now consolidated in e2e/locales.spec.ts
})
