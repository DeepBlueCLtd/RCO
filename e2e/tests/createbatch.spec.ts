import { expect, test } from '@playwright/test'

test.describe('CREATE BATCH', () => {
  test('Create new batch using admin', async ({ page }) => {
    // Navigate to site and perform login using admin
    await page.goto('/')
    await page.getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByLabel('Username *').fill('ian')
    await page.getByLabel('Username *').press('Tab')
    await page.getByLabel('Password *').fill('admin')
    await page.getByRole('button', { name: 'Login' }).click()

    //Go to create batch section
    await page.getByRole('menuitem', { name: 'Batches' }).click()
    await page.getByRole('link', { name: 'ADD NEW BATCH' }).click()

    //Select first platform
    await page.getByRole('button', { name: 'Open' }).first().click()
    await page.locator('#platform-option-0').click()

    //Select first project
    await page.getByRole('button', { name: 'Open' }).nth(1).click()
    await page.locator('#project-option-0').click()

    //Select first maximmum protective marking
    await page.getByRole('button', { name: 'Open' }).nth(2).click()
    await page.locator('#maximumProtectiveMarking-option-0').click()

    //Select current date and fill startDate
    const startDate = await page.locator('#startDate')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')
    const currentDay = currentDate.getDate().toString().padStart(2, '0')
    const currentHours = currentDate.getHours().toString().padStart(2, '0')
    const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0')
    const formattedStartDate = `${currentYear}-${currentMonth}-${currentDay}T${currentHours}:${currentMinutes}`
    await startDate.fill(formattedStartDate)

    //Select future date and fill endDate
    const nextDate = new Date(currentDate)
    nextDate.setDate(currentDate.getDate() + 1)
    const newYear = nextDate.getFullYear()
    const newMonth = (nextDate.getMonth() + 1).toString().padStart(2, '0')
    const newDay = nextDate.getDate().toString().padStart(2, '0')
    const newHours = nextDate.getHours().toString().padStart(2, '0')
    const newMinutes = nextDate.getMinutes().toString().padStart(2, '0')
    const formattedEndDate = `${newYear}-${newMonth}-${newDay}T${newHours}:${newMinutes}`
    const endDate = await page.locator('#endDate')
    await endDate.fill(formattedEndDate)

    //Add remarks
    await page.getByLabel('Remarks').fill('Testing Remarks')
    await page.getByLabel('Remarks').press('Tab')
    //Add notes
    await page.getByLabel('Receipt notes').fill('Testing Notes')
    //Click on save button
    await page.getByRole('button', { name: 'Save' }).click()

    //Verify ref no contains valid year
    await expect(
      page.locator('(//div[@id="main-content"]//span)[1]')
    ).toContainText(`${currentYear}`)
    await page.close()
  })
})
