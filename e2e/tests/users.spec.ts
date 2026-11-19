import { test, expect } from '../fixtures'
import {
  USERS,
  login,
  expectWelcome,
  errorMessage,
  querySql,
  runSql,
  userId
} from '../helpers'

interface UserRow {
  id: number
  departedDate: string | null
  updateBefore: string | null
}

const userRow = (username: string): UserRow | undefined =>
  querySql<UserRow>(
    'SELECT id, departedDate, updateBefore FROM _users WHERE username = ?',
    username
  )[0]

const roleOf = (id: number): number | undefined =>
  querySql<{ role_id: number }>(
    'SELECT role_id FROM _users_roles WHERE user_id = ?',
    id
  )[0]?.role_id

test('a power user creates a user, who can then log in', async ({
  page,
  browser
}) => {
  const username = `e2e-new-${Date.now()}`
  const password = 'Nw7#pLq2Xv9!'
  await login(page, USERS.power.username)
  await expectWelcome(page)

  await page.goto('/#/_users/create')
  await page.getByLabel('Name', { exact: true }).fill('E2E New User')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.locator('#demo-simple-select-filled').click()
  await page.getByRole('option', { name: 'RCO User' }).click()
  await page.getByRole('button', { name: 'Save' }).click()

  await expect.poll(() => userRow(username)).toBeDefined()
  const created = userRow(username) as UserRow
  await expect.poll(() => roleOf(created.id)).toBe(2)
  // the temporary password must be changed within the hour
  expect(created.updateBefore).not.toBeNull()

  // the new user logs in with the temporary password
  const other = await browser.newPage()
  await login(other, username, password)
  await expectWelcome(other)
  await expect(
    other.getByText('Please update your password before it expires.')
  ).toBeVisible()
  await other.close()
})

test('a departed user can no longer log in', async ({ page, browser }) => {
  // not departed yet (also when the test is repeated)
  runSql(
    'UPDATE _users SET departedDate = ? WHERE id = ?',
    new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    userId('leaver')
  )
  await login(page, USERS.power.username)
  await expectWelcome(page)

  await page.goto(`/#/_users/${userId('leaver')}/show`)
  await page.getByRole('button', { name: 'Depart organisation' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect
    .poll(() => userRow(USERS.leaver.username)?.departedDate ?? null)
    .not.toBeNull()

  const other = await browser.newPage()
  await login(other, USERS.leaver.username)
  await expect(errorMessage(other)).toHaveText(/User has departed organisation/)
  await other.close()
})
