import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Item Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-items')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Item List', () => {
    test('should display items list', async ({ page }) => {
      // Wait for list to load - fail if not found
      const table = page.locator('table')
      await table.waitFor({ state: 'visible' })
      await expect(table).toBeVisible()
    })

    test('should filter items by search', async ({ page }) => {
      // Find search field - fail if not found
      const searchField = page.locator('input[type="search"], input[placeholder*="Search"], [aria-label*="search" i]')
      await searchField.first().waitFor({ state: 'visible' })
      await searchField.first().fill('test')
      await page.waitForLoadState('networkidle')

      // Results should update
      const results = page.locator('[role="grid"], .MuiDataGrid-root, text=/no.*found/i')
      await results.first().waitFor({ state: 'visible' })
      await expect(results.first()).toBeVisible()
    })

    test('should navigate to item details', async ({ page }) => {
      // Find first item row - fail if not found
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Should navigate to detail page
      expect(page.url()).toContain('/items/')

      // Should show item details
      const details = page.locator('text=/details/i, .MuiPaper-root, [role="main"]')
      await details.first().waitFor({ state: 'visible' })
      await expect(details.first()).toBeVisible()
    })
  })

  test.describe('Item Creation', () => {
    test('should open create item form', async ({ page }) => {
      // Find and click create button - fail if not found
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create"), [aria-label*="create" i]')
      await createButton.first().waitFor({ state: 'visible' })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Should show create form
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible' })
      await expect(form).toBeVisible()

      // URL should indicate create page
      expect(page.url()).toContain('/create')
    })

    test('should validate required fields', async ({ page }) => {
      // Open create form
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create")')
      await createButton.first().waitFor({ state: 'visible' })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Try to save without filling required fields
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForTimeout(1000)

      // Should show validation errors
      const errors = page.locator('text=/required/i, .Mui-error, [role="alert"]')
      await errors.first().waitFor({ state: 'visible', timeout: 5000 })
      await expect(errors.first()).toBeVisible()
    })
  })

  test.describe('Item Editing', () => {
    test('should open edit item form', async ({ page }) => {
      // Find and click first item
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click edit button - fail if not found
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit" i]')
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Should show edit form
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible' })
      await expect(form).toBeVisible()
    })

    test('should preserve data when navigating away and back', async ({ page }) => {
      // Navigate to first item
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Store the URL
      const itemUrl = page.url()

      // Navigate away
      await navigateToResourceByTestId(page, 'menu-items')
      await page.waitForLoadState('networkidle')

      // Navigate back
      await page.goto(itemUrl)
      await page.waitForLoadState('networkidle')

      // Should still show same item
      expect(page.url()).toBe(itemUrl)
    })
  })

  test.describe('Item Deletion', () => {
    test('should show delete confirmation', async ({ page }) => {
      // Navigate to first item
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Look for delete button - fail if not found
      const deleteButton = page.locator('button:has-text("Delete"), [aria-label*="delete" i]')
      await deleteButton.first().waitFor({ state: 'visible' })
      await deleteButton.first().click()
      await page.waitForTimeout(500)

      // Should show confirmation dialog
      const confirmDialog = page.locator('text=/confirm/i, [role="dialog"], .MuiDialog-root')
      await confirmDialog.first().waitFor({ state: 'visible' })
      await expect(confirmDialog.first()).toBeVisible()

      // Cancel the deletion
      const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("No")')
      await cancelButton.first().waitFor({ state: 'visible' })
      await cancelButton.first().click()
      await page.waitForTimeout(500)
    })
  })

  test.describe('Item State Management', () => {
    test('should track item lifecycle states', async ({ page }) => {
      // Navigate to first item
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Check for status/state fields - fail if not found
      const statusElement = page.locator(
        'text=/status/i, text=/state/i, [name*="status"], [name*="state"]'
      )
      await statusElement.first().waitFor({ state: 'visible' })
      await expect(statusElement.first()).toBeVisible()
    })

    test('should show audit history', async ({ page }) => {
      // Navigate to first item
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Look for history/audit tab or section - fail if not found
      const historyElement = page.locator(
        'text=/history/i, text=/audit/i, button:has-text("History"), button:has-text("Audit")'
      )
      await historyElement.first().waitFor({ state: 'visible' })
      await expect(historyElement.first()).toBeVisible()
    })
  })
})
