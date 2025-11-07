import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Dispatch CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-dispatch')
  })

  test.describe('Dispatch List', () => {
    test('should display dispatches list', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for dispatch list table to render
      const table = page.locator('table')
      await table.waitFor({ state: 'visible', timeout: 10000 })

      // Should have list table
      const hasTable = await table.count()
      expect(hasTable).toBeGreaterThan(0)
    })

    test('should allow filtering dispatches', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for table to render first
      await page.locator('table').waitFor({ state: 'visible', timeout: 10000 })

      // Look for filter controls
      const filterButton = page.locator('button:has-text("Filter")').or(page.locator('[aria-label*="filter" i]')).or(page.locator('input[type="search"]'))
      await filterButton.first().waitFor({ state: 'visible', timeout: 10000 })

      const filterExists = await filterButton.count()
      expect(filterExists).toBeGreaterThan(0)
    })
  })

  test.describe('Dispatch Details View', () => {
    test('should display dispatch details', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for table to render
      await page.locator('table').waitFor({ state: 'visible', timeout: 10000 })

      // Navigate to first dispatch row
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible', timeout: 10000 })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Wait for details page content to render
      await page.locator('h5, button, .MuiPaper-root').first().waitFor({ state: 'visible', timeout: 10000 })

      // Should show dispatch details
      const hasDetails = await page.locator('.MuiPaper-root, [class*="show" i], [role="main"]').count()
      expect(hasDetails).toBeGreaterThan(0)

      // URL should indicate show page
      const url = page.url()
      expect(url).toContain('/dispatch')
    })
  })

  test.describe('Dispatch Creation', () => {
    test('should open create dispatch form', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for table to render first
      await page.locator('table').waitFor({ state: 'visible', timeout: 10000 })

      // Find and click create button
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")'))
      await createButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to properly load
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible', timeout: 10000 })
      await expect(form).toBeVisible()

      // URL should indicate create page
      const url = page.url()
      expect(url).toContain('/create')
    })

    test('should validate required fields on dispatch creation', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for table to render first
      await page.locator('table').waitFor({ state: 'visible', timeout: 10000 })

      // Open create form
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")'))
      await createButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible', timeout: 10000 })

      // Try to submit without filling required fields
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await saveButton.first().click()

      // Wait for validation errors to appear
      const errors = page.locator('[class*="error" i], [class*="invalid" i], .Mui-error')
      await errors.first().waitFor({ state: 'visible', timeout: 10000 })

      const hasErrors = await errors.count()
      expect(hasErrors).toBeGreaterThan(0)
    })
  })

  test.describe('Dispatch Editing', () => {
    test('should open edit form for existing dispatch', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for table to render
      await page.locator('table').waitFor({ state: 'visible', timeout: 10000 })

      // Navigate to first dispatch row
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible', timeout: 10000 })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Wait for page content to load
      await page.locator('h5, button').first().waitFor({ state: 'visible', timeout: 10000 })

      // Look for edit button
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await editButton.first().scrollIntoViewIfNeeded()
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to load
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible', timeout: 10000 })
      await expect(form).toBeVisible()

      // URL should indicate edit page
      const url = page.url()
      expect(url).toMatch(/\/dispatch\/\d+/)
    })

    test('should save edits to dispatch', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for table to render
      await page.locator('table').waitFor({ state: 'visible', timeout: 10000 })

      // Navigate to first dispatch
      const firstRow = page.locator('[role="row"]').nth(1)
      await firstRow.waitFor({ state: 'visible', timeout: 10000 })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Wait for page content to load
      await page.locator('h5, button').first().waitFor({ state: 'visible', timeout: 10000 })

      // Click edit button
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await editButton.first().scrollIntoViewIfNeeded()
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible', timeout: 10000 })

      // Edit the remarks field
      const remarksField = page.locator('input[name="remarks"], textarea[name="remarks"], [id*="remarks"]')
      await remarksField.first().waitFor({ state: 'visible', timeout: 10000 })
      const testValue = `Test edit ${Date.now()}`
      await remarksField.first().fill(testValue)

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await saveButton.first().click()

      // Wait for navigation after save
      await page.waitForURL('**/dispatch/**', { timeout: 10000 })
      await page.waitForLoadState('networkidle')

      // Should be on dispatch show/list page
      const url = page.url()
      expect(url).toContain('/dispatch')
    })
  })
})
