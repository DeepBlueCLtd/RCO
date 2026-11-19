import { test, expect } from '../fixtures'
import { USERS, login, expectWelcome, querySql, userId } from '../helpers'

test('a power user creates a batch and adds items to it', async ({ page }) => {
  // a long multi-step workflow; the first tests also wait for the Vite dev
  // server to compile each page on first use
  test.slow()
  await login(page, USERS.power.username)
  await expectWelcome(page)

  // create the batch
  await page.getByRole('link', { name: 'New Batch' }).click()
  await page.getByLabel('Platform').click()
  await page.getByRole('option').first().click()
  await page.getByLabel('Projekt').click()
  await page.getByRole('option').first().click()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page).toHaveURL(/#\/batch\/\d+\/show/)
  const batchId = Number(/batch\/(\d+)\/show/.exec(page.url())?.[1])

  const [batch] = querySql<{ batchNumber: string; createdBy: number }>(
    'SELECT batchNumber, createdBy FROM batch WHERE id = ?',
    batchId
  )
  expect(batch.createdBy).toBe(userId('power'))
  expect(batch.batchNumber).toMatch(/^\d+\/\d{4}$/)

  // add two items: "Save / New" keeps the form open for the next one
  await page.getByRole('link', { name: 'Add item' }).click()
  const pick = async (label: string): Promise<void> => {
    const box = page.getByRole('combobox', { name: label, exact: true })
    // after "Save / New" the media type list is already open
    if ((await box.getAttribute('aria-expanded')) !== 'true') await box.click()
    await page.getByRole('option').first().click()
  }
  const itemNumbers = (): string[] =>
    querySql<{ itemNumber: string }>(
      'SELECT itemNumber FROM item WHERE batch = ? ORDER BY id',
      batchId
    ).map((i) => i.itemNumber)
  for (const [index, sheets] of ['LEP', '12'].entries()) {
    await pick('Media type')
    await pick('Protective marking')
    await pick('Vault location')
    await page.getByLabel('Consec/Sheets').fill(sheets)
    await page.getByRole('button', { name: /Save \/ New/ }).click()
    await expect(
      page.getByText(`Item ${batch.batchNumber}/${index + 1} has been saved`)
    ).toBeVisible()
    await expect.poll(itemNumbers).toHaveLength(index + 1)
  }

  const items = querySql<{
    itemNumber: string
    consecSheets: string
    createdBy: number
  }>(
    'SELECT itemNumber, consecSheets, createdBy FROM item WHERE batch = ? ORDER BY id',
    batchId
  )
  expect(items).toEqual([
    {
      itemNumber: `${batch.batchNumber}/1`,
      consecSheets: 'LEP',
      createdBy: userId('power')
    },
    {
      itemNumber: `${batch.batchNumber}/2`,
      consecSheets: '12',
      createdBy: userId('power')
    }
  ])

  // both appear in the batch's item list
  await page.goto(`/#/batch/${batchId}/show`)
  for (const item of items) {
    await expect(
      page.getByRole('row').filter({ hasText: item.itemNumber })
    ).toBeVisible()
  }
})
