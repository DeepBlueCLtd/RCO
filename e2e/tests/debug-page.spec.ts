import { test, expect } from '@playwright/test'

/**
 * Debug test to check page loading
 */
test('debug: check page loads correctly', async ({ page }) => {
  // Listen to console messages
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()))

  // Listen to page errors
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message))

  // Listen to network requests
  page.on('response', response => {
    console.log(`RESPONSE: ${response.status()} ${response.url()}`)
  })

  console.log('Navigating to /')
  await page.goto('/', { waitUntil: 'networkidle' })

  console.log('Current URL:', page.url())
  console.log('Page title:', await page.title())

  // Take a screenshot
  await page.screenshot({ path: 'e2e/test-results/debug-screenshot.png', fullPage: true })
  console.log('Screenshot saved to e2e/test-results/debug-screenshot.png')

  // Get page HTML
  const html = await page.content()
  console.log('Page HTML length:', html.length)
  console.log('Page HTML preview:', html.substring(0, 500))

  // Check if username field exists
  const usernameField = page.locator('#username')
  const isUsernameVisible = await usernameField.isVisible().catch(() => false)
  console.log('Is username field visible?', isUsernameVisible)

  // Wait a bit to let any async rendering happen
  await page.waitForTimeout(3000)

  // Check again
  const isUsernameVisibleAfterWait = await usernameField.isVisible().catch(() => false)
  console.log('Is username field visible after 3s wait?', isUsernameVisibleAfterWait)

  // Check for any React error boundaries
  const errorText = await page.textContent('body').catch(() => 'Could not get body text')
  console.log('Body text content:', errorText)
})
