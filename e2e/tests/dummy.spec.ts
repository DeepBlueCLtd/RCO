import { test, expect } from '@playwright/test'

test('dummy test - console output verification', async ({ page }) => {
  console.log('=== DUMMY TEST START ===')
  console.log('Node version:', process.version)
  console.log('Platform:', process.platform)
  console.log('Current working directory:', process.cwd())

  // Simple assertion
  expect(1 + 1).toBe(2)
  console.log('✓ Math works: 1 + 1 = 2')

  // Test that doesn't need servers - use example.com
  console.log('Navigating to example.com...')
  await page.goto('https://example.com')

  console.log('Current URL:', page.url())
  console.log('Page title:', await page.title())

  // Check for h1
  const h1 = await page.locator('h1').textContent()
  console.log('H1 text:', h1)

  expect(h1).toContain('Example')
  console.log('✓ Found "Example" in H1')

  console.log('=== DUMMY TEST END ===')
})
