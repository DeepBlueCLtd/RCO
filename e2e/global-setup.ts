// Starts a real soul-cli server for the e2e tests, using the integration
// test harness: a temporary copy of db/, RCO's _devExtensions, auth on, and
// seeded test users (see integration/helpers/soul-server.js).
//
// The dev frontend (yarn dev) calls http://localhost:8000, so soul must use
// that port, with CORS open to the Vite dev server.
import { type FullConfig } from '@playwright/test'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const startSoul = require('../integration/helpers/soul-server').startSoul

export default async function globalSetup(
  _config: FullConfig
): Promise<() => Promise<void>> {
  const server = await startSoul({
    port: 8000,
    cors: 'http://localhost:5173,http://127.0.0.1:5173'
  })
  // read by tests that need to arrange data (helpers.ts)
  process.env.E2E_DB_PATH = server.dbPath
  process.env.E2E_USER_IDS = JSON.stringify(server.ids)

  // returned function runs as global teardown
  return async () => {
    await server.stop()
  }
}
