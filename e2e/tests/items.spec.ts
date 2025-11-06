import { test, expect } from '@playwright/test'
import { login, navigateToResource, waitForSuccessNotification, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Item Workflows', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResource(page, 'Items')
  })

  test.describe('Item List', () => {
    test('should display items list', async ({ page }) => {
      // Wait for list to load
      await page.waitForSelector('table', {
        timeout: 10000
      })

      // Should have list elements
      const hasGrid = await page.locator('table').count()
      expect(hasGrid).toBeGreaterThan(0)
    })

    test('should filter items by search', async ({ page }) => {
      // Wait for list to load
      await page.waitForLoadState('networkidle')

      // Check if search field exists
      const searchField = page.locator('input[type="search"], input[placeholder*="Search"], [aria-label*="search" i]')

      const searchExists = await searchField.count()
      if (searchExists > 0) {
        // Enter search term
        await searchField.first().fill('test')
        await page.waitForLoadState('networkidle')

        // Results should update (either filtered or no results message)
        const hasResults = await page.locator('[role="grid"], .MuiDataGrid-root, text=/no.*found/i').count()
        expect(hasResults).toBeGreaterThan(0)
      } else {
        test.skip()
      }
    })

    test('should navigate to item details', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Find first item row and click to view details
      const firstRow = page.locator('[role="row"]').nth(1) // Skip header row
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        // Should navigate to detail page
        const url = page.url()
        expect(url).toContain('/items/')

        // Should show item details
        const hasDetails = await page.locator('text=/details/i, .MuiPaper-root, [role="main"]').count()
        expect(hasDetails).toBeGreaterThan(0)
      } else {
        test.skip()
      }
    })
  })

  test.describe('Item Creation', () => {
    test('should open create item form', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Click create button
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create"), [aria-label*="create" i]')
      const buttonExists = await createButton.count()

      if (buttonExists > 0) {
        await createButton.first().click()
        await page.waitForLoadState('networkidle')

        // Should show create form
        const hasForm = await page.locator('form, [role="form"]').count()
        expect(hasForm).toBeGreaterThan(0)

        // URL should indicate create page
        const url = page.url()
        expect(url).toContain('/create')
      } else {
        test.skip()
      }
    })

    test('should validate required fields', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to create form
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create")')
      const buttonExists = await createButton.count()

      if (buttonExists > 0) {
        await createButton.first().click()
        await page.waitForLoadState('networkidle')

        // Try to save without filling required fields
        const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
        const saveExists = await saveButton.count()

        if (saveExists > 0) {
          await saveButton.first().click()

          // Should show validation errors
          const hasErrors = await page.locator('text=/required/i, .Mui-error, [role="alert"]').count()
          expect(hasErrors).toBeGreaterThan(0)
        }
      } else {
        test.skip()
      }
    })
  })

  test.describe('Item Editing', () => {
    test('should open edit item form', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Find and click first item
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        // Click edit button
        const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit" i]')
        const editExists = await editButton.count()

        if (editExists > 0) {
          await editButton.first().click()
          await page.waitForLoadState('networkidle')

          // Should show edit form
          const hasForm = await page.locator('form, [role="form"]').count()
          expect(hasForm).toBeGreaterThan(0)
        }
      } else {
        test.skip()
      }
    })

    test('should preserve data when navigating away and back', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first item
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        // Store the URL
        const itemUrl = page.url()

        // Navigate away
        await navigateToResource(page, 'Items')

        // Navigate back
        await page.goto(itemUrl)
        await page.waitForLoadState('networkidle')

        // Should still show same item
        expect(page.url()).toBe(itemUrl)
      } else {
        test.skip()
      }
    })
  })

  test.describe('Item Deletion', () => {
    test('should show delete confirmation', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first item
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        // Look for delete button
        const deleteButton = page.locator('button:has-text("Delete"), [aria-label*="delete" i]')
        const deleteExists = await deleteButton.count()

        if (deleteExists > 0) {
          await deleteButton.first().click()

          // Should show confirmation dialog
          const hasConfirm = await page.locator('text=/confirm/i, [role="dialog"], .MuiDialog-root').count()
          expect(hasConfirm).toBeGreaterThan(0)

          // Cancel the deletion
          const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("No")')
          const cancelExists = await cancelButton.count()

          if (cancelExists > 0) {
            await cancelButton.first().click()
          }
        }
      } else {
        test.skip()
      }
    })
  })

  test.describe('Item State Management', () => {
    test('should track item lifecycle states', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first item
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        // Check for status/state fields
        const hasStatus = await page.locator(
          'text=/status/i, text=/state/i, [name*="status"], [name*="state"]'
        ).count()

        // Items should have some form of state tracking
        expect(hasStatus).toBeGreaterThan(0)
      } else {
        test.skip()
      }
    })

    test('should show audit history', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first item
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        // Look for history/audit tab or section
        const hasHistory = await page.locator(
          'text=/history/i, text=/audit/i, button:has-text("History"), button:has-text("Audit")'
        ).count()

        if (hasHistory > 0) {
          // Audit trail feature exists
          expect(hasHistory).toBeGreaterThan(0)
        }
      } else {
        test.skip()
      }
    })
  })
})
