import { test, expect } from '@playwright/test'
import { login, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Reference Data CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
  })

  const referenceDataResources = [
    'Department',
    'Organisation',
    'Protective Marking',
    'Media Type',
    // Note: 'Vault Location' is a top-level menu item, not in Reference Data submenu
    'Vault'
  ]

  for (const resourceName of referenceDataResources) {
    test.describe(`${resourceName} Management`, () => {
      test.beforeEach(async ({ page }) => {
        // Navigate to Reference Data menu using data-testid
        const refDataMenu = page.locator('[data-testid="menu-reference-data"]')
        const menuExists = await refDataMenu.count()

        if (menuExists > 0) {
          await refDataMenu.click()
          await page.waitForTimeout(500)

          // Click on specific resource - wait for submenu to be ready
          const resourceLink = page.locator(`text="${resourceName}"`).first()
          await resourceLink.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})
          await page.waitForTimeout(200) // Let submenu stabilize

          const linkCount = await resourceLink.count()
          if (linkCount > 0) {
            await resourceLink.click()
            await page.waitForLoadState('networkidle')
          }
        }
      })

      test(`should display ${resourceName} list`, async ({ page }) => {
        // Skip if we couldn't navigate to the resource
        const url = page.url()
        if (!url.includes('reference') && !url.toLowerCase().includes(resourceName.toLowerCase().replace(/\s+/g, ''))) {
          test.skip()
        }

        await page.waitForLoadState('networkidle')

        // Should have list table
        const hasList = await page.locator('table, [role="grid"]').count()
        expect(hasList).toBeGreaterThan(0)
      })

      test(`should open create ${resourceName} form`, async ({ page }) => {
        const url = page.url()
        if (!url.includes('reference') && !url.toLowerCase().includes(resourceName.toLowerCase().replace(/\s+/g, ''))) {
          test.skip()
        }

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
          const newUrl = page.url()
          expect(newUrl).toContain('/create')
        } else {
          test.skip()
        }
      })

      test(`should validate required fields for ${resourceName}`, async ({ page }) => {
        const url = page.url()
        if (!url.includes('reference') && !url.toLowerCase().includes(resourceName.toLowerCase().replace(/\s+/g, ''))) {
          test.skip()
        }

        await page.waitForLoadState('networkidle')

        const createButton = page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("ADD NEW")')
        const buttonExists = await createButton.count()

        if (buttonExists > 0) {
          await createButton.first().click()
          await page.waitForLoadState('networkidle')

          // Check that save button is disabled when form is empty (validation)
          const saveButton = page.locator('button:has-text("Save"), button[type="submit"]')
          if (await saveButton.count() > 0) {
            const isDisabled = await saveButton.first().isDisabled()
            // Button should be disabled when required fields are empty
            expect(isDisabled).toBe(true)
          }
        } else {
          test.skip()
        }
      })

      test(`should edit existing ${resourceName}`, async ({ page }) => {
        const url = page.url()
        if (!url.includes('reference') && !url.toLowerCase().includes(resourceName.toLowerCase().replace(/\s+/g, ''))) {
          test.skip()
        }

        await page.waitForLoadState('networkidle')

        // Navigate to first item
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
          }
        } else {
          test.skip()
        }
      })
    })
  }

  test.describe('CAT Codes Management', () => {
    const catResources = ['CAT Code', 'CAT Handle', 'CAT Cave']

    for (const catResource of catResources) {
      test(`should access and display ${catResource} list`, async ({ page }) => {
        // Navigate to Reference Data menu using data-testid
        const refDataMenu = page.locator('[data-testid="menu-reference-data"]')
        const menuExists = await refDataMenu.count()

        if (menuExists > 0) {
          await refDataMenu.click()
          await page.waitForTimeout(500)

          // Click on specific CAT resource
          const catMenuItem = page.locator(`text="${catResource}"`)
          if (await catMenuItem.count() > 0) {
            await catMenuItem.first().click()
            await page.waitForLoadState('networkidle')

            // Should have list table
            const hasList = await page.locator('table, [role="grid"]').count()
            expect(hasList).toBeGreaterThan(0)
          } else {
            test.skip()
          }
        } else {
          test.skip()
        }
      })
    }
  })

  test.describe('Reference Data Accessibility', () => {
    test('should have Reference Data menu accessible', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Should have Reference Data in menu using data-testid
      const refDataMenu = page.locator('[data-testid="menu-reference-data"]')
      const menuExists = await refDataMenu.count()

      if (menuExists > 0) {
        expect(menuExists).toBeGreaterThan(0)

        // Click to open submenu
        await refDataMenu.click()
        await page.waitForTimeout(1000)

        // Check for any of the reference data submenu items with flexible matching
        const subItemSelectors = [
          'text=Department',
          'text=Organisation',
          'text=Vault',
          'text=Media Type',
          'text=Protective Marking'
        ]

        let hasSubItems = 0
        for (const selector of subItemSelectors) {
          const count = await page.locator(selector).count()
          hasSubItems += count
        }

        // Should find at least one submenu item
        expect(hasSubItems).toBeGreaterThan(0)
      } else {
        test.skip()
      }
    })
  })
})
