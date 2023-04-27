import { test, expect } from '@playwright/test'

test.describe('Login successful test', () => {
  test('Verify user is able to login with admin credentials', async ({
    page
  }) => {
    await page.goto('/RCO')

    const usernameInputField = page.locator('#username')
    const passwordInputField = page.locator('#password')
    const loginButton = page.locator('button[type="submit"]')
    const invalidUserOrPasswordMessage = page.locator(
      '//div[contains(@class, "MuiSnackbarContent-message")]'
    )

    await usernameInputField.type('ian')
    await passwordInputField.type('admin')

    await loginButton.click()
    await page.waitForLoadState()
    await expect(invalidUserOrPasswordMessage).not.toBeVisible()
  })

  test('Verify user is able to login with user credentials', async ({
    page
  }) => {
    await page.goto('/RCO')

    const usernameInputField = page.locator('#username')
    const passwordInputField = page.locator('#password')
    const loginButton = page.locator('button[type="submit"]')
    const invalidUserOrPasswordMessage = page.locator(
      '//div[contains(@class, "MuiSnackbarContent-message")]'
    )

    await usernameInputField.type('jason')
    await passwordInputField.type('user')

    await loginButton.click()
    await page.waitForLoadState()
    await expect(invalidUserOrPasswordMessage).not.toBeVisible()
  })
})

test.describe('Login failed test', () => {
  test('Verify "Invalid username and password" message is visible when admin login with invalid password', async ({
    page
  }) => {
    await page.goto('/RCO')

    const usernameInputField = page.locator('#username')
    const passwordInputField = page.locator('#password')
    const loginButton = page.locator('button[type="submit"]')
    const invalidUserOrPasswordMessage = page.locator(
      '//div[contains(@class, "MuiSnackbarContent-message")]'
    )

    await usernameInputField.type('ian')
    await passwordInputField.type('password')

    await loginButton.click()
    await page.waitForLoadState()
    await expect(invalidUserOrPasswordMessage).toBeVisible()
    await expect(invalidUserOrPasswordMessage).toHaveText(
      'Invalid email or password'
    )
  })

  test('Verify "Invalid username and password" message is visible when user login with invalid password', async ({
    page
  }) => {
    await page.goto('/RCO')

    const usernameInputField = page.locator('#username')
    const passwordInputField = page.locator('#password')
    const loginButton = page.locator('button[type="submit"]')
    const invalidUserOrPasswordMessage = page.locator(
      '//div[contains(@class, "MuiSnackbarContent-message")]'
    )

    await usernameInputField.type('jason')
    await passwordInputField.type('password')

    await loginButton.click()
    await page.waitForLoadState()
    await expect(invalidUserOrPasswordMessage).toBeVisible()
    await expect(invalidUserOrPasswordMessage).toHaveText(
      'Invalid email or password'
    )
  })

  test('Verify "Invalid username and password" message is visible when admin login with invalid username and password', async ({
    page
  }) => {
    await page.goto('/RCO')

    const usernameInputField = page.locator('#username')
    const passwordInputField = page.locator('#password')
    const loginButton = page.locator('button[type="submit"]')
    const invalidUserOrPasswordMessage = page.locator(
      '//div[contains(@class, "MuiSnackbarContent-message")]'
    )

    await usernameInputField.type('invaliduser')
    await passwordInputField.type('password')

    await loginButton.click()
    await page.waitForLoadState()
    await expect(invalidUserOrPasswordMessage).toBeVisible()
    await expect(invalidUserOrPasswordMessage).toHaveText(
      'Invalid email or password'
    )
  })
})
