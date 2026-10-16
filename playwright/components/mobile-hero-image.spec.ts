import { expect, test } from './fixtures'

test.use({ viewport: { width: 390, height: 844 } })

test('counts the photos as the visitor swipes, and opens the gallery', async ({ mount, page }) => {
  const component = await mount('components/house/mobile-hero-image/Photos')
  const hero = component.getByRole('link', { name: /\bshow all photos\b/i })

  await expect(hero).toHaveAttribute('href', '/en/orange/gallery')
  await expect(hero.getByText('1 / 3', { exact: true })).toBeVisible()

  const box = (await hero.boundingBox())!
  const y = box.y + box.height / 2
  await page.mouse.move(box.x + box.width * 0.8, y)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.2, y, { steps: 8 })
  await page.mouse.up()

  await expect(hero.getByText('2 / 3', { exact: true })).toBeVisible()
  await expect(hero.getByRole('img', { name: 'Kitchen' })).toBeInViewport()
})

test('is replaced by the desktop photo grid on wider screens', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount('components/house/mobile-hero-image/Photos')

  await expect(component.getByRole('link', { name: /\bshow all photos\b/i })).toBeHidden()
})

test('tells editors when the house has no photos', async ({ mount }) => {
  const component = await mount('components/house/mobile-hero-image/NoPhotos')

  await expect(component.getByText('No gallery images')).toBeVisible()
  await expect(component.getByRole('link')).toHaveCount(0)
})
