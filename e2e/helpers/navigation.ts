import { expect, type Page } from '@playwright/test'

/** Whether React has hydrated `element`: it attaches its fiber to the DOM node. */
export function isHydrated(element: Element) {
  return Object.keys(element).some((key) => key.startsWith('__reactFiber$'))
}

/**
 * Open a page and wait until it responds to input. The server-rendered page is
 * visible before React hydrates it, and a click in that window is lost, which
 * a busy machine (or one Worker serving every test) makes long enough to hit.
 * The page hydrates as one tree, so the header stands for all of it.
 */
export async function gotoHydrated(page: Page, path: string) {
  await page.goto(path)
  await expect.poll(() => page.locator('header').evaluate(isHydrated)).toBe(true)
}
