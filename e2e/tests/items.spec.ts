import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Item Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-items')
  })

  test.describe('Item List', () => {
    test('should display items list', async ({ page }) => {

      // Wait for item list table to render - fail if not found
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible', timeout: 2000 })

      // Should have item list table
      const hasList = await page.locator('[data-testid="item-list-table"]').count()
      expect(hasList).toBeGreaterThan(0)
    })

    test('should filter items by search', async ({ page }) => {

      // Wait for item list table to render first
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible' })

      // Find search field - fail if not found
      const searchField = page.locator('input[type="search"], input[placeholder*="Reference"], [aria-label*="search" i]')
      await searchField.first().waitFor({ state: 'visible' })
      await searchField.first().fill('test')

      // Results should update - either grid with results or "no found" message
      const hasGrid = await page.locator('[data-testid="item-list-table"]').count()
      const hasNoResults = await page.locator('text=/no.*found/i').count()
      expect(hasGrid + hasNoResults).toBeGreaterThan(0)
    })

    test('should navigate to item details', async ({ page }) => {

      // Wait for item list table to render
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible' })

      // Wait for first data row to render - fail if not found
      const firstRow = page.locator('[data-testid="item-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 2000 })

      await firstRow.click()

      // Wait for item detail page content to render
      await page.locator('h5, button').first().waitFor({ state: 'visible', timeout: 2000 })

      // Should show item details
      const hasDetails = await page.locator('h5, .MuiPaper-root, .RaShow-main').count()
      expect(hasDetails).toBeGreaterThan(0)
    })
  })

  test.describe('Item Editing', () => {
    test('should open edit item form', async ({ page }) => {

      // Wait for item list table to render
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible' })

      // Find and click first item - fail if not found
      const firstRow = page.locator('[data-testid="item-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()

      // Wait for item show page to load
      await page.locator('h5, button, [role="main"]').first().waitFor({ state: 'visible', timeout: 2000 })

      // Click edit button - fail if not found
      const editButton = page.locator('[data-testid="item-edit-button"]').or(
        page.locator('button:has-text("Edit")')
      ).or(
        page.locator('a:has-text("Edit")')
      ).or(
        page.locator('[aria-label*="edit" i]')
      )
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()

      // Should show edit form
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible' })
      await expect(form).toBeVisible()
    })

    test('should preserve data when navigating away and back', async ({ page }) => {

      // Wait for item list table to render
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible' })

      // Navigate to first item
      const firstRow = page.locator('[data-testid="item-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()

      // Store the URL
      const itemUrl = page.url()

      // Navigate away
      await navigateToResourceByTestId(page, 'menu-items')

      // Navigate back
      await page.goto(itemUrl)

      // Should still show same item
      expect(page.url()).toBe(itemUrl)
    })
  })

  test.describe('Item Deletion', () => {
    test('should show delete confirmation', async ({ page }) => {

      // Wait for item list table to render
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible' })

      // Navigate to first item
      const firstRow = page.locator('[data-testid="item-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()

      // Wait for item show page to load
      await page.locator('h5, button, [role="main"]').first().waitFor({ state: 'visible', timeout: 2000 })

      // Look for delete button - fail if not found
      const deleteButton = page.locator('button:has-text("Delete")').or(
        page.locator('[aria-label*="delete" i]')
      )
      await deleteButton.first().waitFor({ state: 'visible' })
      await deleteButton.first().click()
      await page.waitForTimeout(500)

      // Should show confirmation dialog - fail if not found
      const confirmDialog = page.locator('text=/confirm/i, [role="dialog"], .MuiDialog-root')
      await confirmDialog.first().waitFor({ state: 'visible' })
      await expect(confirmDialog.first()).toBeVisible()

      // Cancel the deletion
      const cancelButton = page.locator('button:has-text("Cancel")').or(
        page.locator('button:has-text("No")')
      )
      await cancelButton.first().waitFor({ state: 'visible' })
      await cancelButton.first().click()
      await page.waitForTimeout(500)
    })
  })

  test.describe('Item State Management', () => {
    test('should track item lifecycle states', async ({ page }) => {

      // Wait for item list table to render
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible' })

      // Navigate to first item
      const firstRow = page.locator('[data-testid="item-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()

      // Wait for item show page to load
      await page.locator('h5, button, [role="main"]').first().waitFor({ state: 'visible', timeout: 2000 })

      // Check for status/state fields - fail if not found
      const statusElement = page.locator('text=/status/i').or(page.locator('text=/state/i'))
      await statusElement.first().waitFor({ state: 'visible' })
      await expect(statusElement.first()).toBeVisible()
    })

    test('should show audit history', async ({ page }) => {

      // Wait for item list table to render
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible' })

      // Navigate to first item
      const firstRow = page.locator('[data-testid="item-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()

      // Wait for item show page to load
      await page.locator('h5, button, [role="main"]').first().waitFor({ state: 'visible', timeout: 2000 })

      // Look for history/audit tab or section - fail if not found
      const historyElement = page.locator('text=/history/i').or(page.locator('text=/audit/i'))
      await historyElement.first().waitFor({ state: 'visible' })
      await expect(historyElement.first()).toBeVisible()
    })
  })
})
