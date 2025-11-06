import { test, expect } from '@playwright/test'

test('debug: inspect error notification', async ({ page }) => {
  console.log('=== Notification Debug Test ===')

  await page.goto('/')

  // Wait for login form
  await page.waitForSelector('#username', { state: 'visible' })
  console.log('Login form loaded')

  // Fill invalid credentials to trigger error notification
  await page.locator('#username').fill('invaliduser')
  await page.locator('#password').fill('wrongpassword')
  await page.locator('button[type="submit"]').click()

  console.log('Submitted invalid credentials, waiting for notification...')

  // Wait a bit for notification to appear
  await page.waitForTimeout(2000)

  // Try to find any notification-like elements
  console.log('\n--- Searching for notification elements ---')

  // Try role="alert"
  const alertElements = page.locator('[role="alert"]')
  const alertCount = await alertElements.count()
  console.log(`Found ${alertCount} elements with role="alert"`)

  if (alertCount > 0) {
    for (let i = 0; i < alertCount; i++) {
      const element = alertElements.nth(i)
      const classes = await element.getAttribute('class')
      const text = await element.textContent()
      const isVisible = await element.isVisible()
      console.log(`  [${i}] visible=${isVisible}, classes="${classes}", text="${text}"`)
    }
  }

  // Try MuiSnackbarContent
  const snackbarElements = page.locator('[class*="MuiSnackbar"]')
  const snackbarCount = await snackbarElements.count()
  console.log(`\nFound ${snackbarCount} elements with "MuiSnackbar" in class`)

  if (snackbarCount > 0) {
    for (let i = 0; i < snackbarCount; i++) {
      const element = snackbarElements.nth(i)
      const classes = await element.getAttribute('class')
      const text = await element.textContent()
      const isVisible = await element.isVisible()
      console.log(`  [${i}] visible=${isVisible}, classes="${classes}", text="${text}"`)
    }
  }

  // Take screenshot
  await page.screenshot({ path: 'e2e/test-results/notification-debug.png', fullPage: true })
  console.log('\nScreenshot saved to e2e/test-results/notification-debug.png')

  console.log('=== End Notification Debug ===')
})
