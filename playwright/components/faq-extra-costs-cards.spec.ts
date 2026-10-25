import { expect, test } from './fixtures'

const story = 'components/faq/faq-extra-costs-cards/ThreeHouses'

test('navigates the real carousel with house dots', async ({ mount }) => {
  const component = await mount(story)
  const orangeHeading = component.getByRole('heading', { name: 'Orange House' })
  const appleHeading = component.getByRole('heading', { name: 'Apple House' })
  const orangeDot = component.getByRole('button', {
    name: /\bOrange House\b/
  })
  const appleDot = component.getByRole('button', {
    name: /\bApple House\b/
  })

  await expect(orangeHeading).toBeInViewport()
  await expect(orangeDot).toHaveCSS('width', '24px')
  // A cost the editor wrote as a list stays one.
  await expect(component.getByRole('listitem')).toHaveText([
    'Wi-Fi included',
    'Wired in every room'
  ])

  await appleDot.click()

  await expect(appleHeading).toBeInViewport()
  await expect(appleDot).toHaveCSS('width', '24px')
  await expect(orangeDot).toHaveCSS('width', '8px')
})
