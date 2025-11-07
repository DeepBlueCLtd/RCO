import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Destruction CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-destruction')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Destruction Creation', () => {
    test('should open create destruction form', async ({ page }) => {
      // Find and click create button - fail if not found
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create")')
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

    test('should validate required fields on destruction creation', async ({ page }) => {
      // Open create form
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create")')
      await createButton.first().waitFor({ state: 'visible' })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Try to submit without filling required fields
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForTimeout(1000)

      // Should show validation errors
      const errors = page.locator('[class*="error" i], [class*="invalid" i], .Mui-error')
      await errors.first().waitFor({ state: 'visible', timeout: 5000 })
      await expect(errors.first()).toBeVisible()
    })
  })

  test.describe('Destruction Editing', () => {
    test('should open edit form for existing destruction', async ({ page }) => {
      // Navigate to first destruction row
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Look for edit button
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit" i]')
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Should show edit form
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible' })
      await expect(form).toBeVisible()

      // URL should indicate edit page
      expect(page.url()).toMatch(/\/destruction\/\d+/)
    })

    test('should save edits to destruction', async ({ page }) => {
      // Navigate to first destruction
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click edit button
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit" i]')
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Edit the remarks field
      const remarksField = page.locator('input[name="remarks"], textarea[name="remarks"], [id*="remarks"]')
      await remarksField.first().waitFor({ state: 'visible' })
      const testValue = `Test edit ${Date.now()}`
      await remarksField.first().fill(testValue)

      // Save the form
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Should redirect to show page
      expect(page.url()).toContain('/destruction')
      expect(page.url()).not.toContain('/create')
    })
  })

  test.describe('Destruction Details View', () => {
    test('should display destruction details', async ({ page }) => {
      // Navigate to first destruction
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Should show destruction details
      const details = page.locator('[role="main"], .MuiPaper-root, [class*="show" i]')
      await details.first().waitFor({ state: 'visible' })
      await expect(details.first()).toBeVisible()

      // URL should indicate show page
      expect(page.url()).toContain('/destruction')
    })
  })

  test.describe('Destruction List', () => {
    test('should display destructions list', async ({ page }) => {
      // Should have list table
      const table = page.locator('table')
      await table.waitFor({ state: 'visible' })
      await expect(table).toBeVisible()
    })

    test('should allow filtering destructions', async ({ page }) => {
      // Look for filter controls
      const filterButton = page.locator(
        'button:has-text("Filter"), [aria-label*="filter" i], input[type="search"]'
      )
      await filterButton.first().waitFor({ state: 'visible' })
      await expect(filterButton.first()).toBeVisible()
    })
  })
})
