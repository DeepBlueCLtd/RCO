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

      // Wait for navigation to create page
      await page.waitForURL(/.*\/create/, { timeout: 3000 })
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

      // Wait for form to load
      await page.waitForTimeout(500)

      // Save button should be disabled when required fields are empty
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })

      // React-Admin disables save button when form validation fails
      await expect(saveButton.first()).toBeDisabled()
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

      // Fill in start date (required)
      const startDateField = page.locator('input[name="startDate"]').or(page.locator('[id*="startDate"]'))
      await startDateField.first().waitFor({ state: 'visible' })
      const today = new Date()
      const startDate = today.toISOString().split('T')[0]
      await startDateField.first().fill(startDate)

      // Fill in end date (required)
      const endDateField = page.locator('input[name="endDate"]').or(page.locator('[id*="endDate"]'))
      await endDateField.first().waitFor({ state: 'visible' })
      const oneYearLater = new Date(today)
      oneYearLater.setFullYear(today.getFullYear() + 1)
      const endDate = oneYearLater.toISOString().split('T')[0]
      await endDateField.first().fill(endDate)

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Verify creation success: page title includes "Projekt Show"
      const pageTitle = page.locator('h5, h1, h2, h3')
      await expect(pageTitle.filter({ hasText: /Projekt Show/i })).toBeVisible()

      // Verify EDIT button is visible on show page
      const editButton = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")'))
      await expect(editButton.first()).toBeVisible()
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

      // Update project name with timestamp
      const nameField = page.locator('input[name="name"], [id*="name"]')
      await nameField.first().waitFor({ state: 'visible' })
      const currentName = await nameField.first().inputValue()
      const updatedName = `${currentName} - Edited ${Date.now()}`
      await nameField.first().fill(updatedName)

      // Update End date to 3 days in future (ensures actual value change)
      const endDateField = page.locator('input[name="endDate"]')
      await endDateField.waitFor({ state: 'visible' })
      const today = new Date()
      const threeDaysLater = new Date(today)
      threeDaysLater.setDate(today.getDate() + 3)
      const threeDaysLaterISO = threeDaysLater.toISOString().split('T')[0]
      await endDateField.fill(threeDaysLaterISO)

      // Wait for form validation to complete
      await page.waitForTimeout(500)

      // Save the form
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible' })
      await saveButton.first().click()
      await page.waitForLoadState('networkidle')

      // Give time for save to complete
      await page.waitForTimeout(1000)

      // Verify save success: page title includes "Projekt Show"
      const pageTitle = page.locator('h5, h1, h2, h3')
      await expect(pageTitle.filter({ hasText: /Projekt Show/i })).toBeVisible()

      // Verify EDIT button is visible on show page
      const editButtonOnShow = page.locator('button:has-text("Edit")').or(page.locator('a:has-text("Edit")'))
      await expect(editButtonOnShow.first()).toBeVisible()

      // Verify the updated name is displayed
      await expect(page.locator('text=' + updatedName).first()).toBeVisible()
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
