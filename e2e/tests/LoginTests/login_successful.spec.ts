import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages'
import { ValidLoginCredentials } from '../../data/LoginTest'

test.describe.parallel('Login successful test', () => {
  test('Verify user is able to login with admin credentials', async ({
    page
  }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto('/RCO')

    await loginPage.login(
      ValidLoginCredentials.admin.username,
      ValidLoginCredentials.admin.password
    )
    await expect(loginPage.invalidUserOrPasswordMessage).not.toBeVisible()
  })

  test('Verify user is able to login with user credentials', async ({
    page
  }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto('/RCO')

    await loginPage.login(
      ValidLoginCredentials.user.username,
      ValidLoginCredentials.user.password
    )
    await expect(loginPage.invalidUserOrPasswordMessage).not.toBeVisible()
  })
})
