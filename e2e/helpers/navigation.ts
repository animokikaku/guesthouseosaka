import { expect, type Page } from '@playwright/test'

/**
 * Whether the app has hydrated `element`: redact, which stands in for React,
 * stores the event handlers it attaches on their DOM node as `__h`.
 */
export function isHydrated(element: Element) {
  return [element, ...element.querySelectorAll('*')].some((node) => '__h' in node)
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
