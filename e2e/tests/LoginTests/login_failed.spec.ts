import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages'
import { ValidLoginCredentials, invalidPassword } from '../../data/LoginTest'

test.describe.parallel('Login failed test', () => {
  test('Verify "Invalid username and password" message is visible when admin login with invalid password', async ({
    page
  }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto('/RCO')

    await loginPage.login(ValidLoginCredentials.admin.username, invalidPassword)
    await expect(loginPage.invalidUserOrPasswordMessage).toBeVisible()
    await expect(loginPage.invalidUserOrPasswordMessage).toHaveText(
      'Invalid email or password'
    )
  })

  test('Verify "Invalid username and password" message is visible when user login with invalid password', async ({
    page
  }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto('/RCO')

    await loginPage.login(ValidLoginCredentials.user.username, invalidPassword)
    await expect(loginPage.invalidUserOrPasswordMessage).toBeVisible()
    await expect(loginPage.invalidUserOrPasswordMessage).toHaveText(
      'Invalid email or password'
    )
  })

  test('Verify "Invalid username and password" message is visible when admin login with invalid username and password', async ({
    page
  }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto('/RCO')

    await loginPage.login(ValidLoginCredentials.admin.username, invalidPassword)
    await expect(loginPage.invalidUserOrPasswordMessage).toBeVisible()
    await expect(loginPage.invalidUserOrPasswordMessage).toHaveText(
      'Invalid email or password'
    )
  })

  test('Verify "Invalid username and password" message is visible when user login with invalid username and password', async ({
    page
  }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto('/RCO')

    await loginPage.login(ValidLoginCredentials.user.username, invalidPassword)
    await expect(loginPage.invalidUserOrPasswordMessage).toBeVisible()
    await expect(loginPage.invalidUserOrPasswordMessage).toHaveText(
      'Invalid email or password'
    )
  })
})
