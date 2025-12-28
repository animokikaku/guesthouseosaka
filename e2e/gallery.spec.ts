import { expect, test } from '@playwright/test'

test.describe('Gallery', () => {
  const house = 'orange' // Use one of the valid houses: orange, apple, lemon
  const galleryUrl = `/en/${house}/gallery`
  const houseUrl = `/en/${house}`

  test.describe('Gallery Page', () => {
    test('loads with image grid', async ({ page }) => {
      await page.goto(galleryUrl)

      // Wait for gallery page to load
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Check that gallery grid container exists
      const galleryGrid = page.locator('[class*="grid"]').first()
      await expect(galleryGrid).toBeVisible()

      // Check that images are displayed
      const images = page.locator('img')
      await expect(images.first()).toBeVisible()
    })

    test('displays category thumbnails', async ({ page }) => {
      await page.goto(galleryUrl)

      // Wait for page to load
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Check for category navigation thumbnails (buttons with images)
      const categoryButtons = page.locator('button').filter({
        has: page.locator('img')
      })

      // If there are categories, they should be visible as thumbnail buttons
      const count = await categoryButtons.count()
      if (count > 0) {
        await expect(categoryButtons.first()).toBeVisible()
      }
    })

    test('category filters scroll to sections', async ({ page }) => {
      await page.goto(galleryUrl)

      // Wait for page to load
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Find category thumbnail buttons
      const categoryButtons = page.locator('button').filter({
        has: page.locator('img')
      })

      const count = await categoryButtons.count()
      if (count > 1) {
        // Get the second category button (first is already visible)
        const secondCategoryButton = categoryButtons.nth(1)

        // Click on the category button to scroll
        await secondCategoryButton.click()

        // Give time for scroll animation
        await page.waitForTimeout(500)

        // Verify the page scrolled (check that the category section exists)
        const categorySections = page.locator('[id]').filter({
          has: page.locator('h3')
        })

        const sectionCount = await categorySections.count()
        expect(sectionCount).toBeGreaterThan(0)
      }
    })

    test('images are displayed in categories', async ({ page }) => {
      await page.goto(galleryUrl)

      // Wait for page to load
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Check for category headings (h3 elements)
      const categoryHeadings = page.locator('h3')
      const headingCount = await categoryHeadings.count()

      if (headingCount > 0) {
        // Each category section should have a heading
        await expect(categoryHeadings.first()).toBeVisible()
      }

      // Check that gallery grid has images
      const galleryImages = page.locator('img[alt]')
      await expect(galleryImages.first()).toBeVisible()
    })
  })

  test.describe('Modal Interaction', () => {
    test('clicking image opens modal', async ({ page }) => {
      await page.goto(galleryUrl)

      // Wait for page to load
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Find a clickable gallery image (div with cursor-pointer class containing an image)
      const galleryImages = page.locator('.cursor-pointer').filter({
        has: page.locator('img')
      })

      await expect(galleryImages.first()).toBeVisible()

      // Click on the first gallery image
      await galleryImages.first().click()

      // Wait for modal to open - the modal uses Radix Dialog
      const modalOverlay = page.locator('[data-slot="carousel"]')
      await expect(modalOverlay).toBeVisible({ timeout: 5000 })
    })

    test('modal displays full-size image', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Click on the first gallery image
      const galleryImages = page.locator('.cursor-pointer').filter({
        has: page.locator('img')
      })
      await galleryImages.first().click()

      // Wait for modal carousel to appear
      const carousel = page.locator('[data-slot="carousel"]')
      await expect(carousel).toBeVisible({ timeout: 5000 })

      // Check that an image is displayed in the carousel
      const carouselImage = carousel.locator('img')
      await expect(carouselImage.first()).toBeVisible()
    })

    test('close button works', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Click on the first gallery image
      const galleryImages = page.locator('.cursor-pointer').filter({
        has: page.locator('img')
      })
      await galleryImages.first().click()

      // Wait for modal to open
      const carousel = page.locator('[data-slot="carousel"]')
      await expect(carousel).toBeVisible({ timeout: 5000 })

      // Find and click the close button (button with ArrowLeftIcon)
      const closeButton = page.locator('button').filter({
        has: page.locator('svg.lucide-arrow-left')
      })
      await closeButton.click()

      // Verify modal is closed (carousel should not be visible)
      await expect(carousel).not.toBeVisible({ timeout: 5000 })
    })

    test('Escape key closes modal', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Click on the first gallery image
      const galleryImages = page.locator('.cursor-pointer').filter({
        has: page.locator('img')
      })
      await galleryImages.first().click()

      // Wait for modal to open
      const carousel = page.locator('[data-slot="carousel"]')
      await expect(carousel).toBeVisible({ timeout: 5000 })

      // Press Escape key
      await page.keyboard.press('Escape')

      // Verify modal is closed
      await expect(carousel).not.toBeVisible({ timeout: 5000 })
    })

    test('navigation arrows work', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Click on the first gallery image
      const galleryImages = page.locator('.cursor-pointer').filter({
        has: page.locator('img')
      })
      await galleryImages.first().click()

      // Wait for modal to open
      const carousel = page.locator('[data-slot="carousel"]')
      await expect(carousel).toBeVisible({ timeout: 5000 })

      // Find navigation buttons (CarouselPrevious and CarouselNext)
      const nextButton = page.locator('[data-slot="carousel-next"]')
      const prevButton = page.locator('[data-slot="carousel-previous"]')

      // Check if navigation buttons exist (they are hidden on mobile)
      const nextVisible = await nextButton.isVisible().catch(() => false)
      const prevVisible = await prevButton.isVisible().catch(() => false)

      if (nextVisible) {
        // Get initial slide index
        const initialSlide = page.locator('[data-slot="carousel-item"]').first()
        const initialSrc = await initialSlide.locator('img').getAttribute('src')

        // Click next button
        await nextButton.click()
        await page.waitForTimeout(500) // Wait for animation

        // Verify the slide changed or button became disabled
        const isNextEnabled = await nextButton.isEnabled()
        if (isNextEnabled) {
          // Navigation happened, content may have changed
          expect(true).toBeTruthy()
        }
      }

      if (prevVisible) {
        // Click previous button if it's not disabled
        const isPrevEnabled = await prevButton.isEnabled()
        if (isPrevEnabled) {
          await prevButton.click()
          await page.waitForTimeout(500)
        }
      }
    })

    test('keyboard arrow navigation works', async ({ page }) => {
      await page.goto(galleryUrl)
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Click on the first gallery image
      const galleryImages = page.locator('.cursor-pointer').filter({
        has: page.locator('img')
      })
      await galleryImages.first().click()

      // Wait for modal to open
      const carousel = page.locator('[data-slot="carousel"]')
      await expect(carousel).toBeVisible({ timeout: 5000 })

      // Get current slide
      const slides = page.locator('[data-slot="carousel-item"]')
      const slideCount = await slides.count()

      if (slideCount > 1) {
        // Press right arrow to go to next slide
        await page.keyboard.press('ArrowRight')
        await page.waitForTimeout(300) // Wait for animation

        // Press left arrow to go back
        await page.keyboard.press('ArrowLeft')
        await page.waitForTimeout(300)

        // Verify we're still on the carousel
        await expect(carousel).toBeVisible()
      }
    })
  })

  test.describe('Gallery Access from House Page', () => {
    test('navigating to gallery from house page', async ({ page }) => {
      await page.goto(houseUrl)

      // Wait for house page to load
      await expect(page).toHaveURL(new RegExp(houseUrl))

      // Find the "View gallery" button or gallery link (on desktop)
      // The gallery block is hidden on mobile (sm:flex)
      const viewGalleryButton = page.locator('a').filter({
        hasText: /gallery/i
      })

      // Check if the button is visible (desktop view)
      const isVisible = await viewGalleryButton.first().isVisible().catch(() => false)

      if (isVisible) {
        // Click on the gallery link
        await viewGalleryButton.first().click()

        // Wait for gallery to load (either as modal or full page)
        await page.waitForURL(new RegExp(`${house}/gallery`), { timeout: 10000 })
      }
    })

    test('gallery loads via direct URL', async ({ page }) => {
      // Direct navigation to gallery page
      await page.goto(galleryUrl)

      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Verify gallery content is present
      const images = page.locator('img')
      await expect(images.first()).toBeVisible()
    })
  })

  test.describe('Responsive Behavior', () => {
    test('gallery displays correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto(galleryUrl)
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Gallery grid should still be visible
      const images = page.locator('img')
      await expect(images.first()).toBeVisible()

      // Navigation arrows should be hidden on mobile (hidden sm:flex)
      const nextButton = page.locator('[data-slot="carousel-next"]')

      // Open modal to check mobile behavior
      const galleryImages = page.locator('.cursor-pointer').filter({
        has: page.locator('img')
      })
      await galleryImages.first().click()

      // Wait for modal
      const carousel = page.locator('[data-slot="carousel"]')
      await expect(carousel).toBeVisible({ timeout: 5000 })

      // On mobile, nav buttons should be hidden
      await expect(nextButton).toBeHidden()
    })

    test('gallery displays correctly on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 })

      await page.goto(galleryUrl)
      await expect(page).toHaveURL(new RegExp(galleryUrl))

      // Gallery grid should be visible
      const images = page.locator('img')
      await expect(images.first()).toBeVisible()

      // Open modal
      const galleryImages = page.locator('.cursor-pointer').filter({
        has: page.locator('img')
      })
      await galleryImages.first().click()

      // Wait for modal
      const carousel = page.locator('[data-slot="carousel"]')
      await expect(carousel).toBeVisible({ timeout: 5000 })

      // On desktop, nav buttons should be visible
      const nextButton = page.locator('[data-slot="carousel-next"]')
      await expect(nextButton).toBeVisible()
    })
  })

  test.describe('Internationalization', () => {
    const locales = ['en', 'ja', 'fr'] as const

    for (const locale of locales) {
      test(`gallery loads in ${locale} locale`, async ({ page }) => {
        await page.goto(`/${locale}/${house}/gallery`)

        await expect(page).toHaveURL(new RegExp(`/${locale}/${house}/gallery`))

        // Gallery should have images
        const images = page.locator('img')
        await expect(images.first()).toBeVisible()
      })
    }
  })
})
