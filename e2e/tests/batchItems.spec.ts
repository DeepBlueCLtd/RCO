import { expect, test } from '@playwright/test'

test.describe('BATCH ITEMS', async () => {
  let refId: string
  test.beforeEach(async ({ page }) => {
    // Navigate to site and perform login using admin
    await page.goto('/')
    await page.getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByLabel('Username *').fill('ian')
    await page.getByLabel('Username *').press('Tab')
    await page.getByLabel('Password *').fill('admin')
    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForLoadState()
    await page.getByRole('menuitem', { name: 'Welcome' }).click()

    //Go to create batch section
    await page.getByRole('link', { name: 'New Batch' }).click()
    await page.reload()

    //Select first platform
    await page.getByRole('button', { name: 'Open' }).first().click()
    await page.locator('#platform-option-0').click()

    //Select first project
    await page.getByRole('button', { name: 'Open' }).nth(1).click()
    await page.locator('#project-option-0').click()

    //Select first maximmum protective marking
    await page.getByRole('button', { name: 'Open' }).nth(2).click()
    await page.locator('#maximumProtectiveMarking-option-0').click()

    // Select current date and fill startDate
    const startDate = await page.locator('#startDate')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
    const currentDay = String(currentDate.getDate()).padStart(2, '0')
    const currentHours = String(currentDate.getHours()).padStart(2, '0')
    const currentMinutes = String(currentDate.getMinutes()).padStart(2, '0')
    const formattedStartDate = `${currentYear}-${currentMonth}-${currentDay}T${currentHours}:${currentMinutes}`
    await startDate.fill(formattedStartDate)

    // Select future date and fill endDate
    const nextDate = new Date(currentDate)
    nextDate.setDate(currentDate.getDate() + 1)
    const newYear = nextDate.getFullYear()
    const newMonth = String(nextDate.getMonth() + 1).padStart(2, '0')
    const newDay = String(nextDate.getDate()).padStart(2, '0')
    const newHours = String(nextDate.getHours()).padStart(2, '0')
    const newMinutes = String(nextDate.getMinutes()).padStart(2, '0')
    const formattedEndDate = `${newYear}-${newMonth}-${newDay}T${newHours}:${newMinutes}`
    const endDate = await page.locator('#endDate')
    await endDate.fill(formattedEndDate)

    //Add remarks
    await page.getByLabel('Remarks').fill('Testing Remarks')
    await page.getByLabel('Remarks').press('Tab')

    //Add notes
    await page.getByLabel('Receipt notes').fill('Testing Notes')

    // Click on save button
    await page.click('button:has-text("Save")')
    refId = (await page
      .locator('//div[@id="main-content"]//span[1]//div[3]/span')
      .textContent()) as string
  })
  test('Add items in batch', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'Batches' }).click()
    await page.getByPlaceholder('Search').click()
    await page.getByPlaceholder('Search').fill(refId)
    await page.getByRole('cell', { name: refId }).click()
    await page.getByRole('tab', { name: 'Items' }).click()
    await page.getByRole('link', { name: 'ADD ITEM' }).click()
    await page.getByLabel('Media type').click()
    await page.getByRole('option', { name: 'DVD' }).click()
    await page.getByLabel('Consec/Pages').click()
    await page.getByLabel('Consec/Pages').fill('125/2022')
    await page.getByLabel('Protective marking').click()
    await page.getByRole('option', { name: 'Protective Marking:5' }).click()
    await page.getByLabel('Remarks', { exact: true }).click()
    await page.getByLabel('Remarks', { exact: true }).fill('Remarks')
    await page.getByLabel('Muster remarks').click()
    await page.getByLabel('Muster remarks').fill('Muster')

    // Select current date and fill startDate
    const startDate = await page.locator('#start')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
    const currentDay = String(currentDate.getDate()).padStart(2, '0')
    const currentHours = String(currentDate.getHours()).padStart(2, '0')
    const currentMinutes = String(currentDate.getMinutes()).padStart(2, '0')
    const formattedStartDate = `${currentYear}-${currentMonth}-${currentDay}T${currentHours}:${currentMinutes}`
    await startDate.fill(formattedStartDate)

    // Select future date and fill endDate
    const nextDate = new Date(currentDate)
    nextDate.setDate(currentDate.getDate() + 1)
    const newYear = nextDate.getFullYear()
    const newMonth = String(nextDate.getMonth() + 1).padStart(2, '0')
    const newDay = String(nextDate.getDate()).padStart(2, '0')
    const newHours = String(nextDate.getHours()).padStart(2, '0')
    const newMinutes = String(nextDate.getMinutes()).padStart(2, '0')
    const formattedEndDate = `${newYear}-${newMonth}-${newDay}T${newHours}:${newMinutes}`
    const endDate = await page.locator('#end')
    await endDate.fill(formattedEndDate)

    const mediaTypeValue = await page.locator('#mediaType').inputValue()
    const protectiveMarketingValue = await page
      .locator('#protectiveMarking')
      .inputValue()

    await page.getByRole('button', { name: 'Save and Create' }).click()

    await page.getByRole('alert').textContent()
    await expect(page.getByRole('alert')).toHaveText(
      `Item ${refId}/1 has been saved. Now showing blank item.`
    )

    await page.getByRole('menuitem', { name: 'Batches' }).click()
    await page.getByPlaceholder('Search').click()
    await page.getByPlaceholder('Search').fill(refId)
    await page.getByRole('cell', { name: refId }).click()
    await page.getByRole('tab', { name: 'Items' }).click()

    const mediaType = await page.locator(
      `//tbody/tr/td[3]/span[text()="${mediaTypeValue}"]`
    )
    await expect(mediaType).toHaveText(mediaTypeValue)

    const protectiveMarking = await page.locator(
      `//tbody/tr/td[4]/span[text()="${protectiveMarketingValue}"]`
    )
    await expect(protectiveMarking).toHaveText(protectiveMarketingValue)

    const batchRefId = await page.locator(
      `//tbody/tr/td[5]//span[text()="${refId}"]`
    )
    await expect(batchRefId).toHaveText(refId)
  })
})