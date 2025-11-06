import { test } from '@playwright/test'
import { login, TEST_USERS } from '../helpers/auth-helpers'

test('debug: inspect user menu after login', async ({ page }) => {
  console.log('=== User Menu Debug Test ===')

  // Login first
  await login(page, TEST_USERS.admin)
  console.log('Logged in successfully')

  // Wait a bit for UI to settle
  await page.waitForTimeout(2000)

  console.log('Current URL:', page.url())

  // Take screenshot
  await page.screenshot({ path: 'e2e/test-results/usermenu-debug.png', fullPage: true })
  console.log('Screenshot saved')

  // Search for potential user menu elements
  console.log('\n--- Searching for user menu elements ---')

  // Try various selectors
  const selectors = [
    '[aria-label="User menu"]',
    '[aria-label*="user" i]',
    '[data-testid="user-menu"]',
    'button[aria-label*="User" i]',
    '.RaUserMenu-userButton',
    '[class*="UserMenu"]',
    'button[aria-haspopup="menu"]'
  ]

  for (const selector of selectors) {
    const elements = page.locator(selector)
    const count = await elements.count()
    if (count > 0) {
      console.log(`\n✓ Found ${count} element(s) with selector: ${selector}`)
      for (let i = 0; i < Math.min(count, 3); i++) {
        const element = elements.nth(i)
        const isVisible = await element.isVisible().catch(() => false)
        const text = await element.textContent().catch(() => '')
        const ariaLabel = await element.getAttribute('aria-label').catch(() => null)
        console.log(`  [${i}] visible=${isVisible}, text="${text}", aria-label="${ariaLabel}"`)
      }
    } else {
      console.log(`✗ No elements found for: ${selector}`)
    }
  }

  console.log('\n=== End User Menu Debug ===')
})
