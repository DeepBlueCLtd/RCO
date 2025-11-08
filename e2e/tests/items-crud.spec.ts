import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Items CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-items')
  })

  // NOTE: Items are created through Batch workflow, not directly via Create button
  // NOTE: Item editing is permission and state-dependent (dispatched/destroyed items cannot be edited)

  test.describe('Item Details View', () => {
    test('should display item details', async ({ page }) => {
      // Wait for table to load first
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible' })

      // Navigate to first item (tbody tr to skip header)
      const firstRow = table.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()

      // Should show item details - wait for content to render
      const details = page.locator('[role="main"], .MuiPaper-root, [class*="show" i]')
      await details.first().waitFor({ state: 'visible' })
      await expect(details.first()).toBeVisible()

      // URL should indicate show page (richItem resource)
      expect(page.url()).toContain('/richItem')
    })
  })
})
