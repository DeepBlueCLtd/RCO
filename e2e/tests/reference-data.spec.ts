import { test, expect } from '../fixtures'
import { USERS, login, expectWelcome, querySql, userId } from '../helpers'

const markingByName = (name: string): { id: number } | undefined =>
  querySql<{ id: number }>(
    'SELECT id FROM protectiveMarking WHERE name = ?',
    name
  )[0]

const auditFor = (
  resource: string,
  dataId: number
): Array<{ activityType: string; user: number }> =>
  querySql(
    'SELECT activityType, user FROM audit WHERE resource = ? AND dataId = ? ORDER BY id',
    resource,
    dataId
  )

test('a power user adds and renames a protective marking, and both are audited', async ({
  page
}) => {
  const name = `E2E Mark ${Date.now()}`
  const renamed = `${name} (renamed)`
  await login(page, USERS.power.username)
  await expectWelcome(page)

  await page.goto('/#/protectiveMarking')
  await page.getByRole('link', { name: 'Create' }).click()
  await page.getByLabel('Name', { exact: true }).fill(name)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect.poll(() => markingByName(name)).toBeDefined()
  const { id } = markingByName(name) as { id: number }

  await page.goto(`/#/protectiveMarking/${id}/show`)
  await page.getByRole('link', { name: 'Edit' }).click()
  await page.getByLabel('Name', { exact: true }).fill(renamed)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect.poll(() => markingByName(renamed)?.id).toBe(id)

  await expect
    .poll(() => auditFor('protectiveMarking', id))
    .toEqual([
      { activityType: 'CREATE', user: userId('power') },
      { activityType: 'EDIT', user: userId('power') }
    ])

  // the new marking is offered when adding an item
  await page.goto('/#/richItem/create?batch=1')
  await page.getByRole('combobox', { name: 'Protective marking' }).click()
  await expect(page.getByRole('option', { name: renamed })).toBeVisible()
})

test('an rco-user can view reference data but not add to it', async ({
  page
}) => {
  await login(page, USERS.user.username)
  await expectWelcome(page)
  await page.goto('/#/protectiveMarking')
  await expect(page.getByText('Prot Mark-1', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Create' })).toHaveCount(0)
})

test('the audit log lists a user’s login', async ({ page }) => {
  // a user no other e2e test logs in as, so its rows are this test's
  await login(page, USERS.resetAdmin.username)
  await expectWelcome(page)
  await page.goto('/#/audit')
  const row = page
    .getByRole('row')
    .filter({ hasText: USERS.resetAdmin.username })
    .filter({ hasText: 'LOGIN' })
  await expect(row.first()).toBeVisible()
})
