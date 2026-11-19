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

interface DestructionRow {
  reportPrintedAt: string | null
  finalisedAt: string | null
  finalisedBy: string | null
}

const destructionRow = (id: number): DestructionRow =>
  querySql<DestructionRow>(
    'SELECT reportPrintedAt, finalisedAt, finalisedBy FROM destruction WHERE id = ?',
    id
  )[0]

const itemDestruction = (
  itemIds: number[]
): Array<{ destruction: number | null; destructionDate: string | null }> =>
  querySql(
    `SELECT destruction, destructionDate FROM item
     WHERE id IN (${itemIds.join(',')}) ORDER BY id`
  )

test('a power user creates a destruction, adds items, prints the certificate and destroys them', async ({
  page
}) => {
  const remarks = `E2E destruction ${Date.now()}`
  const { batchId, itemIds, itemNumbers } = seedBatch(2)
  await stubPrint(page)
  await login(page, USERS.power.username)
  await expectWelcome(page)

  // create the destruction
  await page.goto('/#/destruction/create')
  await page.getByLabel('Remarks').fill(remarks)
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page).toHaveURL(/#\/destruction\/\d+\/show/)
  const destructionUrl = page.url()
  const destructionId = Number(
    /destruction\/(\d+)\/show/.exec(destructionUrl)?.[1]
  )

  // add the items to it from their batch
  await page.goto(`/#/batch/${batchId}/show`)
  await selectItems(page, itemNumbers)
  await page.getByRole('button', { name: 'Destroy', exact: true }).click()
  const dialog = page.locator('.MuiModal-root')
  await dialog.locator('.MuiSelect-select').click()
  await page.getByRole('option', { name: new RegExp(remarks) }).click()
  await dialog.getByRole('button', { name: 'Destroy' }).click()
  await expect
    .poll(() => itemDestruction(itemIds).map((i) => i.destruction))
    .toEqual([destructionId, destructionId])

  // print the certificate: it lists the items
  await page.goto(destructionUrl)
  await page.getByRole('button', { name: 'Destruction Certificate' }).click()
  const certificate = page.locator('.printable')
  await expect(certificate).toContainText(itemNumbers[0])
  await expect(certificate).toContainText(itemNumbers[1])
  await certificate.getByRole('button', { name: 'Print' }).click()
  await expect
    .poll(() => destructionRow(destructionId).reportPrintedAt)
    .not.toBeNull()
  await certificate.getByRole('button', { name: 'Cancel' }).click()

  // destroy
  await page
    .getByRole('group', { name: 'Destruction', exact: true })
    .getByRole('button', { name: 'Destroy', exact: true })
    .click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect
    .poll(() => destructionRow(destructionId).finalisedAt)
    .not.toBeNull()
  await expect
    .poll(() =>
      itemDestruction(itemIds).every((i) => i.destructionDate !== null)
    )
    .toBe(true)
})
