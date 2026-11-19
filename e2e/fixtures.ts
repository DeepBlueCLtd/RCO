// The e2e `test` and `expect`. With E2E_COVERAGE=1, each test also records
// Chromium's JavaScript coverage and saves it to coverage-e2e/raw/ for
// e2e/coverage-report.js.
import fs from 'node:fs'
import path from 'node:path'
import { test as base } from '@playwright/test'

const RAW_DIR = path.join(__dirname, '..', 'coverage-e2e', 'raw')

export const test = base.extend<{ jsCoverage: void }>({
  jsCoverage: [
    async ({ page, browserName }, use, testInfo) => {
      const enabled =
        process.env.E2E_COVERAGE === '1' && browserName === 'chromium'
      if (enabled) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false })
      }
      await use()
      if (enabled) {
        const entries = await page.coverage.stopJSCoverage()
        // only the app's own modules, as served by the Vite dev server
        const app = entries.filter((e) =>
          new URL(e.url).pathname.startsWith('/src/')
        )
        fs.mkdirSync(RAW_DIR, { recursive: true })
        fs.writeFileSync(
          path.join(
            RAW_DIR,
            `${testInfo.testId}-${testInfo.repeatEachIndex}.json`
          ),
          JSON.stringify(app)
        )
      }
    },
    { auto: true }
  ]
})

export { expect, type Page } from '@playwright/test'
