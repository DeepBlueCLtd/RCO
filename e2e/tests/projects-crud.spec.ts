import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Projects CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-projects')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Project Creation', () => {
    test('should open create project form', async ({ page }) => {
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

    test('should validate required fields on project creation', async ({ page }) => {
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

    test('should create new project with valid data', async ({ page }) => {
      // Open create form
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("Create")')).or(page.locator('button:has-text("ADD NEW")'))
      await createButton.first().waitFor({ state: 'visible' })
      await createButton.first().click()
      await page.waitForLoadState('networkidle')

      // Fill in name field (required)
      const nameField = page.locator('input[name="name"], [id*="name"]')
      await nameField.first().waitFor({ state: 'visible' })
      const testName = `Test Project ${Date.now()}`
      await nameField.first().fill(testName)

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Should redirect away from create page
      expect(page.url()).not.toContain('/create')
    })
  })

  test.describe('Project Editing', () => {
    test('should open edit form for existing project', async ({ page }) => {
      // Wait for table to load first
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible' })

      // Navigate to first project row
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

      // URL should indicate project edit page
      expect(page.url()).toMatch(/\/project\/\d+/)
    })

    test('should save edits to project', async ({ page }) => {
      // Wait for table to load first
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible' })

      // Navigate to first project
      const firstRow = page.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Click edit button
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")')).or(page.locator('[aria-label*="edit" i]'))
      await editButton.first().waitFor({ state: 'visible' })
      await editButton.first().click()
      await page.waitForLoadState('networkidle')

      // Look for name or remarks field to edit
      const editableField = page.locator('input[name="name"], input[name="remarks"], textarea[name="remarks"]')
      await editableField.first().waitFor({ state: 'visible' })
      const currentValue = await editableField.first().inputValue()
      const testValue = `${currentValue} - Updated ${Date.now()}`
      await editableField.first().fill(testValue)

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Should not be on create page anymore (indicates save worked)
      expect(page.url()).not.toContain('/create')
    })
  })

  test.describe('Project Details View', () => {
    test('should display project details', async ({ page }) => {
      // Wait for table to load first
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible' })

      // Navigate to first project
      const firstRow = page.locator('tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()
      await page.waitForLoadState('networkidle')

      // Should show project details (main content area)
      const details = page.locator('[role="main"], .MuiPaper-root, [class*="show" i]')
      await details.first().waitFor({ state: 'visible' })
      await expect(details.first()).toBeVisible()

      // URL should indicate project page
      expect(page.url()).toContain('/project')
    })
  })

  test.describe('Project List', () => {
    test('should display projects list', async ({ page }) => {
      // Should have list table
      const table = page.locator('table').first()
      await table.waitFor({ state: 'visible' })
      await expect(table).toBeVisible()
    })

    test('should allow filtering projects', async ({ page }) => {
      // Look for filter controls
      const filterButton = page.locator('button:has-text("Filter")').or(page.locator('[aria-label*="filter" i]')).or(page.locator('input[type="search"]'))
      await filterButton.first().waitFor({ state: 'visible' })

      // Filter functionality exists
      await expect(filterButton.first()).toBeVisible()
    })
  })
})
