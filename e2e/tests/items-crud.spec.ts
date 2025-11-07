import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Items CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-items')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Item Creation', () => {
    test('should open create item form', async ({ page }) => {
      // Find and click create button - wait for it to be visible
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")'))
      await createButton.first().waitFor({ state: 'visible' })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to properly load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible' })

      // Should show create form
      const form = page.locator('form, [role="form"]')
      await expect(form).toBeVisible()

      // URL should indicate create page
      expect(page.url()).toContain('/create')
    })

    test('should validate required fields on item creation', async ({ page }) => {
      // Open create form
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")'))
      await createButton.first().waitFor({ state: 'visible' })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to properly load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible' })

      // Try to submit without filling required fields
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForTimeout(1000)

      // Should show validation errors - wait for them
      const errors = page.locator('[class*="error" i], [class*="invalid" i], .Mui-error')
      await errors.first().waitFor({ state: 'visible', timeout: 5000 })
      await expect(errors.first()).toBeVisible()
    })
  })

  test.describe('Item Editing', () => {
    test('should open edit form for existing item', async ({ page }) => {
      // Navigate to first item row - wait for it to be visible
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Look for edit button - wait for it to be visible
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to properly load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible' })

      // Should show edit form
      const form = page.locator('form, [role="form"]')
      await expect(form).toBeVisible()

      // URL should indicate edit page
      expect(page.url()).toMatch(/\/item\/\d+/)
    })

    test('should save edits to item', async ({ page }) => {
      // Navigate to first item - wait for it to be visible
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click edit button - wait for it to be visible
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to properly load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible' })

      // Edit the remarks field - wait for it to be visible
      const remarksField = page.locator('input[name="remarks"], textarea[name="remarks"], [id*="remarks"]')
      await remarksField.first().waitFor({ state: 'visible' })
      const testValue = `Test edit ${Date.now()}`
      await remarksField.first().fill(testValue)

      // Save the form - wait for button to be visible
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Should redirect or show success - verify page has updated
      const showPageContent = page.locator('[role="main"], .MuiPaper-root, [class*="show" i]')
      await showPageContent.first().waitFor({ state: 'visible', timeout: 5000 })
    })
  })

  test.describe('Item Details View', () => {
    test('should display item details', async ({ page }) => {
      // Navigate to first item - wait for it to be visible
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Should show item details - wait for content to render
      const details = page.locator('[role="main"], .MuiPaper-root, [class*="show" i]')
      await details.first().waitFor({ state: 'visible' })
      await expect(details.first()).toBeVisible()

      // URL should indicate show page
      expect(page.url()).toContain('/item')
    })
  })
})
