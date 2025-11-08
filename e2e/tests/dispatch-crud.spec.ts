import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Dispatch CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-dispatch')
  })

  test.describe('Dispatch List', () => {
    test('should display dispatches list', async ({ page }) => {

      // Wait for dispatch list table to render (use first table due to multiple tables on page)
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible', timeout: 2000 })

      // Should have list table
      const hasTable = await page.locator('table').count()
      expect(hasTable).toBeGreaterThan(0)
    })

    test('should allow filtering dispatches', async ({ page }) => {

      // Wait for table to render first (use first table due to multiple tables on page)
      await page.locator('table').first().waitFor({ state: 'visible', timeout: 2000 })

      // Look for filter controls
      const filterButton = page.locator('button:has-text("Filter")').or(page.locator('[aria-label*="filter" i]')).or(page.locator('input[type="search"]'))
      await filterButton.first().waitFor({ state: 'visible', timeout: 2000 })

      const filterExists = await filterButton.count()
      expect(filterExists).toBeGreaterThan(0)
    })
  })

  test.describe('Dispatch Details View', () => {
    test('should display dispatch details', async ({ page }) => {

      // Wait for table to render (use first table due to multiple tables on page)
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible', timeout: 2000 })

      // Navigate to first dispatch row (tbody tr to skip header)
      const firstRow = table.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 2000 })
      await firstRow.click()

      // Wait for details page content to render
      await page.locator('h5, button, .MuiPaper-root').first().waitFor({ state: 'visible', timeout: 2000 })

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

      // Wait for table to render first (use first table due to multiple tables on page)
      await page.locator('table').first().waitFor({ state: 'visible', timeout: 2000 })

      // Find and click create button
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")'))
      await createButton.first().waitFor({ state: 'visible', timeout: 2000 })
      await createButton.first().click()

      // Wait for create form to properly load - look for form fields specific to create page
      await page.waitForTimeout(500)
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible', timeout: 2000 })
      await expect(form).toBeVisible()

      // Verify we're on create page by checking for Save button (not present on list page)
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await expect(saveButton.first()).toBeVisible()
    })

    test('should validate required fields on dispatch creation', async ({ page }) => {

      // Wait for table to render first (use first table due to multiple tables on page)
      await page.locator('table').first().waitFor({ state: 'visible', timeout: 2000 })

      // Open create form
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")'))
      await createButton.first().waitFor({ state: 'visible', timeout: 2000 })
      await createButton.first().click()

      // Wait for form to load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible', timeout: 2000 })
      await page.waitForTimeout(500)

      // Save button should be disabled when required fields are empty
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible', timeout: 2000 })

      // React-Admin disables save button when form validation fails
      await expect(saveButton.first()).toBeDisabled()
    })
  })

  test.describe('Dispatch Editing', () => {
    test('should open edit form for existing dispatch', async ({ page }) => {

      // Wait for table to render (use first table due to multiple tables on page)
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible', timeout: 2000 })

      // Navigate to first dispatch row (tbody tr to skip header)
      const firstRow = table.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 2000 })
      await firstRow.click()

      // Wait for page content to load
      await page.locator('h5, button').first().waitFor({ state: 'visible', timeout: 2000 })

      // Look for edit button
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible', timeout: 2000 })
      await editButton.first().scrollIntoViewIfNeeded()
      await editButton.first().click()

      // Wait for form to load
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible', timeout: 2000 })
      await expect(form).toBeVisible()

      // URL should indicate edit page
      const url = page.url()
      expect(url).toMatch(/\/dispatch\/\d+/)
    })

    test('should save edits to dispatch', async ({ page }) => {

      // Wait for table to render (use first table due to multiple tables on page)
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible', timeout: 2000 })

      // Navigate to first dispatch (tbody tr to skip header)
      const firstRow = table.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 2000 })
      await firstRow.click()

      // Wait for page content to load
      await page.locator('h5, button').first().waitFor({ state: 'visible', timeout: 2000 })

      // Click edit button
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible', timeout: 2000 })
      await editButton.first().scrollIntoViewIfNeeded()
      await editButton.first().click()

      // Wait for form to load
      await page.locator('form, [role="form"]').waitFor({ state: 'visible', timeout: 2000 })

      // Edit the remarks field
      const remarksField = page.locator('input[name="remarks"], textarea[name="remarks"], [id*="remarks"]')
      await remarksField.first().waitFor({ state: 'visible', timeout: 2000 })
      const testValue = `Test edit ${Date.now()}`
      await remarksField.first().fill(testValue)

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible', timeout: 2000 })
      await saveButton.first().click()

      // Wait for page load to complete
      await page.waitForTimeout(1000)

      // Verify save success: URL doesn't contain /edit (returned to show page)
      expect(page.url()).not.toContain('/edit')

      // Verify EDIT button is visible on show page
      const editButtonOnShow = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")'))
      await expect(editButtonOnShow.first()).toBeVisible()
    })
  })
})
