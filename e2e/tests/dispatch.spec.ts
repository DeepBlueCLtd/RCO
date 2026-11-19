import { test, expect } from '@playwright/test'
import {
  USERS,
  login,
  expectWelcome,
  querySql,
  seedBatch,
  selectItems,
  stubPrint
} from '../helpers'

interface DispatchRow {
  id: number
  reportPrintedAt: string | null
  dispatchedAt: string | null
  receiptReceived: string | null
}

const dispatchRow = (id: number): DispatchRow =>
  querySql<DispatchRow>(
    'SELECT id, reportPrintedAt, dispatchedAt, receiptReceived FROM dispatch WHERE id = ?',
    id
  )[0]

const itemDispatch = (
  itemIds: number[]
): Array<{ dispatchJob: number | null; dispatchedDate: string | null }> =>
  querySql(
    `SELECT dispatchJob, dispatchedDate FROM item
     WHERE id IN (${itemIds.join(',')}) ORDER BY id`
  )

test('a power user creates a dispatch, adds items, prints, dispatches and records the receipt', async ({
  page
}) => {
  const recipient = `E2E Recipient ${Date.now()}`
  const { batchId, itemIds, itemNumbers } = seedBatch(2)
  await stubPrint(page)
  await login(page, USERS.power.username)
  await expectWelcome(page)

  // create the dispatch
  await page.getByRole('link', { name: 'New Dispatch' }).click()
  await page.getByLabel('To name').fill(recipient)
  await page.getByLabel('To address').click()
  await page.getByRole('option').first().click()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page).toHaveURL(/#\/dispatch\/\d+\/show/)
  const dispatchUrl = page.url()
  const dispatchId = Number(/dispatch\/(\d+)\/show/.exec(dispatchUrl)?.[1])

  // add the items to it from their batch
  await page.goto(`/#/batch/${batchId}/show`)
  await selectItems(page, itemNumbers)
  await page.getByRole('button', { name: 'Dispatch', exact: true }).click()
  const dialog = page.locator('.MuiModal-root')
  await dialog.locator('.MuiSelect-select').click()
  await page.getByRole('option', { name: new RegExp(recipient) }).click()
  await dialog.getByRole('button', { name: 'Dispatch' }).click()
  await expect
    .poll(() => itemDispatch(itemIds).map((i) => i.dispatchJob))
    .toEqual([dispatchId, dispatchId])

  // print the receipt note: it lists the items
  await page.goto(dispatchUrl)
  const dispatchButton = page
    .getByRole('group', { name: 'Dispatch', exact: true })
    .getByRole('button', { name: 'Dispatch', exact: true })
  await expect(dispatchButton).toBeDisabled()
  await page.getByRole('button', { name: 'Print Receipt' }).click()
  const receipt = page.locator('.printable')
  await expect(receipt).toContainText('RECEIPT NOTE')
  await expect(receipt).toContainText(itemNumbers[0])
  await expect(receipt).toContainText(itemNumbers[1])
  await receipt.getByRole('button', { name: 'Print' }).click()
  await expect
    .poll(() => dispatchRow(dispatchId).reportPrintedAt)
    .not.toBeNull()
  await receipt.getByRole('button', { name: 'Cancel' }).click()

  // dispatch
  await expect(dispatchButton).toBeEnabled()
  await dispatchButton.click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect.poll(() => dispatchRow(dispatchId).dispatchedAt).not.toBeNull()
  await expect
    .poll(() => itemDispatch(itemIds).every((i) => i.dispatchedDate !== null))
    .toBe(true)

  // the receipt note comes back
  await page.getByRole('button', { name: 'Receipt Note Received' }).click()
  await expect
    .poll(() => dispatchRow(dispatchId).receiptReceived)
    .not.toBeNull()
})
