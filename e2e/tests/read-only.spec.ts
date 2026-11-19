import { test, expect } from '@playwright/test'
import { USERS, login, seedBatch } from '../helpers'

// Users with only the default role can look but not change anything.
test.describe('default role is read-only', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.default.username)
    await expect(page.getByText('Recent Batches')).toBeVisible()
  })

  test('the welcome page offers no create actions', async ({ page }) => {
    for (const name of ['New Batch', 'New Dispatch']) {
      await expect(page.getByText(name, { exact: true })).toBeVisible()
      await expect(
        page.getByRole('link', { name, exact: true })
      ).toHaveAttribute('aria-disabled', 'true')
    }
  })

  test('a batch can be viewed but not edited', async ({ page }) => {
    const { batchId, itemNumbers } = seedBatch(1)
    await page.goto(`/#/batch/${batchId}/show`)
    const row = page.getByRole('row').filter({ hasText: itemNumbers[0] })
    await expect(row).toBeVisible()
    await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Add item' })).toHaveCount(0)

    await row.getByRole('checkbox').check()
    const toolbar = page.locator('[data-test="bulk-actions-toolbar"]')
    await expect(toolbar).toContainText('1 item selected')
    for (const name of [
      'Dispatch',
      'Destroy',
      'Change Location',
      'Loan',
      'Loan return',
      'Return'
    ]) {
      await expect(
        toolbar.getByRole('button', { name, exact: true })
      ).toBeDisabled()
    }
  })
})
