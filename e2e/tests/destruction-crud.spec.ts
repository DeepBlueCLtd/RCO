import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Destruction CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-destruction')
  })

  test.describe('Destruction List', () => {
    test('should display destructions list', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for destruction list table to render
      await page.locator('table').first().waitFor({ state: 'visible', timeout: 10000 })

      // Should have destruction list table
      const hasTable = await page.locator('table').count()
      expect(hasTable).toBeGreaterThan(0)
    })

    test('should allow filtering destructions', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for destruction list table to render
      await page.locator('table').first().waitFor({ state: 'visible', timeout: 10000 })

      // Look for filter controls - wait for them to be visible
      const filterButton = page.locator('button:has-text("Filter")').or(page.locator('[aria-label*="filter" i]')).or(page.locator('input[type="search"]'))
      await filterButton.first().waitFor({ state: 'visible', timeout: 10000 })

      // Filter functionality should exist
      const filterExists = await filterButton.count()
      expect(filterExists).toBeGreaterThan(0)
    })
  })

  test.describe('Destruction Creation', () => {
    test('should open create destruction form', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for destruction list table to render first
      await page.locator('table').first().waitFor({ state: 'visible', timeout: 10000 })

      // Find and click create button - wait for it to be visible
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")'))
      await createButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to properly load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible', timeout: 10000 })

      // Should show create form
      const form = page.locator('form, [role="form"]')
      await expect(form).toBeVisible()

      // URL should indicate create page
      const url = page.url()
      expect(url).toContain('/create')
    })
  })

  test.describe('Destruction Details View', () => {
    test('should display destruction details', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for destruction list table to render
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible', timeout: 10000 })

      // Wait for first data row to render (tbody tr to skip header)
      const firstRow = table.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 10000 })

      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Wait for destruction detail page content to render
      await page.locator('[role="main"], .MuiPaper-root, [class*="show" i]').first().waitFor({ state: 'visible', timeout: 10000 })

      // Should show destruction details
      const details = page.locator('[role="main"], .MuiPaper-root, [class*="show" i]')
      const hasDetails = await details.count()
      expect(hasDetails).toBeGreaterThan(0)

      // URL should indicate show page
      const url = page.url()
      expect(url).toContain('/destruction')
    })
  })

  test.describe('Destruction Editing', () => {
    test('should open edit form for existing destruction', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for destruction list table to render
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible', timeout: 10000 })

      // Wait for first data row to render (tbody tr to skip header)
      const firstRow = table.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 10000 })

      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Look for edit button - wait for it to be visible
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to properly load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible', timeout: 10000 })

      // Should show edit form
      const form = page.locator('form, [role="form"]')
      await expect(form).toBeVisible()

      // URL should indicate edit page
      const url = page.url()
      expect(url).toMatch(/\/destruction\/\d+/)
    })

    test('should save edits to destruction', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for destruction list table to render
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible', timeout: 10000 })

      // Wait for first data row to render (tbody tr to skip header)
      const firstRow = table.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 10000 })

      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Look for edit button - wait for it to be visible
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Wait for form to properly load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible', timeout: 10000 })

      // Edit the remarks field - wait for it to be visible
      const remarksField = page.locator('input[name="remarks"], textarea[name="remarks"], [id*="remarks"]')
      await remarksField.first().waitFor({ state: 'visible', timeout: 10000 })

      // Generate unique test value
      const testValue = `Test edit ${Date.now()}`
      await remarksField.first().fill(testValue)

      // Save the form - wait for save button to be visible
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible', timeout: 10000 })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Verify save success: URL doesn't contain /edit (returned to show page)
      expect(page.url()).not.toContain('/edit')

      // Verify EDIT button is visible on show page
      const editButtonOnShow = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")'))
      await expect(editButtonOnShow.first()).toBeVisible()
    })
  })
})
