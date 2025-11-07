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

  // Wait for login form
  await page.waitForSelector('#username', { state: 'visible', timeout: 3000 })
  await page.waitForSelector('#password', { state: 'visible', timeout: 3000 })

  // Fill in credentials
  await page.locator('#username').fill(credentials.username)
  await page.locator('#password').fill(credentials.password)

  // Submit and wait for navigation
  await page.locator('button[type="submit"]').click()
  await page.waitForLoadState('networkidle')
}

/**
 * Logout helper function
 */
export async function logout(page: Page): Promise<void> {
  // Click user menu button
  await page.locator('.RaUserMenu-userButton, [aria-label="Profile"]').click()

  // Click logout option
  await page.locator('text=Logout').click()

  // Wait for redirect to login page
  await page.waitForURL(/.*#\/login/, { timeout: 3000 })
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
  const notification = page.locator('.MuiSnackbarContent-message, .MuiAlert-message, [role="alert"]').first()
  await expect(notification).toBeVisible({ timeout: 3000 })

  if (message) {
    await expect(notification).toContainText(message)
  }
}

/**
 * Wait for error notification
 */
export async function waitForErrorNotification(page: Page, message?: string): Promise<void> {
  const notification = page.locator('.MuiSnackbarContent-message, .MuiAlert-message, [role="alert"]').first()
  await expect(notification).toBeVisible({ timeout: 3000 })

  if (message) {
    await expect(notification).toContainText(message)
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
 * Navigate to a resource via menu using data-testid
 * Maps test IDs to resource display names for clicking
 */
export async function navigateToResourceByTestId(page: Page, testId: string): Promise<void> {
  // Map test IDs to display text that appears in menu
  // React-Admin Menu.ResourceItem displays singular capitalized resource names
  const resourceMap: Record<string, string> = {
    'menu-platforms': 'Platform',
    'menu-projects': 'Project',
    'menu-batches': 'Batch',
    'menu-items': 'Items',  // RichItems resource displays as "Items"
    'menu-vault-location': 'Vault Location',
    'menu-users': 'User',
    'menu-dispatch': 'Dispatch',
    'menu-destruction': 'Destruction',
    'menu-all-items': 'All Items',
    'menu-reference-data': 'Reference Data'
  }

  const resourceText = resourceMap[testId]
  if (!resourceText) {
    throw new Error(`Unknown test ID: ${testId}. Add it to resourceMap in auth-helpers.ts`)
  }

  // Click menu item by text
  await page.waitForLoadState('networkidle')

  // Small delay to let React-Admin routing fully initialize
  await page.waitForTimeout(100)

  await page.locator(`text=${resourceText}`).first().click()
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
