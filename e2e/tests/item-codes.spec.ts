import { test, expect, type Page } from '../fixtures'
import {
  USERS,
  login,
  expectWelcome,
  querySql,
  runSql,
  seedBatch
} from '../helpers'

// Protective-marking codes live in the itemCode bridging table. The app
// saves them by deleting an item's rows and inserting the new ones
// (useRefTable), so both roles need create and delete on it.

const ROLES = [
  { key: 'user', name: 'rco-user' },
  { key: 'power', name: 'rco-power-user' }
] as const

const codesOf = (itemId: number): string[] =>
  querySql<{ catCode: string }>(
    'SELECT catCode FROM itemCode WHERE item = ? ORDER BY catCode',
    itemId
  ).map((r) => r.catCode)

const twoCodes = (): Array<{ id: string; name: string }> =>
  querySql('SELECT id, name FROM catCode WHERE active = 1 ORDER BY id LIMIT 2')

const codeSelect = (page: Page): ReturnType<Page['locator']> =>
  page
    .locator('.MuiFormControl-root')
    .filter({ has: page.locator('label', { hasText: /^Code$/ }) })
    .getByRole('button')

const pick = async (page: Page, label: string): Promise<void> => {
  const box = page.getByRole('combobox', { name: label, exact: true })
  if ((await box.getAttribute('aria-expanded')) !== 'true') await box.click()
  await page.getByRole('option').first().click()
}

for (const role of ROLES) {
  test(`an ${role.name} adds an item with a code`, async ({ page }) => {
    const { batchId } = seedBatch(0)
    const [code] = twoCodes()
    const itemInBatch = (): number | undefined =>
      querySql<{ id: number }>(
        'SELECT id FROM item WHERE batch = ?',
        batchId
      )[0]?.id

    await login(page, USERS[role.key].username)
    await expectWelcome(page)
    await page.goto(`/#/richItem/create?batch=${batchId}`)
    await pick(page, 'Media type')
    await pick(page, 'Protective marking')
    await pick(page, 'Vault location')
    await codeSelect(page).click()
    await page.getByRole('option', { name: code.name }).click()
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: /Save \/ New/ }).click()

    await expect.poll(itemInBatch).toBeDefined()
    await expect.poll(() => codesOf(itemInBatch() as number)).toEqual([code.id])
  })

  test(`an ${role.name} changes an item's code`, async ({ page }) => {
    const { itemIds } = seedBatch(1)
    const [oldCode, newCode] = twoCodes()
    runSql(
      'INSERT INTO itemCode (item, catCode) VALUES (?, ?)',
      itemIds[0],
      oldCode.id
    )

    await login(page, USERS[role.key].username)
    await expectWelcome(page)
    await page.goto(`/#/richItem/${itemIds[0]}`)
    await codeSelect(page).click()
    await page.getByRole('option', { name: oldCode.name }).click()
    await page.getByRole('option', { name: newCode.name }).click()
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Save' }).click()
    const dialog = page.locator('.MuiModal-root').last()
    await dialog.getByLabel('Edit remarks').fill('e2e code change')
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect.poll(() => codesOf(itemIds[0])).toEqual([newCode.id])
  })
}
