import { expect, test } from './fixtures'

test.use({ viewport: { width: 390, height: 844 } })

test('lists every page and house, and closes once one is picked', async ({ mount, page }) => {
  const component = await mount('components/mobile-nav/Houses')
  const toggle = component.getByRole('button', { name: /\bmenu\b/i })

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  const menu = page.locator('[data-slot="mobile-nav-content"]')
  for (const [name, href] of [
    ['Home', '/en'],
    ['FAQ', '/en/faq'],
    ['Contact', '/en/contact'],
    ['Orange House', '/en/orange'],
    ['Apple House', '/en/apple'],
    ['Lemon House', '/en/lemon']
  ]) {
    await expect(menu.getByRole('link', { name })).toHaveAttribute('href', href)
  }

  await menu.getByRole('link', { name: 'Apple House' }).click()

  await expect(menu).toBeHidden()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('tells editors when no house is published', async ({ mount, page }) => {
  const component = await mount('components/mobile-nav/NoHouses')
  await component.getByRole('button', { name: /\bmenu\b/i }).click()

  const menu = page.locator('[data-slot="mobile-nav-content"]')
  await expect(menu.getByText('Content not available')).toBeVisible()
  await expect(menu.getByRole('link', { name: 'FAQ' })).toBeVisible()
})
