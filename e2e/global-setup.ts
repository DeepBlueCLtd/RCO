// Starts real soul-cli servers for the e2e tests, using the integration
// test harness: a temporary copy of db/, auth on, and seeded test users
// (see integration/helpers/soul-server.js).
//
// - port 8000, _devExtensions: the dev frontend (yarn dev) calls
//   http://localhost:8000, with CORS open to the Vite dev server.
// - port 8100, _extensions: the production setup (as `yarn serve`), which
//   serves the built frontend from dist/. Needs `yarn build` first.
import fs from 'node:fs'
import path from 'node:path'
import { type FullConfig } from '@playwright/test'
import { PROD_PORT, prodOrigins } from './prod-url'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const startSoul = require('../integration/helpers/soul-server').startSoul

const hasBuild = (): boolean =>
  fs.existsSync(path.join(__dirname, '..', 'dist', 'index.html'))

export default async function globalSetup(
  _config: FullConfig
): Promise<() => Promise<void>> {
  const dev = await startSoul({
    port: 8000,
    cors: 'http://localhost:5173,http://127.0.0.1:5173'
  })
  // read by tests that need to arrange data (helpers.ts)
  process.env.E2E_DB_PATH = dev.dbPath
  process.env.E2E_USER_IDS = JSON.stringify(dev.ids)

  let prod: { stop: () => Promise<void> } | undefined
  if (hasBuild()) {
    prod = await startSoul({
      port: PROD_PORT,
      extensions: '_extensions',
      cors: prodOrigins()
    })
  } else if (process.env.CI) {
    throw new Error('dist/ not found: run `yarn build` before the e2e tests')
  } else {
    console.warn('dist/ not found: production tests will fail (run yarn build)')
  }

  // returned function runs as global teardown
  return async () => {
    await dev.stop()
    if (prod) await prod.stop()
  }
}
