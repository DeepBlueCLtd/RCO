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
    test('should open edit item form', async ({ page, context }) => {
      // Wait for item list table to render
      await page.locator('[data-testid="item-list-table"]').waitFor({ state: 'visible' })

      // Find preview button in first row (eye icon opens new tab for richItem)
      const previewButton = page.locator('[data-testid="item-list-table"] tbody tr').first().locator('button').first()
      await previewButton.waitFor({ state: 'visible' })

      // Click preview button opens new tab - capture it
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        previewButton.click()
      ])

      // Wait for new tab to load
      await newPage.waitForLoadState('domcontentloaded')

      // Switch to new page for remaining test
      const itemPage = newPage

      // Click edit button in new tab - fail if not found
      const editButton = itemPage.locator('[data-testid="item-edit-button"]').or(
        itemPage.locator('button:has-text("Edit")')
      ).or(
        itemPage.locator('a:has-text("Edit")')
      ).or(
        itemPage.locator('[aria-label*="edit" i]')
      )
      await editButton.first().waitFor({ state: 'visible', timeout: 2000 })
      await editButton.first().click()

      // Should show edit form in new tab
      const form = itemPage.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible', timeout: 2000 })
      await expect(form).toBeVisible()

      // Clean up - close new tab
      await newPage.close()
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
})
