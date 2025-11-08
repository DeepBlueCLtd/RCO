import { test, expect } from '@playwright/test'

test.describe('Login successful test', () => {
  test('Verify user is able to login with admin credentials', async ({
    page,
    baseURL
  }) => {
    await page.goto(baseURL as string)

    await page.locator('#username').type('20300')
    await page.locator('#password').type('admin')

    await page.locator('button[type="submit"]').click()
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

    await page.locator('#username').type('20300')
    await page.locator('#password').type('password')

    await page.locator('button[type="submit"]').click()
    await page.waitForLoadState()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toBeVisible()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toContainText('Invalid password')
  })

  test('Verify "Invalid username and password" message is visible when user login with invalid password', async ({
    page,
    baseURL
  }) => {
    await page.goto(baseURL as string)

    await page.locator('#username').type('jason')
    await page.locator('#password').type('password')

    await page.locator('button[type="submit"]').click()
    await page.waitForLoadState()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toBeVisible()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toContainText('User not found')
  })

  test('Verify "Invalid username and password" message is visible when admin login with invalid username and password', async ({
    page,
    baseURL
  }) => {
    await page.goto(baseURL as string)

    await page.locator('#username').type('invaliduser')
    await page.locator('#password').type('password')

    await page.locator('button[type="submit"]').click()
    await page.waitForLoadState()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toBeVisible()

    await expect(
      page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
    ).toContainText('User not found')
  })
})
