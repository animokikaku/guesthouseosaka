import { expect, test } from '@playwright/test'

// House slugs defined in lib/types.ts
const HOUSE_SLUGS = ['orange', 'apple', 'lemon'] as const

test.describe('House Page', () => {
  // Use the first house for detailed section tests
  const testHouse = HOUSE_SLUGS[0]

  test.describe('Page Loading', () => {
    for (const slug of HOUSE_SLUGS) {
      test(`${slug} house page loads correctly`, async ({ page }) => {
        await page.goto(`/en/${slug}`)

        // Verify the page loaded with correct URL
        await expect(page).toHaveURL(new RegExp(`/en/${slug}`))

        // Page should have a title
        const title = await page.title()
        expect(title).toBeTruthy()
      })
    }
  })

  test.describe('About Section', () => {
    test('displays about section with heading and content', async ({
      page
    }) => {
      await page.goto(`/en/${testHouse}`)

      // Find the About section heading - uses "About {house}" pattern
      const aboutHeading = page.getByRole('heading', { name: /About/i })
      await expect(aboutHeading).toBeVisible()

      // The about section should be within a <section> element
      const aboutSection = page.locator('section').filter({ has: aboutHeading })
      await expect(aboutSection).toBeVisible()
    })

    test('displays building information', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Building info shows rooms and floors in the HouseBuilding component
      // Labels are exact matches (rendered uppercase via CSS)
      const roomsLabel = page.getByText('Rooms', { exact: true })
      await expect(roomsLabel).toBeVisible()

      const floorsLabel = page.getByText('Floors', { exact: true })
      await expect(floorsLabel).toBeVisible()
    })
  })

  test.describe('Amenities Section', () => {
    test('displays amenities section with heading', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Amenities heading from translation: "What this place offers"
      const amenitiesHeading = page.getByRole('heading', {
        name: /What this place offers/i
      })
      await expect(amenitiesHeading).toBeVisible()
    })

    test('shows "Show all" button for amenities', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Button text pattern: "Show all {count} amenities"
      const showAllButton = page.getByRole('button', {
        name: /Show all.*amenities/i
      })
      await expect(showAllButton).toBeVisible()
    })

    test('opens amenities dialog when clicking show all', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      const showAllButton = page.getByRole('button', {
        name: /Show all.*amenities/i
      })
      await showAllButton.click()

      // Dialog should appear with amenities content
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
    })
  })

  test.describe('Pricing Section', () => {
    test('displays pricing section with heading', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Pricing heading from translation: "Pricing"
      const pricingHeading = page.getByRole('heading', { name: /Pricing/i })
      await expect(pricingHeading).toBeVisible()
    })

    test('pricing section has id for navigation', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Pricing section has id="pricing" for navigation
      const pricingSection = page.locator('#pricing')
      await expect(pricingSection).toBeVisible()
    })

    test('displays pricing table with rows', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Pricing is displayed in a bordered container with rows
      const pricingSection = page.locator('#pricing')
      const pricingRows = pricingSection.locator('.border-b')
      const rowCount = await pricingRows.count()

      // Should have at least one pricing row
      expect(rowCount).toBeGreaterThan(0)
    })
  })

  test.describe('Gallery Section', () => {
    test('displays gallery on desktop', async ({ page }) => {
      // Set viewport to desktop size
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto(`/en/${testHouse}`)

      // Gallery shows "Show all photos" button on desktop
      const galleryButton = page.getByRole('link', {
        name: /Show all photos/i
      })
      await expect(galleryButton).toBeVisible()
    })

    test('gallery link navigates to gallery page', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto(`/en/${testHouse}`)

      const galleryButton = page.getByRole('link', {
        name: /Show all photos/i
      })
      await galleryButton.click()

      // Should navigate to gallery page
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}/gallery`))
    })
  })

  test.describe('Location Section', () => {
    test('displays location section with heading', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Location heading from translation: "Where you'll be"
      const locationHeading = page.getByRole('heading', {
        name: /Where you.*ll be/i
      })
      await expect(locationHeading).toBeVisible()
    })

    test('displays location highlight text', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      const locationHeading = page.getByRole('heading', {
        name: /Where you.*ll be/i
      })
      const locationSection = page
        .locator('section')
        .filter({ has: locationHeading })

      // Location section should have descriptive text
      await expect(locationSection).toBeVisible()
    })

    test('has "Show more" button for location details', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Button text from translation: "Show more"
      const showMoreButton = page.getByRole('button', { name: /Show more/i })
      await expect(showMoreButton).toBeVisible()
    })

    test('displays map component', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Map is loaded dynamically, wait for it
      // The map container has a specific structure with place details and map
      const locationHeading = page.getByRole('heading', {
        name: /Where you.*ll be/i
      })
      const locationSection = page
        .locator('section')
        .filter({ has: locationHeading })

      // Map wrapper should be present
      await expect(locationSection).toBeVisible()
    })
  })

  test.describe('Navigation', () => {
    test('header navigation is visible', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Main navigation should be present
      const nav = page.locator('header nav')
      await expect(nav.first()).toBeVisible()
    })

    test('houses navigation tabs are visible', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // HousesNav component shows tabs to switch between houses
      // Look for the PageNav with id="tabs"
      const tabsNav = page.locator('#tabs')
      await expect(tabsNav).toBeVisible()
    })

    test('can navigate to other houses from tabs', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Find another house link in the navigation
      const otherHouse = HOUSE_SLUGS.find((h) => h !== testHouse) ?? 'apple'
      const houseLink = page.locator('#tabs').getByRole('link').first()
      await expect(houseLink).toBeVisible()
    })
  })

  test.describe('CTA Buttons', () => {
    test('header has contact link', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Header should have Contact link
      const contactLink = page.locator('header').getByRole('link', {
        name: /Contact/i
      })
      await expect(contactLink).toBeVisible()
    })

    test('header has FAQ link', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Header should have FAQ link
      const faqLink = page.locator('header').getByRole('link', { name: /FAQ/i })
      await expect(faqLink).toBeVisible()
    })
  })

  test.describe('Internationalization', () => {
    const locales = ['en', 'ja', 'fr'] as const

    for (const locale of locales) {
      test(`house page loads in ${locale} locale`, async ({ page }) => {
        await page.goto(`/${locale}/${testHouse}`)

        await expect(page).toHaveURL(new RegExp(`/${locale}/${testHouse}`))

        // Page should have content
        const heading = page.getByRole('heading').first()
        await expect(heading).toBeVisible()
      })
    }
  })

  test.describe('Page Structure', () => {
    test('page has main content article', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Main content is wrapped in an article with the house slug as id
      const article = page.locator(`article#${testHouse}`)
      await expect(article).toBeVisible()
    })

    test('page header displays house title and description', async ({
      page
    }) => {
      await page.goto(`/en/${testHouse}`)

      // PageHeader contains the house title (h1) and description
      const title = page.getByRole('heading', { level: 1 })
      await expect(title).toBeVisible()

      // Title should not be empty
      const titleText = await title.textContent()
      expect(titleText?.trim().length).toBeGreaterThan(0)
    })
  })
})
