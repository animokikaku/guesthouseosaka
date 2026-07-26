import { expect, test } from '@playwright/test'

test.describe('Gallery', () => {
  const house = 'orange' // Use one of the valid houses: orange, apple, lemon
  const galleryUrl = `/en/${house}/gallery`

  test('opens the selected image from the gallery grid', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(galleryUrl)
    await expect(page).toHaveURL(galleryUrl)

    const firstImage = page
      .locator('[data-testid="gallery-grid-image"]')
      .filter({ has: page.locator('img') })
      .first()
    const selectedImage = firstImage.locator('img')

    await expect(firstImage).toBeVisible()
    const selectedAlt = await selectedImage.getAttribute('alt')
    if (!selectedAlt) {
      throw new Error('The selected gallery image must have alt text.')
    }

    await firstImage.click()

    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible({ timeout: 5000 })
    await expect(modal.getByRole('img', { name: selectedAlt })).toBeVisible()
    await expect(modal.getByText(selectedAlt, { exact: true })).toBeVisible()
  })
})
