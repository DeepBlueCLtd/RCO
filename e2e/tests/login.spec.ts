import { test, expect } from '@playwright/test'

test.describe('Login successful test', () => {
  test('Verify user is able to login with admin credentials', async ({
    page,
    baseURL
  }) => {
    await page.goto(baseURL as string)

    await page.getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Login' }).click()

    await page.getByLabel('Username *').fill('ian')
    await page.getByLabel('Username *').press('Tab')
    await page.getByLabel('Password *').fill('admin')

    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForLoadState()
    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).not.toBeVisible()
  })

  test('Verify user is able to login with user credentials', async ({
    page,
    baseURL
  }) => {
    await page.goto(baseURL as string)

    await page.getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Login' }).click()

    await page.getByLabel('Username *').fill('jason')
    await page.getByLabel('Username *').press('Tab')
    await page.getByLabel('Password *').fill('user')

    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForLoadState()
    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).not.toBeVisible()
  })
})

test.describe('Login failed test', () => {
  test('Verify "Invalid username and password" message is visible when admin login with invalid password', async ({
    page,
    baseURL
  }) => {
    await page.goto(baseURL as string)

    await page.getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Login' }).click()

    await page.getByLabel('Username *').fill('ian')
    await page.getByLabel('Username *').press('Tab')
    await page.getByLabel('Password *').fill('password')

    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForLoadState()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toBeVisible()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toHaveText('Invalid staff-ID or password')
  })

  test('Verify "Invalid username and password" message is visible when user login with invalid password', async ({
    page,
    baseURL
  }) => {
    await page.goto(baseURL as string)

    await page.getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Login' }).click()

    await page.getByLabel('Username *').fill('jason')
    await page.getByLabel('Username *').press('Tab')
    await page.getByLabel('Password *').fill('password')

    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForLoadState()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toBeVisible()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toHaveText('Invalid staff-ID or password')
  })

  test('Verify "Invalid username and password" message is visible when admin login with invalid username and password', async ({
    page,
    baseURL
  }) => {
    await page.goto(baseURL as string)

    await page.getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('button', { name: 'Login' }).click()

    await page.getByLabel('Username *').fill('invaliduser')
    await page.getByLabel('Username *').press('Tab')
    await page.getByLabel('Password *').fill('password')

    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForLoadState()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toBeVisible()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toHaveText('Invalid staff-ID or password')
  })
})
