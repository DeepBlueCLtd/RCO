import { test, expect } from '../fixtures'
import {
  USERS,
  login,
  errorMessage,
  expectWelcome,
  runSql,
  userId
} from '../helpers'

// Users are seeded by global-setup (integration/helpers/soul-server.js).
// Each test uses its own user where it changes that user's state, because
// tests run in parallel against one database.

test.describe('successful login', () => {
  test('an rco-user reaches the welcome page', async ({ page }) => {
    await login(page, USERS.user.username)
    await expectWelcome(page)
  })

  test('an rco-power-user reaches the welcome page', async ({ page }) => {
    await login(page, USERS.power.username)
    await expectWelcome(page)
  })

  test('a user with a password deadline sees the update banner', async ({
    page
  }) => {
    const future = new Date(Date.now() + 30 * 60000).toISOString()
    runSql(
      'UPDATE _users SET updateBefore = ? WHERE id = ?',
      future,
      userId('resetA')
    )
    await login(page, USERS.resetA.username)
    await expectWelcome(page)
    await expect(
      page.getByText('Please update your password before it expires.')
    ).toBeVisible()
  })
})

test.describe('refused login', () => {
  const expectRefused = async (
    page: Parameters<typeof login>[0],
    message: RegExp
  ): Promise<void> => {
    await expect(errorMessage(page)).toHaveText(message)
    await expect(page.locator('#username')).toBeVisible()
  }

  test('wrong password', async ({ page }) => {
    await login(page, USERS.other.username, 'Wrong-Password-1')
    await expectRefused(page, /Invalid username or password/)
  })

  test('unknown user', async ({ page }) => {
    await login(page, 'no-such-user')
    await expectRefused(page, /Invalid username or password/)
  })

  test('departed user', async ({ page }) => {
    await login(page, USERS.departed.username)
    await expectRefused(page, /User has departed organisation/)
  })

  test('password update deadline passed', async ({ page }) => {
    await login(page, USERS.overdue.username)
    await expectRefused(page, /not updated the password/)
  })

  test('locked-out user', async ({ page }) => {
    runSql(
      'UPDATE _users SET lockoutAttempts = 5 WHERE id = ?',
      userId('resetB')
    )
    await login(page, USERS.resetB.username)
    await expectRefused(page, /account is locked/)
  })
})
