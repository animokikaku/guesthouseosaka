import { expect, test } from '@playwright/test'

test.describe('Contact Page', () => {
  test.describe('Contact Types List', () => {
    test('displays contact type options', async ({ page }) => {
      await page.goto('/en/contact')

      // The contact page displays contact types as clickable items
      // Check that the container with contact types exists
      const contactList = page.locator('[data-sanity]').first()
      await expect(contactList).toBeVisible()
    })

    test('contact types are clickable links', async ({ page }) => {
      await page.goto('/en/contact')

      // Check that there are clickable contact type items
      const links = page.locator('a[href*="/contact/"]')
      const count = await links.count()
      expect(count).toBeGreaterThan(0)
    })

    test('navigates to tour form when clicking tour option', async ({
      page
    }) => {
      await page.goto('/en/contact')

      // Click the first contact type link (tour)
      const tourLink = page.locator('a[href*="/contact/tour"]')
      if ((await tourLink.count()) > 0) {
        await tourLink.click()
        await expect(page).toHaveURL(/\/en\/contact\/tour/)
      }
    })
  })

  test.describe('Contact Form (General/Other)', () => {
    test('form loads with required fields', async ({ page }) => {
      await page.goto('/en/contact/other')

      // Check form exists
      const form = page.locator('form#other-form')
      await expect(form).toBeVisible()

      // Check name field
      const nameInput = page.locator('input[autocomplete="name"]')
      await expect(nameInput).toBeVisible()

      // Check email field
      const emailInput = page.locator('input[autocomplete="email"]')
      await expect(emailInput).toBeVisible()

      // Check message field (textarea)
      const messageField = page.locator('textarea')
      await expect(messageField).toBeVisible()
    })

    test('submit button is visible', async ({ page }) => {
      await page.goto('/en/contact/other')

      // Check submit button exists
      const submitButton = page.locator('button[type="submit"]')
      await expect(submitButton).toBeVisible()
    })

    test('privacy policy checkbox is present', async ({ page }) => {
      await page.goto('/en/contact/other')

      // Check privacy policy checkbox
      const privacyCheckbox = page.locator('button[role="checkbox"]')
      await expect(privacyCheckbox).toBeVisible()

      // Privacy policy text/link should be present
      const privacyText = page.getByText(/privacy/i)
      await expect(privacyText.first()).toBeVisible()
    })

    test('reset button is visible', async ({ page }) => {
      await page.goto('/en/contact/other')

      // Check reset button exists
      const resetButton = page.locator('button[type="reset"]')
      await expect(resetButton).toBeVisible()
    })
  })

  test.describe('Tour Form', () => {
    test('form loads with all required fields', async ({ page }) => {
      await page.goto('/en/contact/tour')

      // Check form exists
      const form = page.locator('form#tour-form')
      await expect(form).toBeVisible()

      // Check for user account fields
      const nameInput = page.locator('input[autocomplete="name"]')
      await expect(nameInput).toBeVisible()

      const emailInput = page.locator('input[autocomplete="email"]')
      await expect(emailInput).toBeVisible()

      // Check date field
      const dateInput = page.locator('input[type="date"]')
      await expect(dateInput).toBeVisible()

      // Check time field
      const timeInput = page.locator('input[type="time"]')
      await expect(timeInput).toBeVisible()
    })

    test('house selection toggle group is present', async ({ page }) => {
      await page.goto('/en/contact/tour')

      // Check for toggle group (house selection)
      const toggleGroup = page.locator('[role="group"]')
      await expect(toggleGroup.first()).toBeVisible()
    })

    test('submit and reset buttons are visible', async ({ page }) => {
      await page.goto('/en/contact/tour')

      const submitButton = page.locator('button[type="submit"]')
      await expect(submitButton).toBeVisible()

      const resetButton = page.locator('button[type="reset"]')
      await expect(resetButton).toBeVisible()
    })
  })

  test.describe('Move-in Form', () => {
    test('form loads successfully', async ({ page }) => {
      await page.goto('/en/contact/move-in')

      // Check form exists
      const form = page.locator('form#move-in-form')
      await expect(form).toBeVisible()

      // Check for basic fields
      const nameInput = page.locator('input[autocomplete="name"]')
      await expect(nameInput).toBeVisible()

      const emailInput = page.locator('input[autocomplete="email"]')
      await expect(emailInput).toBeVisible()
    })
  })

  test.describe('Internationalization', () => {
    const locales = ['en', 'ja', 'fr'] as const

    for (const locale of locales) {
      test(`contact page loads in ${locale} locale`, async ({ page }) => {
        await page.goto(`/${locale}/contact`)
        await expect(page).toHaveURL(new RegExp(`/${locale}/contact`))

        // Contact types should be visible
        const links = page.locator('a[href*="/contact/"]')
        await expect(links.first()).toBeVisible()
      })
    }
  })
})

test.describe('FAQ Page', () => {
  test.describe('FAQ Accordion', () => {
    test('page loads with FAQ accordion', async ({ page }) => {
      await page.goto('/en/faq')

      // Check accordion exists (uses data-slot="accordion")
      const accordion = page.locator('[data-slot="accordion"]')
      await expect(accordion).toBeVisible()
    })

    test('accordion items are present', async ({ page }) => {
      await page.goto('/en/faq')

      // Check for accordion triggers (questions) using data-slot
      const accordionTriggers = page.locator('[data-slot="accordion-trigger"]')
      const count = await accordionTriggers.count()
      expect(count).toBeGreaterThan(0)
    })

    test('accordion items are expandable', async ({ page }) => {
      await page.goto('/en/faq')

      // Find and click first accordion trigger
      const firstTrigger = page
        .locator('[data-slot="accordion-trigger"]')
        .first()
      await expect(firstTrigger).toBeVisible()

      // Check initial state (should be collapsed)
      await expect(firstTrigger).toHaveAttribute('data-state', 'closed')

      // Click to expand
      await firstTrigger.click()

      // Check expanded state
      await expect(firstTrigger).toHaveAttribute('data-state', 'open')

      // Content should be visible
      const firstContent = page
        .locator('[data-slot="accordion-content"]')
        .first()
      await expect(firstContent).toBeVisible()
    })

    test('multiple accordion items can be expanded', async ({ page }) => {
      await page.goto('/en/faq')

      const triggers = page.locator('[data-slot="accordion-trigger"]')
      const count = await triggers.count()

      if (count >= 2) {
        // Expand first item
        await triggers.nth(0).click()
        await expect(triggers.nth(0)).toHaveAttribute('data-state', 'open')

        // Expand second item
        await triggers.nth(1).click()
        await expect(triggers.nth(1)).toHaveAttribute('data-state', 'open')

        // First should still be open (type="multiple")
        await expect(triggers.nth(0)).toHaveAttribute('data-state', 'open')
      }
    })
  })

  test.describe('FAQ Contact Section', () => {
    test('contact card is displayed', async ({ page }) => {
      await page.goto('/en/faq')

      // Check for the contact card
      const card = page.locator('[class*="card"]').last()
      await expect(card).toBeVisible()
    })

    test('phone contact table is present', async ({ page }) => {
      await page.goto('/en/faq')

      // Check for phone table
      const phoneTable = page.locator('table#phone')
      await expect(phoneTable).toBeVisible()

      // Check table has phone links
      const phoneLinks = phoneTable.locator('a[href^="tel:"]')
      const count = await phoneLinks.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Internationalization', () => {
    const locales = ['en', 'ja', 'fr'] as const

    for (const locale of locales) {
      test(`FAQ page loads in ${locale} locale`, async ({ page }) => {
        await page.goto(`/${locale}/faq`)
        await expect(page).toHaveURL(new RegExp(`/${locale}/faq`))

        // Accordion should be visible (uses data-slot="accordion")
        const accordion = page.locator('[data-slot="accordion"]')
        await expect(accordion).toBeVisible()
      })
    }
  })
})
