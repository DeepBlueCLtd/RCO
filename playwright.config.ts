import { defineConfig, devices } from '@playwright/test'
import { prodBaseURL } from './e2e/prod-url'

// Optional: point at an already-installed Chromium instead of downloading one
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !(process.env.CI == null),
  retries: 0,
  reporter: process.env.CI == null ? 'html' : 'line',
  timeout: 30000,
  // starts soul (dev: port 8000, production: 8100) on temporary database copies
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
      // the dev frontend (Vite) against soul with _devExtensions
      name: 'chromium',
      testIgnore: /production\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath ? { executablePath } : {}
      }
    },
    {
      // the built frontend served by soul with _extensions, as `yarn serve`
      name: 'production',
      testMatch: /production\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: prodBaseURL(),
        launchOptions: executablePath ? { executablePath } : {}
      }
    }
  ]
})
