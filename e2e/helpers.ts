import { type Page, expect } from '@playwright/test'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const harness = require('../integration/helpers/soul-server')

export const USERS: Record<string, { username: string }> = harness.USERS
export const PASSWORD: string = harness.PASSWORD

/** Database ids of the seeded users, from global-setup. */
export const userId = (key: string): number =>
  JSON.parse(process.env.E2E_USER_IDS ?? '{}')[key]

/** Run SQL against the e2e server's database copy (to arrange data). */
export const runSql = (query: string, ...args: unknown[]): void => {
  harness.withDb(process.env.E2E_DB_PATH, (db: any) =>
    db.prepare(query).run(...args)
  )
}

export const login = async (
  page: Page,
  username: string,
  password: string = PASSWORD
): Promise<void> => {
  await page.goto('/')
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('button[type="submit"]').click()
}

export const errorMessage = (page: Page): ReturnType<Page['locator']> =>
  page.locator('.MuiSnackbarContent-message')

/** The welcome page is showing, i.e. the login worked. */
export const expectWelcome = async (page: Page): Promise<void> => {
  await expect(page.getByRole('link', { name: 'New Batch' })).toBeVisible()
  await expect(page.locator('#username')).toHaveCount(0)
}
