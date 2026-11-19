import { test, expect, type Page } from '@playwright/test'
import { USERS, login, expectWelcome } from '../helpers'

// Runs in the "production" project: the built frontend (dist/) served by
// soul with _extensions, as `yarn serve` does, on a non-localhost address.
// Catches what only shows up there: security headers (CSP etc.), static file
// serving, same-origin API calls and the production extension set.

// Browser advisories that are expected on a plain-HTTP deployment
const HARMLESS = [
  // soul >= 0.9 (helmet) sends COOP; browsers ignore it without HTTPS
  /Cross-Origin-Opener-Policy header has been ignored/
]

/** Collects browser-side problems: errors, CSP violations, failed requests. */
const watchForProblems = async (page: Page): Promise<string[]> => {
  const problems: string[] = []
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.error(`CSP violation: ${e.violatedDirective} ${e.blockedURI}`)
    })
  })
  page.on('pageerror', (e) => problems.push(`page error: ${e.message}`))
  page.on('console', (m) => {
    const text = m.text()
    if (m.type() === 'error' && !HARMLESS.some((re) => re.test(text))) {
      problems.push(`console: ${text}`)
    }
  })
  page.on('requestfailed', (r) =>
    problems.push(`request failed: ${r.url()} ${r.failure()?.errorText}`)
  )
  page.on('response', (r) => {
    if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`)
  })
  return problems
}

test('the production build loads and logs in', async ({ page }) => {
  const failed: string[] = []
  page.on('requestfailed', (r) =>
    failed.push(`${r.url()} ${r.failure()?.errorText}`)
  )
  await page.goto('/')
  // e.g. assets rewritten to https:// by a CSP `upgrade-insecure-requests`
  expect(failed, 'requests failed while loading the app').toEqual([])
  await login(page, USERS.power.username)
  await expectWelcome(page)
  expect(failed).toEqual([])
})

test('the main pages open without browser errors', async ({ page }) => {
  await login(page, USERS.power.username)
  await expectWelcome(page)
  // the app makes unauthenticated requests before login; watch from here on
  const problems = await watchForProblems(page)
  await page.reload()
  await expectWelcome(page)

  const menu = page.getByRole('menu')
  for (const [name, url] of [
    ['Projekts', /#\/project$/],
    ['Batches', /#\/batch$/],
    ['Live Items', /#\/richItem$/],
    ['Vault Locations', /#\/vaultLocation$/],
    ['Users', /#\/_users$/],
    ['Dispatches', /#\/dispatch$/],
    ['Destructions', /#\/destruction$/],
    ['All Items', /#\/allItems$/],
    ['Reference Data', /#\/reference-data$/]
  ] as const) {
    await menu.getByRole('menuitem', { name }).click()
    await expect(page).toHaveURL(url)
    await expect(page.getByText('Not Found')).toHaveCount(0)
    await page.waitForLoadState('networkidle')
  }
  expect(problems).toEqual([])
})
