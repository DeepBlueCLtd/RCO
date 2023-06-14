import { expect, test } from '@playwright/test'

test.describe('CREATE BATCH', () => {
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
  })

  test('Create new batch using admin', async ({ page }) => {
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

    // Extract values for assertions
    const platformValue = await page.locator('#platform').inputValue()
    const projectValue = await page.locator('input[id="project"]').inputValue()
    const yearOfReceipt = (
      await page.locator('[inputmode="text"]').inputValue()
    ).trim()
    const maxProtectiveMarkingValue = await page
      .locator('#maximumProtectiveMarking')
      .inputValue()
    const organisationText = await page.locator('#organisation').textContent()
    const departmentText = await page.locator('#department').textContent()
    const remarksText = await page.locator('#remarks').textContent()
    const receiptNoteText = await page.locator('#receiptNotes').textContent()

    // Click on save button
    await page.click('button:has-text("Save")')
    refId = (await page
      .locator('//div[@id="main-content"]//span[1]//div[3]/span')
      .textContent()) as string
    console.log(refId)
    // Assertions
    await expect(
      page.locator('(//div[@id="main-content"]//span)[1]')
    ).toContainText(`${currentYear}`)
    await expect(
      page.locator(
        'div.RaTabbedShowLayout-content span:nth-child(3) div:nth-child(1) span'
      )
    ).toHaveText(platformValue)
    await expect(
      page.locator(
        'div.RaTabbedShowLayout-content span:nth-child(2) div:nth-child(2) span:nth-child(1)'
      )
    ).toHaveText(projectValue)
    await expect(
      page.locator('//div[@id="main-content"]//span[3]//div[2]/span')
    ).toHaveText(organisationText)
    await expect(
      page.locator('//div[@id="main-content"]//span[4]//div[1]/span')
    ).toHaveText(departmentText)
    await expect(
      page.locator('//div[@id="main-content"]//span[4]//div[2]//span')
    ).toHaveText(maxProtectiveMarkingValue)
    await expect(
      page.locator(
        '//div[@class="RaTabbedShowLayout-content"]//span[5]//div[1]/span'
      )
    ).toHaveText(remarksText)
    await expect(
      page.locator(
        '//div[@class="RaTabbedShowLayout-content"]//span[5]//div[2]//span'
      )
    ).toHaveText(receiptNoteText)
    await expect(page.locator('//p[text()="Start Date"]/../span')).toHaveText(
      `${parseInt(currentMonth, 10)}/${currentDay}/${currentYear}`
    )
    await expect(page.locator('//p[text()="End Date"]/../span')).toHaveText(
      `${parseInt(newMonth, 10)}/${newDay}/${newYear}`
    )
    const batchNumberText = await page
      .locator('(//div[@id="main-content"]//span)[1]')
      .innerText()
    await expect(
      page.locator('//div[@id="main-content"]//span[1]//div[3]/span')
    ).toHaveText(batchNumberText)

    // await page.close();
  })
})
