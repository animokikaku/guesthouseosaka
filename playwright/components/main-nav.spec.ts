import { expect, test } from './fixtures'

test.use({ viewport: { width: 1280, height: 800 } })

// The menu renders in a portal, which the trigger owns only in the accessibility
// tree, so its contents are found from the page rather than the component.

test('opens the houses menu with a link to each house', async ({ mount, page }) => {
  const component = await mount('components/main-nav/Houses')

  await expect(component.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/en/faq')
  await component.getByRole('button', { name: /\bshare houses\b/i }).click()

  for (const [house, href] of [
    ['Orange', '/en/orange'],
    ['Apple', '/en/apple'],
    ['Lemon', '/en/lemon']
  ]) {
    await expect(
      page.getByRole('link', { name: new RegExp(`\\b${house} House\\b`) })
    ).toHaveAttribute('href', href)
  }
  await expect(page.getByText('Lively house near Tsuruhashi')).toBeVisible()
})

// The photo beside the list follows whichever house the visitor is about to pick.
test('previews the house under the pointer or keyboard focus', async ({ mount, page }) => {
  const component = await mount('components/main-nav/Houses')
  await component.getByRole('button', { name: /\bshare houses\b/i }).click()

  const preview = (alt: string) => page.getByRole('img', { name: alt })

  await expect(preview('Orange House living room')).toBeVisible()

  await page.getByRole('link', { name: /\bApple House\b/ }).hover()
  await expect(preview('Apple House garden')).toBeVisible()
  await expect(preview('Orange House living room')).toBeHidden()

  await page.getByRole('link', { name: /\bLemon House\b/ }).focus()
  await expect(preview('Lemon House kitchen')).toBeVisible()
  await expect(preview('Apple House garden')).toBeHidden()
})

test('tells editors when no house is published', async ({ mount, page }) => {
  const component = await mount('components/main-nav/NoHouses')
  await component.getByRole('button', { name: /\bshare houses\b/i }).click()

  await expect(page.getByText('Content not available')).toBeVisible()
})
