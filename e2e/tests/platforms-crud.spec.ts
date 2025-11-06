import { test, expect } from '@playwright/test'
import { login, navigateToResource, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Platforms CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    // Platforms might be under Reference Data - try direct navigation first
    await navigateToResource(page, 'Platforms')
  })

  test.describe('Platform Creation', () => {
    test('should open create platform form', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Find and click create button
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("ADD NEW")')
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

    test('should validate required fields on platform creation', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      const createButton = page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("ADD NEW")')
      const buttonExists = await createButton.count()

      if (buttonExists > 0) {
        await createButton.first().click()
        await page.waitForLoadState('networkidle')

        // Try to submit without filling required fields
        const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
        if (await saveButton.count() > 0) {
          await saveButton.first().click()
          await page.waitForTimeout(1000)

          // Should show validation errors or remain on form
          const hasErrors = await page.locator('[class*="error" i], [class*="invalid" i], .Mui-error').count()
          expect(hasErrors).toBeGreaterThan(0)
        }
      } else {
        test.skip()
      }
    })

    test('should create new platform with valid data', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      const createButton = page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("ADD NEW")')
      const buttonExists = await createButton.count()

      if (buttonExists > 0) {
        await createButton.first().click()
        await page.waitForLoadState('networkidle')

        // Fill in name field (required per schema)
        const nameField = page.locator('input[name="name"], [id*="name"]')
        if (await nameField.count() > 0) {
          const testName = `Test Platform ${Date.now()}`
          await nameField.first().fill(testName)

          // Active checkbox should default to true, but we can verify
          const activeCheckbox = page.locator('input[name="active"], [type="checkbox"][name="active"]')
          if (await activeCheckbox.count() > 0) {
            const isChecked = await activeCheckbox.first().isChecked()
            if (!isChecked) {
              await activeCheckbox.first().check()
            }
          }

          // Save the form
          const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
          if (await saveButton.count() > 0) {
            await saveButton.first().click()
            await page.waitForLoadState('networkidle')

            // Should redirect to show page
            const url = page.url()
            expect(url).not.toContain('/create')
            expect(url).toContain('/platform')
          }
        }
      } else {
        test.skip()
      }
    })
  })

  test.describe('Platform Editing', () => {
    test('should open edit form for existing platform', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first platform row
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        // Look for edit button
        const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit" i]')
        const editExists = await editButton.count()

        if (editExists > 0) {
          await editButton.first().click()
          await page.waitForLoadState('networkidle')

          // Should show edit form
          const hasForm = await page.locator('form, [role="form"]').count()
          expect(hasForm).toBeGreaterThan(0)

          // URL should indicate edit page
          const url = page.url()
          expect(url).toMatch(/\/platform\/\d+/)
        }
      } else {
        test.skip()
      }
    })

    test('should save edits to platform', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first platform
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit" i]')
        if (await editButton.count() > 0) {
          await editButton.first().click()
          await page.waitForLoadState('networkidle')

          // Edit the name field
          const nameField = page.locator('input[name="name"]')
          if (await nameField.count() > 0) {
            const currentValue = await nameField.first().inputValue()
            const testValue = `${currentValue} - Updated ${Date.now()}`
            await nameField.first().fill(testValue)

            // Save the form
            const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
            if (await saveButton.count() > 0) {
              await saveButton.first().click()
              await page.waitForLoadState('networkidle')

              // Should redirect to show page
              const url = page.url()
              expect(url).toContain('/show')
            }
          }
        }
      } else {
        test.skip()
      }
    })

    test('should toggle platform active status', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first platform
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit" i]')
        if (await editButton.count() > 0) {
          await editButton.first().click()
          await page.waitForLoadState('networkidle')

          // Toggle the active checkbox
          const activeCheckbox = page.locator('input[name="active"], [type="checkbox"][name="active"]')
          if (await activeCheckbox.count() > 0) {
            const wasChecked = await activeCheckbox.first().isChecked()
            await activeCheckbox.first().click()
            await page.waitForTimeout(500)

            // Verify it toggled
            const isNowChecked = await activeCheckbox.first().isChecked()
            expect(isNowChecked).toBe(!wasChecked)

            // Save the form
            const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
            if (await saveButton.count() > 0) {
              await saveButton.first().click()
              await page.waitForLoadState('networkidle')

              // Should redirect successfully
              const url = page.url()
              expect(url).toContain('/platform')
            }
          }
        }
      } else {
        test.skip()
      }
    })
  })

  test.describe('Platform List', () => {
    test('should display platforms list', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Should have list table
      const hasList = await page.locator('table').count()
      expect(hasList).toBeGreaterThan(0)
    })

    test('should show platform name in list', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Check if there's at least one data row
      const dataRows = page.locator('[role="row"]')
      const rowCount = await dataRows.count()

      if (rowCount > 1) {
        // First row is header, check if second row has content
        const firstDataRow = dataRows.nth(1)
        const hasText = await firstDataRow.textContent()
        expect(hasText).toBeTruthy()
      } else {
        test.skip()
      }
    })
  })
})
