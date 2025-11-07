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

  // Submit and wait for dashboard/menu to appear
  await page.locator('button[type="submit"]').click()
  await page.locator('.RaLayout-appFrame, [role="main"], .RaMenu-root').first().waitFor({ state: 'visible', timeout: 5000 })
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
  // Wait for menu item to be visible
  const menuItem = page.locator(`text=${resourceName}`).first()
  await menuItem.waitFor({ state: 'visible', timeout: 5000 })

  // Click on the menu item
  await menuItem.click()

  // Wait for list page to load
  await page.locator('table, [role="main"], .RaList-main').first().waitFor({ state: 'visible', timeout: 5000 })
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
    'menu-projects': 'Projekts',
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

  // Wait for menu item to be visible
  const menuItem = page.locator(`text=${resourceText}`).first()
  await menuItem.waitFor({ state: 'visible', timeout: 5000 })

  await menuItem.click()

  // Wait for list page to load - look for table or main content area
  await page.locator('table, [role="main"], .RaList-main').first().waitFor({ state: 'visible', timeout: 5000 })
}

/**
 * Navigate to a reference data sub-resource (nested under Reference Data menu)
 * These resources are accessed via cards on the Reference Data page
 */
export async function navigateToReferenceDataResource(page: Page, resourceName: string): Promise<void> {
  // Map resource names to card titles shown on Reference Data page
  const referenceDataMap: Record<string, string> = {
    'platforms': 'Platforms',
    'audit': 'Audit Log',
    'addresses': 'Addresses',
    'organisation': 'Organisation',
    'protective-marking': 'Protective Marking',
    'media-type': 'Media Type',
    'vault': 'Vault',
    'cat-code': 'Cat Code',
    'cat-handle': 'Cat Handle',
    'cat-cave': 'Cat Cave',
    'department': 'Department'
  }

  const cardTitle = referenceDataMap[resourceName]
  if (!cardTitle) {
    throw new Error(`Unknown reference data resource: ${resourceName}. Add it to referenceDataMap in auth-helpers.ts`)
  }

  // First navigate to Reference Data page
  await navigateToResourceByTestId(page, 'menu-reference-data')

  // Then click the specific resource card
  const card = page.locator(`text=${cardTitle}`).first()
  await card.waitFor({ state: 'visible', timeout: 5000 })
  await card.click()

  // Wait for list page to load
  await page.locator('table, [role="main"], .RaList-main').first().waitFor({ state: 'visible', timeout: 5000 })
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
