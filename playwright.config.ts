import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !(process.env.CI == null),
  retries: process.env.CI != null ? 2 : 0,
  workers: process.env.CI != null ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://deepbluecltd.github.io/RCO/',

    trace: 'on',
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
