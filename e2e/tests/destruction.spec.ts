import { test, expect } from '@playwright/test'

test.describe('DESTRUCTION TEST', async () => {
  test('Create Destruction', async ({ page }) => {
    // Navigate to site and perform login using admin
    await page.goto('/')
    await page.getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByLabel('Username *').fill('ian')
    await page.getByLabel('Username *').press('Tab')
    await page.getByLabel('Password *').fill('admin')
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('menuitem', { name: 'Destructions' }).click()
    await page.reload()
    await page.getByRole('link', { name: 'Create' }).click()
    // await page.getByLabel('Remarks').click()
    await page.getByLabel('Remarks').fill('Test')

    const refrenceValue = await page
      .locator(':nth-child(2) > [class*="MuiInputBase-root"] input')
      .inputValue()
    const remarksValue = await page.locator('input#remarks').inputValue()

    await page.getByRole('button', { name: 'Create' }).click()

    await expect(
      page.locator('div.RaShow-card span:nth-child(1) span:nth-child(2)')
    ).toHaveText(refrenceValue)

    await expect(
      page.locator('div.RaShow-card span:nth-child(4) span:nth-child(2)')
    ).toHaveText(remarksValue)

    await expect(
      page.locator('div.RaShow-card span:nth-child(3) p:nth-child(2)')
    ).toHaveText('Pending')

    await expect(
      await page.getByRole('button', { name: 'Destruction Certificate' })
    ).toHaveText('Destruction Certificate')

    await expect(
      await page.getByRole('button', { name: 'Destroy' })
    ).toHaveText('Destroy')

    await expect(
      page.locator('//*[local-name()="svg" and @data-testid="InboxIcon"]/../p')
    ).toHaveText('No Live Items yet.')
  })
})
