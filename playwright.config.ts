import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !(process.env.CI == null),
  retries: 0,
  reporter: 'html',
  timeout: 20000, // Timeout for tests with complex navigation
  workers: 1, // Run tests serially to avoid "Target closed" errors
  globalTeardown: './e2e/global-teardown.ts', // Reset database after all tests
  // Run both backend and frontend servers before starting tests
  webServer: [
    {
      command: 'bash -c "source ~/.nvm/nvm.sh 2>/dev/null || source /opt/nvm/nvm.sh 2>/dev/null || true; nvm use 18 2>/dev/null || true; yarn serve:dev"',
      url: 'http://localhost:8000/api/',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'inherit',
      stderr: 'inherit'
    },
    {
      command: 'bash -c "source ~/.nvm/nvm.sh 2>/dev/null || source /opt/nvm/nvm.sh 2>/dev/null || true; nvm use 18 2>/dev/null || true; yarn dev"',
      url: 'http://localhost:5173/',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'inherit',
      stderr: 'inherit'
    }
  ],
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
