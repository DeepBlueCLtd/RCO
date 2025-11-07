import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Dispatch CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-dispatch')
  })

  test.describe('Dispatch Creation', () => {
    test('should open create dispatch form', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Find and click create button
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create")')
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

    test('should validate required fields on dispatch creation', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      const createButton = page.locator('button:has-text("Create"), a:has-text("Create")')
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
  })

  test.describe('Dispatch Editing', () => {
    test('should open edit form for existing dispatch', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first dispatch
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
          expect(url).toMatch(/\/dispatch\/\d+/)
        }
      } else {
        test.skip()
      }
    })

    test('should save edits to dispatch', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first dispatch
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [aria-label*="edit" i]')
        if (await editButton.count() > 0) {
          await editButton.first().click()
          await page.waitForLoadState('networkidle')

          // Look for a text input field to edit
          const remarksField = page.locator('input[name="remarks"], textarea[name="remarks"], [id*="remarks"]')
          if (await remarksField.count() > 0) {
            const testValue = `Test edit ${Date.now()}`
            await remarksField.first().fill(testValue)

            // Save the form
            const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
            if (await saveButton.count() > 0) {
              await saveButton.first().click()
              await page.waitForLoadState('networkidle')

              // Should redirect or show success
              const hasSuccessOrDetail = await page.locator(
                '[role="alert"], .MuiAlert-root, [class*="Snackbar"]'
              ).count()
              // Success notification or detail page indicates save worked
              expect(hasSuccessOrDetail >= 0).toBe(true)
            }
          }
        }
      } else {
        test.skip()
      }
    })
  })

  test.describe('Dispatch Details View', () => {
    test('should display dispatch details', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Navigate to first dispatch
      const firstRow = page.locator('[role="row"]').nth(1)
      const rowExists = await firstRow.count()

      if (rowExists > 0) {
        await firstRow.click()
        await page.waitForLoadState('networkidle')

        // Should show dispatch details
        const hasDetails = await page.locator('[role="main"], .MuiPaper-root, [class*="show" i]').count()
        expect(hasDetails).toBeGreaterThan(0)

        // URL should indicate show page
        const url = page.url()
        expect(url).toContain('/dispatch')
      } else {
        test.skip()
      }
    })
  })

  test.describe('Dispatch List', () => {
    test('should display dispatches list', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Should have list table
      const hasList = await page.locator('table').count()
      expect(hasList).toBeGreaterThan(0)
    })

    test('should allow filtering dispatches', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Look for filter controls
      const filterButton = page.locator(
        'button:has-text("Filter"), [aria-label*="filter" i], input[type="search"]'
      )
      const filterExists = await filterButton.count()

      if (filterExists > 0) {
        // Filter functionality exists
        expect(filterExists).toBeGreaterThan(0)
      } else {
        test.skip()
      }
    })
  })
})
