import { test } from '@playwright/test'
import { login, navigateToResource, TEST_USERS } from '../helpers/auth-helpers'

test('debug: inspect batches page', async ({ page }) => {
  console.log('=== Batches Page Debug ===')

  await login(page, TEST_USERS.admin)
  console.log('Logged in')

  // Navigate to Batches
  await navigateToResource(page, 'Batches')
  console.log('Navigated to Batches')

  await page.waitForLoadState('networkidle')
  console.log('Network idle')

  // Wait a bit more
  await page.waitForTimeout(3000)

  console.log('Current URL:', page.url())

  // Take screenshot
  await page.screenshot({ path: 'e2e/test-results/batches-page.png', fullPage: true })
  console.log('Screenshot saved')

  // Check for various grid/list selectors
  const selectors = [
    '[role="grid"]',
    '.MuiDataGrid-root',
    '[role="table"]',
    '[class*="RaDatagrid"]',
    '[class*="Datagrid"]',
    '.datagrid-body',
    'table'
  ]

  console.log('\n--- Checking selectors ---')
  for (const selector of selectors) {
    const count = await page.locator(selector).count()
    if (count > 0) {
      console.log(`✓ Found ${count} element(s) with: ${selector}`)
      const isVisible = await page.locator(selector).first().isVisible().catch(() => false)
      console.log(`  First element visible: ${isVisible}`)
    } else {
      console.log(`✗ No elements for: ${selector}`)
    }
  }

  // Check page text content
  const bodyText = await page.locator('body').textContent()
  console.log('\nPage contains "Batch"?', bodyText?.includes('Batch') || bodyText?.includes('batch'))
  console.log('Page length:', bodyText?.length || 0)

  console.log('\n=== End Debug ===')
})
