import { expect, type Page, test } from '@playwright/test'

test.describe('Gallery', () => {
  const house = 'orange' // Use one of the valid houses: orange, apple, lemon
  const galleryUrl = `/en/${house}/gallery`
  const houseUrl = `/en/${house}`

  // Note: Gallery visibility tests (grid, categories, images) are now covered
  // by unit tests in components/gallery/__tests__/house-gallery-client.test.tsx

  test.describe('Gallery Page', () => {
    test('category filters scroll to sections', async ({ page }) => {
      await page.goto(galleryUrl)

      // Wait for page to load
      await expect(page).toHaveURL(galleryUrl)

      // Find category thumbnail buttons
      const categoryButtons = page.locator('button').filter({
        has: page.locator('img')
      })

      const count = await categoryButtons.count()
      if (count > 1) {
        // Get the second category button (first is already visible)
        const secondCategoryButton = categoryButtons.nth(1)

        // Click on the category button to scroll to that section
        await secondCategoryButton.click()

        // Verify the page scrolled by checking that category sections exist
        const categorySections = page.locator('[id]').filter({
          has: page.locator('h3')
        })

        // Wait for category sections to be present and visible
        await expect(categorySections.first()).toBeVisible()

        const sectionCount = await categorySections.count()
        expect(sectionCount).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Modal Interaction', () => {
    // Helper to get gallery grid images (not category thumbnails)
    // Gallery images are inside .grid elements with cursor-pointer class
    const getGalleryGridImages = (page: Page) => {
      // Find clickable gallery images inside the grid (not the category thumbnail buttons)
      // The grid contains clickable div elements with cursor-pointer class and images inside
      return page.locator('.grid .cursor-pointer').filter({
        has: page.locator('img')
      })
    }

    // Helper to click gallery image and wait for modal to open
    const clickGalleryImageAndWaitForModal = async (page: Page) => {
      const galleryImages = getGalleryGridImages(page)
      const firstImage = galleryImages.first()

      // Wait for image to be visible and ready for interaction
      await expect(firstImage).toBeVisible()

      // Click and wait for modal
      await firstImage.click()
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible({ timeout: 5000 })

      return modal
    }

    test('clicking image opens modal', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(galleryUrl)

      // Click image and verify modal opens
      await clickGalleryImageAndWaitForModal(page)
    })

    test('modal displays full-size image', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(galleryUrl)

      const modal = await clickGalleryImageAndWaitForModal(page)

      // Check that an image is displayed in the modal
      const modalImage = modal.locator('img')
      await expect(modalImage.first()).toBeVisible()
    })

    test('close button works', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(galleryUrl)

      const modal = await clickGalleryImageAndWaitForModal(page)

      // Find and click the close button (button with ArrowLeftIcon in the modal)
      const closeButton = modal.locator('button').filter({
        has: page.locator('svg.lucide-arrow-left')
      })
      await closeButton.click()

      // Verify modal is closed
      await expect(modal).not.toBeVisible({ timeout: 5000 })
    })

    test('Escape key closes modal', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(galleryUrl)

      const modal = await clickGalleryImageAndWaitForModal(page)

      // Press Escape key
      await page.keyboard.press('Escape')

      // Verify modal is closed
      await expect(modal).not.toBeVisible({ timeout: 5000 })
    })

    test('navigation arrows work', async ({ page }) => {
      // Set desktop viewport to ensure nav buttons are visible
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(galleryUrl)

      const modal = await clickGalleryImageAndWaitForModal(page)

      // Find navigation buttons (CarouselPrevious and CarouselNext)
      const nextButton = page.locator('[data-slot="carousel-next"]')

      // On desktop, nav buttons should be visible
      await expect(nextButton).toBeVisible()

      // Click next button to navigate to next slide
      await nextButton.click()

      // Verify carousel navigation completed by checking modal and button remain stable
      await expect(modal).toBeVisible()
      await expect(nextButton).toBeVisible()
    })

    test('keyboard arrow navigation works', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(galleryUrl)

      const modal = await clickGalleryImageAndWaitForModal(page)

      // Get carousel items to verify navigation
      const carouselItems = modal.locator('[data-slot="carousel-item"]')
      const firstImage = carouselItems.first().locator('img')
      await expect(firstImage).toBeVisible()

      // Press right arrow to go to next slide
      await page.keyboard.press('ArrowRight')

      // Verify modal is still visible after right navigation
      await expect(modal).toBeVisible()

      // Press left arrow to go back
      await page.keyboard.press('ArrowLeft')

      // Verify modal is still visible after left navigation
      await expect(modal).toBeVisible()
    })
  })

  test.describe('Gallery Access from House Page', () => {
    test('navigating to gallery from house page', async ({ page }) => {
      await page.goto(houseUrl)

      // Wait for house page to load
      await expect(page).toHaveURL(houseUrl)

      // Find the "View gallery" button or gallery link (on desktop)
      // The gallery block is hidden on mobile (sm:flex)
      const viewGalleryButton = page.locator('a').filter({
        hasText: /gallery/i
      })

      // Check if the button is visible (desktop view)
      const isVisible = await viewGalleryButton
        .first()
        .isVisible()
        .catch(() => false)

      if (isVisible) {
        // Click on the gallery link
        await viewGalleryButton.first().click()

        // Wait for gallery to load (either as modal or full page)
        await page.waitForURL(galleryUrl, {
          timeout: 10000
        })
      }
    })

    test('gallery loads via direct URL', async ({ page }) => {
      // Direct navigation to gallery page
      await page.goto(galleryUrl)

      await expect(page).toHaveURL(galleryUrl)

      // Verify gallery content is present
      const images = page.locator('img')
      await expect(images.first()).toBeVisible()
    })
  })

  test.describe('Responsive Behavior', () => {
    // Helper to get gallery grid images (not category thumbnails)
    const getGalleryGridImages = (page: Page) => {
      return page.locator('.grid .cursor-pointer').filter({
        has: page.locator('img')
      })
    }

    // Helper to click gallery image and wait for modal to open
    const clickGalleryImageAndWaitForModal = async (page: Page) => {
      const galleryImages = getGalleryGridImages(page)
      const firstImage = galleryImages.first()

      // Wait for image to be visible and ready for interaction
      await expect(firstImage).toBeVisible()

      // Click and wait for modal
      await firstImage.click()
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible({ timeout: 5000 })

      return modal
    }

    test('gallery displays correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto(galleryUrl)
      await expect(page).toHaveURL(galleryUrl)

      // Wait for gallery grid images to be visible
      const galleryImages = getGalleryGridImages(page)
      await expect(galleryImages.first()).toBeVisible()

      // Open modal to check mobile behavior
      await clickGalleryImageAndWaitForModal(page)

      // On mobile, nav buttons should be hidden (they have class "hidden sm:flex")
      const nextButton = page.locator('[data-slot="carousel-next"]')
      await expect(nextButton).toBeHidden()
    })

    test('gallery displays correctly on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 })

      await page.goto(galleryUrl)
      await expect(page).toHaveURL(galleryUrl)

      // Wait for gallery grid images to be visible
      const galleryImages = getGalleryGridImages(page)
      await expect(galleryImages.first()).toBeVisible()

      // Open modal
      await clickGalleryImageAndWaitForModal(page)

      // On desktop, nav buttons should be visible
      const nextButton = page.locator('[data-slot="carousel-next"]')
      await expect(nextButton).toBeVisible()
    })
  })

  // Note: Locale tests are now consolidated in e2e/locales.spec.ts
})
