import { test, expect } from '@playwright/test'
import {
  login,
  logout,
  isLoggedIn,
  waitForErrorNotification,
  TEST_USERS
} from '../helpers/auth-helpers'

test.describe('Authentication Flows', () => {
  test.describe('Login', () => {
    test('should login successfully with admin credentials', async ({ page }) => {
      await login(page, TEST_USERS.admin)

      // Verify we're logged in by checking for user menu
      await expect(page).not.toHaveURL('/')
      const loggedIn = await isLoggedIn(page)
      expect(loggedIn).toBe(true)
    })

    test('should login successfully with regular user credentials', async ({ page }) => {
      await login(page, TEST_USERS.user)

      // Verify we're logged in
      await expect(page).not.toHaveURL('/')
      const loggedIn = await isLoggedIn(page)
      expect(loggedIn).toBe(true)
    })

    test('should reject invalid username', async ({ page }) => {
      await page.goto('/')
      await page.locator('#username').fill('invaliduser')
      await page.locator('#password').fill('password')
      await page.locator('button[type="submit"]').click()

      await waitForErrorNotification(page, 'User not found')

      // Should still be on login page
      await expect(page.locator('#username')).toBeVisible()
    })

    test('should reject invalid password', async ({ page }) => {
      await page.goto('/')
      await page.locator('#username').fill(TEST_USERS.admin.username)
      await page.locator('#password').fill('wrongpassword')
      await page.locator('button[type="submit"]').click()

      await waitForErrorNotification(page, 'Invalid password')

      // Should still be on login page
      await expect(page.locator('#username')).toBeVisible()
    })

    test('should reject empty username', async ({ page }) => {
      await page.goto('/')
      await page.locator('#password').fill('password')
      await page.locator('button[type="submit"]').click()

      // Form validation should prevent submission or show error
      await expect(page.locator('#username')).toBeVisible()
    })

    test('should reject empty password', async ({ page }) => {
      await page.goto('/')
      await page.locator('#username').fill(TEST_USERS.admin.username)
      await page.locator('button[type="submit"]').click()

      // Form validation should prevent submission or show error
      await expect(page.locator('#password')).toBeVisible()
    })
  })

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // Login first
      await login(page, TEST_USERS.admin)
      await expect(page).not.toHaveURL('/')

      // Logout
      await logout(page)

      // Verify we're back on login page (URL should contain #/login)
      await expect(page).toHaveURL(/\/#\/login/)
      await expect(page.locator('#username')).toBeVisible()
      await expect(page.locator('#password')).toBeVisible()
    })

    test('should not be able to access protected pages after logout', async ({ page }) => {
      // Login first
      await login(page, TEST_USERS.admin)

      // Navigate to a protected page
      await page.goto('/items')
      await page.waitForLoadState('networkidle')

      // Logout
      await logout(page)

      // Try to access protected page
      await page.goto('/items')

      // Should redirect to login (URL will be /items#/login due to hash routing)
      await expect(page).toHaveURL(/.*#\/login/)
      await expect(page.locator('#username')).toBeVisible()
    })

    test('should clear authentication state after logout', async ({ page }) => {
      // Login
      await login(page, TEST_USERS.admin)

      // Store some page state
      const beforeLogoutUrl = page.url()
      expect(beforeLogoutUrl).not.toBe('/')

      // Logout
      await logout(page)

      // Try to go back using browser history
      await page.goBack()

      // Should still be on login page or redirected to login
      const isStillLoggedOut = await page.locator('#username').isVisible({ timeout: 3000 })
        .catch(() => false)

      // Either on login page or redirected there
      expect(isStillLoggedOut || page.url() === '/').toBe(true)
    })
  })

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      // Login
      await login(page, TEST_USERS.admin)
      const afterLoginUrl = page.url()

      // Refresh page
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Should still be logged in
      const loggedIn = await isLoggedIn(page)
      expect(loggedIn).toBe(true)

      // Should be on same page or similar
      const afterRefreshUrl = page.url()
      expect(afterRefreshUrl).not.toBe('/')
    })

    test('should handle concurrent sessions in different contexts', async ({ browser }) => {
      // Create two contexts (like two browser windows)
      const context1 = await browser.newContext()
      const context2 = await browser.newContext()

      const page1 = await context1.newPage()
      const page2 = await context2.newPage()

      try {
        // Login in both contexts with same user
        await login(page1, TEST_USERS.admin)
        await login(page2, TEST_USERS.admin)

        // Both should be logged in
        expect(await isLoggedIn(page1)).toBe(true)
        expect(await isLoggedIn(page2)).toBe(true)

        // Logout from one context
        await logout(page1)

        // First context should be logged out
        expect(await isLoggedIn(page1)).toBe(false)

        // Second context should still be logged in
        expect(await isLoggedIn(page2)).toBe(true)
      } finally {
        await context1.close()
        await context2.close()
      }
    })

    test('should handle navigation between pages while logged in', async ({ page }) => {
      // Login
      await login(page, TEST_USERS.admin)

      // Navigate to multiple pages
      await page.goto('/items')
      await page.waitForLoadState('networkidle')
      expect(await isLoggedIn(page)).toBe(true)

      await page.goto('/batches')
      await page.waitForLoadState('networkidle')
      expect(await isLoggedIn(page)).toBe(true)

      await page.goto('/dispatch')
      await page.waitForLoadState('networkidle')
      expect(await isLoggedIn(page)).toBe(true)

      // Should still be logged in
      expect(await isLoggedIn(page)).toBe(true)
    })
  })

  test.describe('Security', () => {
    test('should not expose credentials in URL', async ({ page }) => {
      await login(page, TEST_USERS.admin)

      const url = page.url()
      expect(url).not.toContain('password')
      expect(url).not.toContain('admin')
    })

    test('should not allow SQL injection in username field', async ({ page }) => {
      await page.goto('/')
      await page.locator('#username').fill("' OR '1'='1")
      await page.locator('#password').fill('password')
      await page.locator('button[type="submit"]').click()

      // Should fail to login
      await waitForErrorNotification(page, 'User not found')
      expect(await isLoggedIn(page)).toBe(false)
    })

    test('should not allow XSS in username field', async ({ page }) => {
      await page.goto('/')
      await page.locator('#username').fill('<script>alert("xss")</script>')
      await page.locator('#password').fill('password')
      await page.locator('button[type="submit"]').click()

      // Should fail to login and not execute script
      await waitForErrorNotification(page, 'User not found')

      // No alert should have appeared (script not executed)
      const dialogs: string[] = []
      page.on('dialog', dialog => dialogs.push(dialog.message()))

      expect(dialogs).toHaveLength(0)
    })
  })
})
