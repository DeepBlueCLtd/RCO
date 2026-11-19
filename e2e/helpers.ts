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

/** Read rows from the e2e server's database copy. */
export const querySql = <T = Record<string, unknown>>(
  query: string,
  ...args: unknown[]
): T[] =>
  harness.withDb(process.env.E2E_DB_PATH, (db: any) =>
    db.prepare(query).all(...args)
  )

/**
 * Insert a batch with `count` plain items (not loaned, dispatched or
 * destroyed), copying reference values from an existing item.
 * Item numbers are unique per call, e.g. E2E-131/1.
 */
export const seedBatch = (
  count: number
): { batchId: number; itemIds: number[]; itemNumbers: string[] } =>
  harness.withDb(process.env.E2E_DB_PATH, (db: any) => {
    const ref = db
      .prepare(
        `SELECT mediaType, vaultLocation, protectiveMarking, protectionString
         FROM item WHERE vaultLocation IS NOT NULL LIMIT 1`
      )
      .get()
    const now = new Date().toISOString()
    const creator = userId('power')
    const batchId = Number(
      db
        .prepare(
          `INSERT INTO batch (vault, batchNumber, yearOfReceipt, createdAt, createdBy)
           VALUES ('VAULT', ?, 2026, ?, ?)`
        )
        .run(`E2E-${Date.now()}`, now, creator).lastInsertRowid
    )
    db.prepare('UPDATE batch SET batchNumber = ? WHERE id = ?').run(
      `E2E-${batchId}`,
      batchId
    )
    const insert = db.prepare(
      `INSERT INTO item (mediaType, batch, itemNumber, vaultLocation,
         protectiveMarking, protectionString, createdAt, createdBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    const itemIds: number[] = []
    const itemNumbers: string[] = []
    for (let i = 1; i <= count; i++) {
      const itemNumber = `E2E-${batchId}/${i}`
      const result = insert.run(
        ref.mediaType,
        batchId,
        itemNumber,
        ref.vaultLocation,
        ref.protectiveMarking,
        ref.protectionString,
        now,
        creator
      )
      itemIds.push(Number(result.lastInsertRowid))
      itemNumbers.push(itemNumber)
    }
    return { batchId, itemIds, itemNumbers }
  })

/** Tick the list rows for the given item numbers. */
export const selectItems = async (
  page: Page,
  itemNumbers: string[]
): Promise<void> => {
  for (const itemNumber of itemNumbers) {
    const row = page.getByRole('row').filter({ hasText: itemNumber })
    await row.getByRole('checkbox').check()
  }
}

/** Replace window.print, which would otherwise open the print dialog. */
export const stubPrint = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    window.print = () => undefined
  })
}
