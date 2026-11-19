import { test, expect, type Page } from '@playwright/test'
import {
  USERS,
  login,
  expectWelcome,
  querySql,
  seedBatch,
  userId,
  selectItems
} from '../helpers'

const loanedTo = (itemIds: number[]): Array<number | null> =>
  querySql<{ loanedTo: number | null }>(
    `SELECT loanedTo FROM item WHERE id IN (${itemIds.join(',')}) ORDER BY id`
  ).map((r) => r.loanedTo)

const openBatch = async (page: Page, batchId: number): Promise<void> => {
  await page.goto(`/#/batch/${batchId}/show`)
}

test('a power user loans items to a user, then returns them', async ({
  page
}) => {
  const { batchId, itemIds, itemNumbers } = seedBatch(2)
  await login(page, USERS.power.username)
  await expectWelcome(page)
  await openBatch(page, batchId)

  await selectItems(page, itemNumbers)
  await page.getByRole('button', { name: 'Loan', exact: true }).click()
  const dialog = page.locator('.MuiModal-root')
  await expect(dialog).toContainText('Loan 2 items to')
  await dialog.getByLabel('Holder').fill(USERS.other.username)
  await page.getByRole('option', { name: USERS.other.username }).click()
  await dialog.getByRole('button', { name: 'Loan' }).click()

  await expect
    .poll(() => loanedTo(itemIds))
    .toEqual([userId('other'), userId('other')])

  await selectItems(page, itemNumbers)
  await page.getByRole('button', { name: 'Loan return' }).click()
  await expect(dialog).toContainText(
    `Return 2 items from: ${USERS.other.username}`
  )
  await dialog.getByRole('button', { name: 'Return' }).click()

  await expect.poll(() => loanedTo(itemIds)).toEqual([null, null])
})
