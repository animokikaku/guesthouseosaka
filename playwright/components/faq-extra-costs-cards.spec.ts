import { expect, test } from './fixtures'

const story = 'app/[locale]/faq/(components)/faq-extra-costs-cards/ThreeHouses'

test('navigates the real carousel with house dots', async ({ mount }) => {
  const component = await mount(story)
  const orangeHeading = component.getByRole('heading', { name: 'Orange House' })
  const appleHeading = component.getByRole('heading', { name: 'Apple House' })
  const orangeDot = component.getByRole('button', {
    name: /Orange House/
  })
  const appleDot = component.getByRole('button', {
    name: /Apple House/
  })

  await expect(orangeHeading).toBeInViewport()
  await expect(orangeDot).toHaveCSS('width', '24px')

  await appleDot.click()

  await expect(appleHeading).toBeInViewport()
  await expect(appleDot).toHaveCSS('width', '24px')
  await expect(orangeDot).toHaveCSS('width', '8px')
})
