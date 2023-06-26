import { expect, test } from '@playwright/test'

test.describe('LOAN ITEM', async () => {
  let refId: string
  let itemrefId: string
  let mediaTypeValue: string
  let cosecValue: string
  let protectiveMarking: string
  let projectName: string

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

    //Select Protection fields
    await page
      .getByRole('group', { name: 'Protection' })
      .getByRole('button', { name: 'Open' })
      .first()
      .click()
    await page.getByRole('option', { name: 'Cat Code:7' }).click()
    await page
      .getByRole('group', { name: 'Protection' })
      .getByRole('button', { name: 'Open' })
      .nth(1)
      .click()
    await page.getByRole('option', { name: 'Protective Marking:5' }).click()
    await page
      .getByRole('group', { name: 'Protection' })
      .getByRole('button', { name: 'Open' })
      .nth(2)
      .click()
    await page.getByRole('option', { name: 'Cat Handling:7' }).click()
    await page
      .getByRole('group', { name: 'Protection' })
      .getByRole('button', { name: 'Open' })
      .nth(3)
      .click()
    await page.getByRole('option', { name: 'Cat Cave:8' }).click()

    // Select current date and fill startDate
    const startDate = await page.locator('#startDate')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
    const currentDay = String(currentDate.getDate()).padStart(2, '0')
    const currentHours = String(currentDate.getHours()).padStart(2, '0')
    const currentMinutes = String(currentDate.getMinutes()).padStart(2, '0')
    const formattedStartDate = `${currentYear}-${currentMonth}-${currentDay}`
    await startDate.fill(formattedStartDate)

    // Select future date and fill endDate
    const nextDate = new Date(currentDate)
    nextDate.setDate(currentDate.getDate() + 1)
    const newYear = nextDate.getFullYear()
    const newMonth = String(nextDate.getMonth() + 1).padStart(2, '0')
    const newDay = String(nextDate.getDate()).padStart(2, '0')
    const formattedEndDate = `${newYear}-${newMonth}-${newDay}`
    const newHours = String(nextDate.getHours()).padStart(2, '0')
    const newMinutes = String(nextDate.getMinutes()).padStart(2, '0')
    const endDate = await page.locator('#endDate')
    await endDate.fill(formattedEndDate)

    //Add remarks
    await page.getByLabel('Remarks').fill('Testing Remarks')
    await page.getByLabel('Remarks').press('Tab')

    //Add notes
    await page.getByLabel('Receipt notes').fill('Testing Notes')

    // // Extract values for assertions
    const platformValue = await page.locator('#platform').inputValue()
    const projectName = await page.locator('input[id="project"]').inputValue()

    const remarksText = await page.locator('#remarks').textContent()
    const receiptNoteText = await page.locator('#receiptNotes').textContent()
    const catCode = await page.locator('#catCode').inputValue()
    const protectiveMarking = await page
      .locator('#protectiveMarking')
      .inputValue()
    const catHandling = await page.locator('#catHandling').inputValue()
    const catCave = await page
      .locator('(//input[@id="catCave"]/..//span)[1]')
      .innerText()

    // // Click on save button
    await page.click('button:has-text("Save")')

    refId = refId = (await page
      .locator('div#main-content div[class*="RaShow-noActions"] span')
      .textContent()) as string

    // Create loan item
    await page.getByRole('menuitem', { name: 'Batches' }).click()
    await page.getByPlaceholder('Search').click()
    await page.getByPlaceholder('Search').fill(refId)
    await page.getByRole('cell', { name: refId }).click()
    await page.getByRole('tab', { name: 'Items' }).click()
    await page.getByRole('link', { name: 'ADD ITEM' }).click()
    await page.getByLabel('Media type').click()
    await page.getByRole('option', { name: 'Media:29' }).click()
    await page.getByLabel('Consec/Pages').click()
    await page.getByLabel('Consec/Pages').fill('125/2022')

    // cosecValue = await page.locator('textarea#consecPages').inputValue()

    await page.getByLabel('Cat code').click()
    await page.getByRole('option', { name: 'Cat Code:7' }).click()
    await page.getByLabel('Protective marking').click()
    await page.getByRole('option', { name: 'Protective Marking:5' }).click()
    await page.getByLabel('Cat handling').click()
    await page.getByRole('option', { name: 'Cat Handling:7' }).click()
    await page.getByLabel('Cat cave').click()
    await page.getByRole('option', { name: 'Cat Cave:8' }).click()

    await page
      .locator('#startDate')
      .fill(`${formattedStartDate}T${currentHours}:${currentMinutes}`)
    await page
      .locator('#endDate')
      .fill(`${formattedEndDate}T${newHours}:${newMinutes}`)

    await page.getByLabel('Remarks', { exact: true }).click()
    await page.getByLabel('Remarks', { exact: true }).fill('Remarks')
    await page.getByLabel('Muster remarks').click()
    await page.getByLabel('Muster remarks').fill('Muster')
    const protectiveMarketingValue = await page
      .locator('input#protectiveMarking')
      .inputValue()

    const mediaTypeValue = await page.locator('input#mediaType').inputValue()

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

    await page.getByRole('menuitem', { name: 'Batches' }).click()
    await page.getByPlaceholder('Search').click()
    await page.getByPlaceholder('Search').fill(refId)
    await page.getByRole('cell', { name: refId }).click()
    await page.getByRole('tab', { name: 'Items' }).click()

    itemrefId = await page
      .locator(`//tbody/tr/td[2]//span[text()="${refId}/1"]`)
      .innerText()
  })

  test('Loan item to user', async ({ page }) => {
    await page.getByRole('menuitem', { name: 'Batches' }).click()
    await page.getByPlaceholder('Search').click()
    await page.getByPlaceholder('Search').fill(refId)
    await page.getByRole('cell', { name: refId }).click()
    await page.getByRole('tab', { name: 'Items' }).click()
    await page
      .locator(
        `//tbody/tr/td[2]//span[text()="${itemrefId}"]/../../td[1]//input`
      )
      .check()

    await page.getByRole('button', { name: 'Loan' }).click()
    await page.getByRole('button', { name: 'Open' }).click()
    await page.getByRole('option', { name: 'jason (d-2)' }).click()
    await page.getByRole('button', { name: 'Loan' }).click()
    await page.getByRole('menuitem', { name: 'Users' }).click()
    await page
      .getByRole('row', { name: 'Select this row d-2 jason RCO User' })
      .getByRole('checkbox')
      .uncheck()
    await page
      .getByRole('row', { name: 'Select this row d-2 jason RCO User' })
      .getByRole('checkbox')
      .check()
    await page.getByRole('button', { name: 'User Muster List' }).click()

    await expect(
      page.locator(`//table//td//span[text()="${itemrefId}"]`)
    ).toHaveText(itemrefId)
    await expect(
      page.locator(`//table//td//span[text()="${itemrefId}"]/../../td[2]/span`)
    ).toHaveText(mediaTypeValue)
    await expect(
      page.locator(`//table//td//span[text()="${itemrefId}"]/../../td[6]/span`)
    ).toHaveText(cosecValue)
    await expect(
      page.locator(`//table//td//span[text()="${itemrefId}"]/../../td[3]/span`)
    ).toHaveText(protectiveMarking)
    await expect(
      page.locator(`//table//td//span[text()="${itemrefId}"]/../../td[4]/span`)
    ).toHaveText(projectName)
  })
})
