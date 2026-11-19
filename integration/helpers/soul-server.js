// Starts a real soul-cli server with RCO's auth extensions, against a
// throwaway copy of the repo's development databases, for integration tests.
//
// RCO's extensions open `db/RCO2.sqlite` and `db/Security.sqlite` relative to
// process.cwd(), so each server runs in its own temporary working directory
// holding copies of both databases. Tests never touch the files in `db/`.

const { spawn } = require('child_process')
const fs = require('fs')
const net = require('net')
const os = require('os')
const path = require('path')
const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')

const REPO_ROOT = path.join(__dirname, '..', '..')
const SOUL_ENTRY = require.resolve('soul-cli/src/server.js')

const TOKEN_SECRET = 'integration-test-secret-not-for-production'
const PASSWORD = 'Integr@tion-Test-1'

// Role ids as defined in the _roles table
const ROLES = { DEFAULT: 1, RCO_USER: 2, RCO_POWER_USER: 3 }

// Test users added on top of the development data. Each run gets a fresh copy.
const USERS = {
  default: { username: 'it-default', role: ROLES.DEFAULT },
  user: { username: 'it-user', role: ROLES.RCO_USER },
  power: { username: 'it-power', role: ROLES.RCO_POWER_USER },
  other: { username: 'it-other', role: ROLES.RCO_USER },
  superuser: { username: 'it-super', role: null, isSuperuser: true },
  departed: {
    username: 'it-departed',
    role: ROLES.RCO_USER,
    departedDate: '2000-01-01 00:00:00'
  },
  overdue: {
    username: 'it-overdue',
    role: ROLES.RCO_USER,
    updateBefore: '2000-01-01T00:00:00.000Z'
  },
  noRole: { username: 'it-norole', role: null },
  // used only by the admin-reset end-to-end flow
  resetAdmin: { username: 'it-reset-admin', role: ROLES.RCO_POWER_USER },
  resetA: { username: 'it-reset-a', role: ROLES.RCO_USER },
  resetB: { username: 'it-reset-b', role: ROLES.RCO_USER },
  // departed during the e2e user-management test
  leaver: { username: 'it-leaver', role: ROLES.RCO_USER }
}

const freePort = () =>
  new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.unref()
    srv.on('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address()
      srv.close(() => resolve(port))
    })
  })

const seedUsers = (dbPath) => {
  const db = new BS3Database(dbPath)
  const hash = bcrypt.hashSync(PASSWORD, 10)
  const now = new Date().toISOString()
  // as the app does on user creation (UserLifeCycle): departs in 10 years
  const tenYears = new Date(Date.now() + 10 * 365 * 24 * 3600 * 1000)
  const notDeparted = tenYears.toISOString()
  const insertUser = db.prepare(
    `INSERT INTO _users (name, hashed_password, username, is_superuser,
       departedDate, updateBefore, createdAt, createdBy, lockoutAttempts)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0)`
  )
  const insertRole = db.prepare(
    'INSERT INTO _users_roles (user_id, role_id, createdAt, updatedAt) VALUES (?, ?, ?, ?)'
  )
  const ids = {}
  db.transaction(() => {
    for (const [key, u] of Object.entries(USERS)) {
      const { lastInsertRowid } = insertUser.run(
        u.username,
        hash,
        u.username,
        u.isSuperuser ? 1 : 0,
        u.departedDate ?? notDeparted,
        u.updateBefore ?? null,
        now
      )
      ids[key] = Number(lastInsertRowid)
      if (u.role) insertRole.run(ids[key], u.role, now, now)
    }
  })()
  db.close()
  return ids
}

const waitForServer = async (baseUrl, child, getLog, timeoutMs = 15000) => {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(
        `soul exited early (code ${child.exitCode}):\n${getLog()}`
      )
    }
    try {
      await fetch(`${baseUrl}/api/tables`)
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  throw new Error(`soul did not start within ${timeoutMs}ms:\n${getLog()}`)
}

/**
 * Start soul-cli with RCO's extensions and auth enabled.
 * Options: token expiry times; `port` (default: any free port); `cors`
 * (comma-separated origins, needed when a browser calls soul directly);
 * `extensions`: '_devExtensions' (default) or '_extensions', the production
 * set, which also serves the built frontend from dist/.
 * @returns {Promise<{baseUrl, ids, dbPath, workDir, stop}>}
 */
const startSoul = async ({
  accessTokenExpiry = '15m',
  refreshTokenExpiry = '60m',
  port: fixedPort,
  cors,
  extensions = '_devExtensions'
} = {}) => {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rco-it-'))
  fs.mkdirSync(path.join(workDir, 'db'))
  for (const file of ['RCO2.sqlite', 'Security.sqlite']) {
    fs.copyFileSync(
      path.join(REPO_ROOT, 'db', file),
      path.join(workDir, 'db', file)
    )
  }
  const dbPath = path.join(workDir, 'db', 'RCO2.sqlite')
  const ids = seedUsers(dbPath)

  const port = fixedPort || (await freePort())
  const args = [
    SOUL_ENTRY,
    '-d',
    dbPath,
    '-p',
    String(port),
    '-e',
    path.join(REPO_ROOT, extensions),
    '-a',
    '--ts',
    TOKEN_SECRET,
    '--atet',
    accessTokenExpiry,
    '--rtet',
    refreshTokenExpiry,
    '--env',
    path.join(workDir, '.env')
  ]
  if (cors) args.push('-c', cors)
  let log = ''
  const child = spawn(process.execPath, args, {
    cwd: workDir,
    env: { ...process.env, TOKEN_SECRET, NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe']
  })
  child.stdout.on('data', (d) => (log += d))
  child.stderr.on('data', (d) => (log += d))

  const baseUrl = `http://127.0.0.1:${port}`
  try {
    await waitForServer(baseUrl, child, () => log)
  } catch (err) {
    child.kill('SIGKILL')
    fs.rmSync(workDir, { recursive: true, force: true })
    throw err
  }

  const stop = async () => {
    if (child.exitCode === null) {
      await new Promise((resolve) => {
        child.once('exit', resolve)
        child.kill('SIGTERM')
      })
    }
    fs.rmSync(workDir, { recursive: true, force: true })
  }

  return { baseUrl, ids, dbPath, workDir, stop, log: () => log }
}

/** Open the server's database copy, run fn, close it. */
const withDb = (dbPath, fn) => {
  const db = new BS3Database(dbPath)
  try {
    return fn(db)
  } finally {
    db.close()
  }
}

module.exports = { startSoul, withDb, USERS, ROLES, PASSWORD, TOKEN_SECRET }
