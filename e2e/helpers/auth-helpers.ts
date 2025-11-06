import { type Page, expect } from '@playwright/test'

/**
 * Test helper functions for authentication flows
 */

export interface LoginCredentials {
  username: string
  password: string
}

export const TEST_USERS = {
  admin: { username: '20300', password: 'admin' },
  user: { username: '20300', password: 'admin' } // TODO: Add a second test user with regular user role
}

/**
 * Login helper function
 */
export async function login(page: Page, credentials: LoginCredentials): Promise<void> {
  await page.goto('/')
  await page.locator('#username').fill(credentials.username)
  await page.locator('#password').fill(credentials.password)
  await page.locator('button[type="submit"]').click()
  await page.waitForLoadState('networkidle')
}

/**
 * Logout helper function
 */
export async function logout(page: Page): Promise<void> {
  // Click user menu button
  await page.locator('[aria-label="User menu"]').click()

  // Click logout option
  await page.locator('text=Logout').click()

  // Wait for redirect to login page
  await page.waitForURL('/')
  await expect(page.locator('#username')).toBeVisible()
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Check if login form is NOT visible (means we're logged in)
    const loginForm = page.locator('#username')
    const isVisible = await loginForm.isVisible({ timeout: 2000 })
    return !isVisible
  } catch {
    return true // If timeout, assume we're logged in
  }
}

/**
 * Wait for success notification
 */
export async function waitForSuccessNotification(page: Page, message?: string): Promise<void> {
  const notification = page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
  await expect(notification).toBeVisible()

  if (message) {
    await expect(notification).toContainText(message)
  }
}

/**
 * Wait for error notification
 */
export async function waitForErrorNotification(page: Page, message?: string): Promise<void> {
  const notification = page.locator('//div[contains(@class, "MuiSnackbarContent-message")]')
  await expect(notification).toBeVisible()

  if (message) {
    await expect(notification).toHaveText(message)
  }
}

/**
 * Navigate to a resource via the menu
 */
export async function navigateToResource(page: Page, resourceName: string): Promise<void> {
  // Wait for page to be ready
  await page.waitForLoadState('networkidle')

  // Click on the menu item
  await page.locator(`text=${resourceName}`).first().click()

  // Wait for navigation
  await page.waitForLoadState('networkidle')
}

/**
 * Check if element is accessible (visible and enabled)
 */
export async function isAccessible(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector)
    const isVisible = await element.isVisible({ timeout: 1000 })
    const isEnabled = await element.isEnabled({ timeout: 1000 })
    return isVisible && isEnabled
  } catch {
    return false
  }
}
