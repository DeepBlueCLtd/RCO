import { defineConfig, devices } from '@playwright/test'

// Optional: point at an already-installed Chromium instead of downloading one
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !(process.env.CI == null),
  retries: 0,
  reporter: process.env.CI == null ? 'html' : 'line',
  timeout: 30000,
  // starts soul (port 8000) on a temporary copy of the database
  globalSetup: './e2e/global-setup.ts',
  // the frontend in development mode, talking to soul on port 8000
  webServer: {
    command: 'npx cross-env NODE_ENV=development vite --port 5173 --strictPort',
    url: 'http://localhost:5173/',
    reuseExistingServer: process.env.CI == null,
    timeout: 120000
  },
  use: {
    baseURL: 'http://localhost:5173/',
    trace: 'on-first-retry',
    headless: true
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath ? { executablePath } : {}
      }
    }
  ]
})
