import { test, expect } from '@playwright/test'
import { login, navigateToReferenceDataResource, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Platforms CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToReferenceDataResource(page, 'platforms')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Platform Creation', () => {
    test('should open create platform form', async ({ page }) => {
      // Find and click create button - fail if not found
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")')).or(page.locator('button:has-text("ADD NEW")'))
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

    test('should validate required fields on platform creation', async ({ page }) => {
      // Open create form
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")')).or(page.locator('button:has-text("ADD NEW")'))
      await createButton.first().waitFor({ state: 'visible' })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Try to submit without filling required fields
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForTimeout(1000)

      // Should show validation errors
      const errors = page.locator('[class*="error" i], [class*="invalid" i], .Mui-error')
      await errors.first().waitFor({ state: 'visible', timeout: 5000 })
      await expect(errors.first()).toBeVisible()
    })

    test('should create new platform with valid data', async ({ page }) => {
      // Open create form
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")')).or(page.locator('button:has-text("ADD NEW")'))
      await createButton.first().waitFor({ state: 'visible' })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Fill in name field (required per schema)
      const nameField = page.locator('input[name="name"]').or(page.locator('[id*="name"]'))
      await nameField.first().waitFor({ state: 'visible' })
      const testName = `Test Platform ${Date.now()}`
      await nameField.first().fill(testName)

      // Active checkbox should default to true
      const activeCheckbox = page.locator('input[name="active"]').or(page.locator('[type="checkbox"][name="active"]'))
      await activeCheckbox.first().waitFor({ state: 'visible' })
      const isChecked = await activeCheckbox.first().isChecked()
      if (!isChecked) {
        await activeCheckbox.first().check()
      }

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Should redirect to show page
      expect(page.url()).not.toContain('/create')
      expect(page.url()).toContain('/platform')
    })
  })

  test.describe('Platform Editing', () => {
    test('should open edit form for existing platform', async ({ page }) => {
      // Wait for table to load first
      const table = page.locator('table')
      await table.waitFor({ state: 'visible' })

      // Navigate to first platform row
      const firstRow = page.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Look for edit button
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Should show edit form
      const form = page.locator('form, [role="form"]')
      await form.waitFor({ state: 'visible' })
      await expect(form).toBeVisible()

      // URL should indicate edit page
      expect(page.url()).toMatch(/\/platform\/\d+/)
    })

    test('should save edits to platform', async ({ page }) => {
      // Wait for table to load first
      const table = page.locator('table')
      await table.waitFor({ state: 'visible' })

      // Navigate to first platform
      const firstRow = page.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click edit button
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Edit the name field
      const nameField = page.locator('input[name="name"]')
      await nameField.first().waitFor({ state: 'visible' })
      const currentValue = await nameField.first().inputValue()
      const testValue = `${currentValue} - Updated ${Date.now()}`
      await nameField.first().fill(testValue)

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Should redirect to show page
      expect(page.url()).toContain('/show')
    })

    test('should toggle platform active status', async ({ page }) => {
      // Wait for table to load first
      const table = page.locator('table')
      await table.waitFor({ state: 'visible' })

      // Navigate to first platform
      const firstRow = page.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click edit button
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Toggle the active checkbox
      const activeCheckbox = page.locator('input[name="active"]').or(page.locator('[type="checkbox"][name="active"]'))
      await activeCheckbox.first().waitFor({ state: 'visible' })
      const wasChecked = await activeCheckbox.first().isChecked()
      await activeCheckbox.first().click()
      await page.waitForTimeout(500)

      // Verify it toggled
      const isNowChecked = await activeCheckbox.first().isChecked()
      expect(isNowChecked).toBe(!wasChecked)

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Should redirect successfully
      expect(page.url()).toContain('/platform')
    })
  })

  test.describe('Platform List', () => {
    test('should display platforms list', async ({ page }) => {
      // Should have list table
      const table = page.locator('table')
      await table.waitFor({ state: 'visible' })
      await expect(table).toBeVisible()
    })

    test('should show platform name in list', async ({ page }) => {
      // Wait for table to load first
      const table = page.locator('table')
      await table.waitFor({ state: 'visible' })

      // Wait for data rows to load
      const firstRow = page.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })

      // Check if first row has content
      const hasText = await firstRow.textContent()
      expect(hasText).toBeTruthy()
    })
  })
})
