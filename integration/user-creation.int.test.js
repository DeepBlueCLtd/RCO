// Creating users through soul's API: new accounts are never superusers.
// Guarded in the database (db/Scripts/migrations/
// 2026-11-19-no-superuser-on-create.sql), so it holds whatever the route.
const harness = require('./helpers/soul-server')
const Client = require('./helpers/client').Client

const USERS = harness.USERS
const PASSWORD = harness.PASSWORD
const withDb = harness.withDb

let server

beforeAll(async () => {
  server = await harness.startSoul()
})

afterAll(async () => {
  await server.stop()
})

const userRow = (username) =>
  withDb(server.dbPath, (db) =>
    db
      .prepare('SELECT id, is_superuser FROM _users WHERE username = ?')
      .get(username)
  )

let counter = 0
// the fields the app sends when an admin creates a user (UserForm)
const newUser = (key, extra) => {
  counter += 1
  const username = `it-created-${key}-${counter}`
  return {
    username,
    fields: {
      username,
      name: username,
      password: 'Cr3ate!Passw0rd#x',
      createdAt: new Date().toISOString(),
      createdBy: server.ids[key],
      departedDate: '2036-01-01T00:00:00.000Z',
      lockoutAttempts: 0,
      ...extra
    }
  }
}

const loggedIn = async (key) => {
  const c = new Client(server.baseUrl)
  await c.login(USERS[key].username, PASSWORD)
  return c
}

describe.each([
  ['rco-user', 'user'],
  ['rco-power-user', 'power']
])('an %s creating users', (_label, key) => {
  test('creates an ordinary user, as the app does', async () => {
    const c = await loggedIn(key)
    // the data provider sends booleans as 1/0
    const user = newUser(key, { is_superuser: 0 })
    const res = await c.post('/api/tables/_users/rows', {
      fields: user.fields
    })
    expect(res.status).toBe(201)
    expect(userRow(user.username).is_superuser).toBe(0)
  })

  test.each([[1], ['1'], ['true'], ['TRUE']])(
    'cannot create a superuser (is_superuser: %p)',
    async (value) => {
      const c = await loggedIn(key)
      const user = newUser(key, { is_superuser: value })
      const res = await c.post('/api/tables/_users/rows', {
        fields: user.fields
      })
      expect(res.status).toBeGreaterThanOrEqual(400)
      expect(userRow(user.username)).toBeUndefined()
    }
  )
})

test('an existing user can still be promoted, as the soul CLI does', () => {
  const id = server.ids.other
  withDb(server.dbPath, (db) =>
    db.prepare('UPDATE _users SET is_superuser = 1 WHERE id = ?').run(id)
  )
  expect(userRow(USERS.other.username).is_superuser).toBe(1)
  withDb(server.dbPath, (db) =>
    db.prepare('UPDATE _users SET is_superuser = 0 WHERE id = ?').run(id)
  )
})
