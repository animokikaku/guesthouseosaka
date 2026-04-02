import { expect, type Page, test } from '@playwright/test'

test.describe('Gallery', () => {
  const house = 'orange' // Use one of the valid houses: orange, apple, lemon
  const galleryUrl = `/en/${house}/gallery`

  // Note: Gallery visibility tests (grid, categories, images) are now covered
  // by unit tests in components/gallery/__tests__/house-gallery-client.test.tsx

  const getGalleryGridImages = (page: Page) =>
    page.locator('.grid .cursor-pointer').filter({
      has: page.locator('img')
    })

  const clickGalleryImageAndWaitForModal = async (page: Page) => {
    const firstImage = getGalleryGridImages(page).first()
    await expect(firstImage).toBeVisible()
    await firstImage.click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 5000 })
    return modal
  }

  const getVisibleCaptionText = async (modal: ReturnType<Page['locator']>) => {
    return modal.locator('span').evaluateAll((elements) => {
      const visibleTexts = elements
        .filter((element) => {
          const htmlElement = element as HTMLElement
          if (htmlElement.classList.contains('sr-only')) return false
          return !!(
            htmlElement.offsetWidth ||
            htmlElement.offsetHeight ||
            htmlElement.getClientRects().length
          )
        })
        .map((element) => element.textContent?.trim())
        .filter((text): text is string => Boolean(text))

      return visibleTexts.at(-1) ?? null
    })
  }

  test('desktop modal supports navigation and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(galleryUrl)
    await expect(page).toHaveURL(galleryUrl)

    const modal = await clickGalleryImageAndWaitForModal(page)
    await expect(modal.locator('img').first()).toBeVisible()
    const initialCaption = await getVisibleCaptionText(modal)

    const nextButton = page.locator('[data-slot="carousel-next"]')
    await expect(nextButton).toBeVisible()
    await nextButton.click()
    await expect.poll(() => getVisibleCaptionText(modal)).not.toBe(initialCaption)

    await page.keyboard.press('ArrowLeft')
    await expect.poll(() => getVisibleCaptionText(modal)).toBe(initialCaption)

    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible({ timeout: 5000 })
  })

  test('mobile modal hides carousel navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(galleryUrl)
    await expect(page).toHaveURL(galleryUrl)

    await clickGalleryImageAndWaitForModal(page)

    const nextButton = page.locator('[data-slot="carousel-next"]')
    await expect(nextButton).toBeHidden()
  })

  // Note: Locale tests are now consolidated in e2e/locales.spec.ts
})
