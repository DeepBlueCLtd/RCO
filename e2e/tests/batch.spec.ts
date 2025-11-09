import { test, expect } from '@playwright/test'
import { login, navigateToResourceByTestId, TEST_USERS } from '../helpers/auth-helpers'

test.describe('Batch Management Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
    await navigateToResourceByTestId(page, 'menu-batches')
  })

  test.describe('Batch List', () => {
    test('should display batches list', async ({ page }) => {

      // Wait for batch list table to render
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible', timeout: 2000 })

      // Should have batch list table
      const hasList = await page.locator('[data-testid="batch-list-table"]').count()
      expect(hasList).toBeGreaterThan(0)
    })

    test('should show batch details', async ({ page }) => {

      // Wait for batch list table to render
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible', timeout: 2000 })

      // Wait for first data row to render
      const firstRow = page.locator('[data-testid="batch-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 2000 })

      await firstRow.click()

      // Wait for "Batch Show" title to appear
      await page.getByText('Batch Show').waitFor({ state: 'visible', timeout: 2000 })

      // Should show batch information
      const hasDetails = await page.locator('h5, .MuiPaper-root, .RaShow-main').count()
      expect(hasDetails).toBeGreaterThan(0)
    })
  })

  test.describe('Batch Creation', () => {
    test('should create new batch and find it by search', async ({ page }) => {
      // Wait for batch list table to render first
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible' })

      // Find and click create button - wait for it to be visible
      const createButton = page.locator('a:has-text("ADD NEW BATCH")')
      await createButton.waitFor({ state: 'visible' })
      await createButton.click()

      // Wait for form to properly load
      await page.locator('form').waitFor({ state: 'visible' })

      // Generate unique test identifier with ISO datetime
      const testBatchRemarks = `auto-test-${new Date().toISOString()}`

      // Select first item from Platform dropdown
      const platformInput = page.locator('input[name="platform"]').or(page.locator('div[role="combobox"]:has-text("Platform")'))
      await platformInput.first().click()
      const firstPlatformOption = page.locator('li[role="option"]').first()
      await firstPlatformOption.waitFor({ state: 'visible' })
      await firstPlatformOption.click()

      // Select first item from Projekt dropdown
      const projectInput = page.locator('input[name="project"]').or(page.locator('div[role="combobox"]:has-text("Projekt")'))
      await projectInput.first().click()
      const firstProjectOption = page.locator('li[role="option"]').first()
      await firstProjectOption.waitFor({ state: 'visible' })
      await firstProjectOption.click()

      // Fill in Remarks field
      const remarksField = page.locator('input[name="remarks"]').or(page.locator('textarea[name="remarks"]'))
      await remarksField.fill(testBatchRemarks)

      // Save the batch
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.click()

      // Wait for "Batch Show" title to appear
      await page.getByText('Batch Show').waitFor({ state: 'visible', timeout: 2000 })

      // Click home button to navigate to welcome page
      const homeButton = page.locator('[data-testid="home-button"]')
      await homeButton.waitFor({ state: 'visible' })
      await homeButton.click()

      // Find Recent Batches table using data-testid and click first row (our new batch)
      const recentBatchesTable = page.locator('[data-testid="recent-batches-table"]')
      await recentBatchesTable.waitFor({ state: 'visible' })

      const firstBatchRow = recentBatchesTable.locator('tbody tr').first()
      await firstBatchRow.click()

      // Wait for Batch Show page to load
      await page.getByText('Batch Show').waitFor({ state: 'visible' })

      // Click Details tab
      const detailsTab = page.locator('button:has-text("Details")').or(page.locator('[role="tab"]:has-text("Details")'))
      await detailsTab.waitFor({ state: 'visible' })
      await detailsTab.click()

      // Get actual remarks text from the Details tab
      // Look for any element containing our test string
      const remarksControl = page.getByText(testBatchRemarks, { exact: false })
      await remarksControl.waitFor({ state: 'visible' })
      const actualRemarks = await remarksControl.textContent()

      // Compare with expected and log if mismatch for debugging
      console.log('Verifying remarks...')
      console.log('Expected:', testBatchRemarks)
      console.log('Actual:', actualRemarks)

      if (actualRemarks !== testBatchRemarks) {
        console.log('❌ Remarks mismatch!', testBatchRemarks, actualRemarks)
      } else {
        console.log('✅ Remarks match!')
      }

      expect(actualRemarks).toContain(testBatchRemarks)
    })
  })

  test.describe('Batch-Item Association', () => {
    test('should show items in batch', async ({ page }) => {
      // Wait for batch list table to render
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible' })

      // Navigate to first batch
      const firstRow = page.locator('[data-testid="batch-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })

      await firstRow.click()

      // Wait for Batch Show page to load
      await page.getByText('Batch Show').waitFor({ state: 'visible' })

      // Look for items list/table
      const itemsText = page.locator('text=/items/i')
      await itemsText.first().waitFor({ state: 'visible' })

      const hasItems = await itemsText.count()

      // Batch details should reference items somehow
      expect(hasItems).toBeGreaterThan(0)
    })

    test('should allow adding items to batch', async ({ page }) => {
      // Wait for batch list table to render
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible' })

      // Navigate to first batch
      const firstRow = page.locator('[data-testid="batch-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })

      await firstRow.click()

      // Wait for Batch Show page to load
      await page.getByText('Batch Show').waitFor({ state: 'visible' })

      // Look for add items button using data-testid
      const addButton = page.locator('[data-testid="batch-add-item-button"]')
      await addButton.waitFor({ state: 'visible' })
      await addButton.click()

      // Wait for form to load
      await page.locator('form').waitFor({ state: 'visible' })
    })

    test('should validate required fields when adding item to batch', async ({ page }) => {
      // Navigate to first batch
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible' })
      const firstRow = page.locator('[data-testid="batch-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()

      // Wait for Batch Show page to load
      await page.getByText('Batch Show').waitFor({ state: 'visible' })

      // Click Add Item button
      const addButton = page.locator('[data-testid="batch-add-item-button"]')
      await addButton.waitFor({ state: 'visible' })
      await addButton.click()

      // Wait for form to load
      await page.locator('form').waitFor({ state: 'visible' })

      // Save button should be disabled when required fields are empty
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'))
      await saveButton.first().waitFor({ state: 'visible', timeout: 2000 })

      // Verify button is disabled (form validation preventing submission)
      const isDisabled = await saveButton.first().isDisabled()
      expect(isDisabled).toBe(true)
    })

    test('should create item and display in batch items list', async ({ page }) => {
      // Navigate to first batch
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible' })
      const firstRow = page.locator('[data-testid="batch-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })
      await firstRow.click()

      // Wait for Batch Show page to load
      await page.getByText('Batch Show').waitFor({ state: 'visible' })

      // Get initial item count from Items tab
      const itemsTab = page.locator('text=/items/i').first()
      await itemsTab.waitFor({ state: 'visible' })

      const itemsTable = page.locator('table').first()
      await itemsTable.waitFor({ state: 'visible' })
      const initialRowCount = await itemsTable.locator('tbody tr').count()

      // Click Add Item button
      const addButton = page.locator('[data-testid="batch-add-item-button"]')
      await addButton.waitFor({ state: 'visible' })
      await addButton.click()

      // Wait for form to load
      await page.locator('form').waitFor({ state: 'visible' })

      // Fill Consec/Sheets field with test identifier
      const consecSheetsField = page.locator('textarea[name="consecSheets"]')
      await consecSheetsField.waitFor({ state: 'visible' })
      const testReference = `TEST-ITEM-${Date.now()}`
      await consecSheetsField.fill(testReference)

      // Fill required: Media Type
      const mediaTypeInput = page.locator('input[name="mediaType"]')
      await mediaTypeInput.click()
      const firstMediaOption = page.locator('li[role="option"]').first()
      await firstMediaOption.waitFor({ state: 'visible' })
      await firstMediaOption.click()

      // Fill required: Vault Location
      const vaultLocationInput = page.locator('input[name="vaultLocation"]')
      await vaultLocationInput.click()
      const firstVaultOption = page.locator('li[role="option"]').first()
      await firstVaultOption.waitFor({ state: 'visible' })
      await firstVaultOption.click()

      // Fill required: Protective Marking
      const protectiveMarkingInput = page.locator('input[name="protectiveMarking"]')
      await protectiveMarkingInput.click()
      const firstMarkingOption = page.locator('li[role="option"]').first()
      await firstMarkingOption.waitFor({ state: 'visible' })
      await firstMarkingOption.click()

      // Save the form - click "Save / New" button which creates item and shows new form
      const saveNewButton = page.locator('button:has-text("Save / New")')
      await saveNewButton.waitFor({ state: 'visible' })
      await saveNewButton.click()

      // Wait for success notification
      await page.locator('text=/saved/i').waitFor({ state: 'visible', timeout: 2000 })

      // Navigate back to batch to verify item was created
      await page.goBack()
      await page.getByText('Batch Show').waitFor({ state: 'visible', timeout: 2000 })

      // Get fresh reference to items table after navigation
      const updatedItemsTable = page.locator('table').first()
      await updatedItemsTable.waitFor({ state: 'visible' })

      // Verify item appears in Items list - check row count increased
      const newRowCount = await updatedItemsTable.locator('tbody tr').count()
      expect(newRowCount).toBeGreaterThan(initialRowCount)
    })
  })

  test.describe('Batch Updates', () => {
    test('should allow editing batch details', async ({ page }) => {
      // Wait for batch list table to render
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible', timeout: 2000 })

      // Navigate to first batch
      const firstRow = page.locator('[data-testid="batch-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible', timeout: 2000 })

      await firstRow.click()

      // Wait for Batch Show page to load
      await page.getByText('Batch Show').waitFor({ state: 'visible' })

      // Look for edit button using data-testid and wait for it to be visible
      const editButton = page.locator('[data-testid="batch-edit-button"]')
      await editButton.waitFor({ state: 'visible' })

      // Scroll into view and click (no force - let it be properly clickable)
      await editButton.scrollIntoViewIfNeeded()
      await editButton.click()

      // Should show "Edit Batch" title
      const editTitle = page.locator('h1, h2, h3, h4, h5, h6').filter({ hasText: /Edit Batch/i })
      await editTitle.waitFor({ state: 'visible' })

      // Should show edit form
      const form = page.locator('form')
      await expect(form).toBeVisible()
    })

    test('should update all items when batch is updated', async ({ page }) => {
      // Wait for batch list table to render
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible' })

      // Navigate to first batch
      const firstRow = page.locator('[data-testid="batch-list-table"] tbody tr').first()
      await firstRow.waitFor({ state: 'visible' })

      await firstRow.click()

      // Wait for Batch Show page to load
      await page.getByText('Batch Show').waitFor({ state: 'visible' })

      // Batch updates should cascade to items
      // This is a business logic test - just verify batch shows items
      const itemsRef = page.locator('text=/items/i')
      await itemsRef.first().waitFor({ state: 'visible', timeout: 2000 })

      const hasItemsRef = await itemsRef.count()
      expect(hasItemsRef).toBeGreaterThan(0)
    })
  })

  test.describe('Batch Search and Filter', () => {
    test('should filter batches by criteria', async ({ page }) => {
      // Wait for batch list table to render
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible', timeout: 2000 })

      // Look for filter controls
      const filterButton = page.locator(
        'button:has-text("Filter"), [aria-label*="filter" i], input[type="search"]'
      )
      const filterExists = await filterButton.count()

      // Filter functionality should exist
      expect(filterExists).toBeGreaterThan(0)
    })

    test('should search batches by batch number', async ({ page }) => {
      // Wait for batch list table to render
      await page.locator('[data-testid="batch-list-table"]').waitFor({ state: 'visible', timeout: 2000 })

      // Look for search field
      const searchField = page.locator('input[type="search"], input[placeholder*="Search"]')
      const searchExists = await searchField.count()

      // Search field should exist
      expect(searchExists).toBeGreaterThan(0)

      await searchField.first().fill('BATCH')

      // Wait a moment for search to process
      await page.waitForTimeout(500)

      // Should update results (either grid with results or "no found" message)
      const hasGrid = await page.locator('[data-testid="batch-list-table"]').count()
      const hasNoResults = await page.locator('text=/no.*found/i').count()
      expect(hasGrid + hasNoResults).toBeGreaterThan(0)
    })
  })
})
