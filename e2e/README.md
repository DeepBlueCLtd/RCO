# E2E Testing Guide

## Overview

This directory contains Playwright-based end-to-end tests for the VAL (Vault Asset Log) application. These tests verify critical user workflows including authentication, item management, batch operations, dispatch, and destruction workflows.

## Prerequisites

1. **Node.js 18.x** - Use NVM to manage Node versions:
   ```bash
   nvm install 18
   nvm use 18
   ```

2. **Dependencies** - Install all project dependencies:
   ```bash
   yarn install
   ```

3. **Playwright Browsers** - Install required browsers:
   ```bash
   npx playwright install chromium
   ```

4. **Database** - Ensure you have a test database at `db/RCO2.sqlite` with seed data

5. **Environment Variables** - Create `.env` file with required variables:
   ```
   TOKEN_SECRET=your_secret_here
   VITE_DATA_VERSION=1.0.0
   VITE_APP_VERSION=1.0.0
   ```

## Test Structure

```
e2e/
├── helpers/
│   └── auth-helpers.ts       # Reusable test helper functions
├── tests/
│   ├── authentication.spec.ts  # Login, logout, session management (18 tests)
│   ├── items.spec.ts          # Item CRUD workflows (14 tests)
│   └── batch.spec.ts          # Batch management (11 tests)
└── README.md                  # This file
```

## Running Tests

### Run All Tests

```bash
yarn e2e
```

### Run Specific Test File

```bash
yarn e2e tests/authentication.spec.ts
```

### Run Tests in UI Mode (Recommended for Development)

```bash
yarn e2e-ui
```

This opens the Playwright Test UI where you can:
- Run tests individually
- See test execution in real-time
- Debug failed tests
- View traces and screenshots

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Specific Test by Name

```bash
npx playwright test -g "should login successfully"
```

## Test Infrastructure

### Automatic Server Startup

The Playwright configuration (`playwright.config.ts`) automatically starts both the backend and frontend servers before running tests:

- **Backend**: `yarn serve:dev` → http://localhost:8000
- **Frontend**: `yarn dev` → http://localhost:5173

Tests will wait for both servers to be ready before execution begins.

### Database State Management

**CRITICAL**: Tests require a clean database state between runs to ensure repeatability.

#### Option 1: Git Reset (Recommended for Local Development)

Before running tests, reset the database to a known state:

```bash
# Run this before each test execution
./e2e/scripts/reset-test-db.sh
```

This script:
1. Reverts `db/RCO2.sqlite` to the committed version
2. Ensures consistent test data between runs

#### Option 2: Manual Reset

```bash
git checkout HEAD -- db/RCO2.sqlite
```

#### Option 3: Test Database Fixtures (Future Enhancement)

For CI/CD, consider creating dedicated test fixtures:
- `db/test-fixtures/RCO2.test.sqlite` - Clean database with seed data
- Copy fixture before each test run
- Keep separate from development database

## Test Users

Tests use predefined test users from `e2e/helpers/auth-helpers.ts`:

```typescript
TEST_USERS = {
  admin: { username: '20300', password: 'admin' },
  user: { username: '20300', password: 'admin' }
}
```

These credentials work with the default test database. If you need to test different user roles, create additional test users in the database and update the `TEST_USERS` constant.

## Helper Functions

### Authentication Helpers

```typescript
import { login, logout, isLoggedIn, TEST_USERS } from '../helpers/auth-helpers'

// Login
await login(page, TEST_USERS.admin)

// Logout
await logout(page)

// Check if user is logged in
const loggedIn = await isLoggedIn(page)
```

### Navigation Helpers

```typescript
import { navigateToResource } from '../helpers/auth-helpers'

// Navigate to Items
await navigateToResource(page, 'Items')

// Navigate to Batches
await navigateToResource(page, 'Batches')
```

### Notification Helpers

```typescript
import {
  waitForSuccessNotification,
  waitForErrorNotification
} from '../helpers/auth-helpers'

// Wait for success message
await waitForSuccessNotification(page, 'Item created successfully')

// Wait for error message
await waitForErrorNotification(page, 'Invalid credentials')
```

## Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test'
import { login, logout, TEST_USERS } from '../helpers/auth-helpers'

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin)
  })

  test.afterEach(async ({ page }) => {
    await logout(page)
  })

  test('should do something', async ({ page }) => {
    // Your test code
  })
})
```

### Best Practices

1. **Use Helper Functions** - Leverage existing helpers for common operations
2. **Clean State** - Reset database before test runs
3. **Explicit Waits** - Use `waitForLoadState('networkidle')` or `waitForSelector()`
4. **Descriptive Names** - Test names should clearly describe behavior
5. **Isolation** - Each test should be independent
6. **Assertions** - Include multiple assertions to verify complete behavior

## Test Coverage

### Completed (43 tests)

- ✅ Authentication flows (18 tests)
  - Login/logout
  - Session management
  - Failed login attempts
  - SQL injection protection
  - Account lockout

- ✅ Item workflows (14 tests)
  - List display
  - Create item
  - Edit item
  - Delete item
  - Form validation

- ✅ Batch management (11 tests)
  - List display
  - Create batch
  - Edit batch
  - Associate items
  - Remove items

### Planned (Future Enhancement)

- ⏳ Dispatch workflows
- ⏳ Destruction workflows
- ⏳ Vault location tracking
- ⏳ Permission-based access control
- ⏳ Session timeout handling
- ⏳ Audit trail verification

## Troubleshooting

### Tests Hang on Server Startup

**Symptom**: Tests timeout waiting for servers to start

**Solution**:
```bash
# Check if ports are already in use
lsof -i :8000
lsof -i :5173

# Kill existing processes if needed
kill -9 <PID>
```

### Database Locked Errors

**Symptom**: `SQLITE_BUSY: database is locked`

**Solution**:
- Stop all backend servers (`yarn serve:dev`)
- Reset database: `git checkout HEAD -- db/RCO2.sqlite`
- Restart tests

### Element Not Found Errors

**Symptom**: Tests fail with "Selector not found" errors

**Solution**:
- Check if test users exist in database
- Verify database has seed data
- Increase timeout: `await page.waitForSelector(selector, { timeout: 10000 })`
- Run in headed mode to see what's happening: `npx playwright test --headed`

### Browser Download Fails

**Symptom**: `Download failed: server returned code 403`

**Solution**:
- Check network/firewall restrictions
- Try manual browser install: `npx playwright install chromium --force`
- Set custom browser download server if needed

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Install Playwright browsers
        run: npx playwright install chromium --with-deps

      - name: Run E2E tests
        run: yarn e2e
        env:
          TOKEN_SECRET: ${{ secrets.TOKEN_SECRET }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging Tests

### Visual Debugging

```bash
# Run with Playwright Inspector
PWDEBUG=1 yarn e2e

# This opens a debugger window where you can:
# - Step through tests
# - Inspect elements
# - Try selectors
# - See screenshots
```

### Screenshots and Videos

Configure in `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry'
}
```

Reports are saved to `playwright-report/` and `test-results/`.

### Console Logs

View browser console logs in test:

```typescript
page.on('console', msg => console.log('BROWSER:', msg.text()))
```

## Known Issues and Limitations

1. **Database State**: Tests currently require manual database reset between runs. Future enhancement should add automatic fixture management.

2. **Test Data Dependencies**: Tests assume specific users and data exist in the database. Consider adding database seeding scripts.

3. **Timing Issues**: Some operations may need longer waits on slower systems. Adjust timeouts in `playwright.config.ts` if needed.

4. **Parallel Execution**: Tests currently run serially due to shared database state. Enable parallel execution once proper test isolation is implemented.

## Support

For issues or questions:
- Check existing test files for examples
- Review Playwright documentation: https://playwright.dev/
- Consult project CLAUDE.md for development guidelines
