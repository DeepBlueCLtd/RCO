import { test, expect } from '../fixtures'
import { USERS, login, expectWelcome, querySql, userId } from '../helpers'

test.beforeEach(async ({ page }) => {
  await login(page, USERS.power.username)
  await expectWelcome(page)
})

test('a power user creates a project, which is offered for new batches', async ({
  page
}) => {
  const name = `E2E Project ${Date.now()}`
  await page.getByRole('link', { name: /^New Projekt$/ }).click()
  await page.getByLabel('Name', { exact: true }).fill(name)
  // DateInput is a native date field: fill takes yyyy-mm-dd
  await page.getByLabel('Start', { exact: true }).fill('2026-01-01')
  await page.getByLabel('End', { exact: true }).fill('2027-12-31')
  await page.getByLabel('Remarks').fill('created by e2e')
  await page.getByRole('button', { name: 'Save' }).click()

  await expect
    .poll(
      () =>
        querySql<{ active: number; createdBy: number }>(
          'SELECT active, createdBy FROM project WHERE name = ?',
          name
        )[0]
    )
    .toEqual({ active: 1, createdBy: userId('power') })

  // active and recent, so the batch form offers it
  await page.goto('/#/batch/create')
  await page.getByLabel('Projekt').click()
  await expect(page.getByRole('option', { name })).toBeVisible()
})

test('a power user adds an address, which is offered for dispatches', async ({
  page
}) => {
  const fullAddress = `1 E2E Street ${Date.now()}`
  await page.goto('/#/address/create')
  await page.getByLabel('Full address').fill(fullAddress)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page).toHaveURL(/#\/address\/\d+\/show/)
  await expect
    .poll(
      () =>
        querySql<{ active: number }>(
          'SELECT active FROM address WHERE fullAddress = ?',
          fullAddress
        )[0]?.active
    )
    .toBe(1)

  // through the UI: after a save, Playwright 1.33's page.goto to a hash URL
  // can hang (a Playwright quirk, not an app bug; see #1182)
  await page.getByRole('menuitem', { name: 'Welcome' }).click()
  await page.getByRole('link', { name: 'New Dispatch' }).click()
  await page.getByLabel('To address').fill(fullAddress)
  await expect(page.getByRole('option', { name: fullAddress })).toBeVisible()
})

test('a new address typed while the page is still loading is kept', async ({
  page
}) => {
  // a slow server: the form used to reset as its data arrived, wiping the
  // typed text and leaving Save disabled
  await page.route('**/api/tables/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await page.goto('/#/address/create')
  const field = page.getByLabel('Full address')
  await field.fill('1 Slow Street')
  await page.waitForTimeout(4000)
  await expect(field).toHaveValue('1 Slow Street')
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
})
