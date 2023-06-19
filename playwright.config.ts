import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  workers: 10,
  forbidOnly: !(process.env.CI == null),
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  timeout: 180000,
  // Run your local dev server before starting the tests
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173/',
    reuseExistingServer: !process.env.CI
  },
  use: {
    // url when app started with `yarn dev`
    baseURL: 'http://localhost:5173/',
    trace: 'on-first-retry',
    headless: true
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
