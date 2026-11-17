// RCO's password endpoints in _devExtensions, called through soul with real
// cookies and JWTs: admin reset, clearing password expiry, and self-service
// change with history checks.

const { startSoul, withDb, USERS, PASSWORD } = require('./helpers/soul-server')
const { Client } = require('./helpers/client')

let server

beforeAll(async () => {
  server = await startSoul()
})

afterAll(async () => {
  await server?.stop()
})

const loggedIn = async (key) => {
  const c = new Client(server.baseUrl)
  const res = await c.login(USERS[key].username)
  if (res.status !== 201)
    throw new Error(`login failed for ${key}: ${res.text}`)
  return c
}

const userRow = (id) =>
  withDb(server.dbPath, (db) =>
    db
      .prepare(
        'SELECT lockoutAttempts, updateBefore, lastUpdatedAt FROM _users WHERE id = ?'
      )
      .get(id)
  )

describe('admin password reset (/api/editpassword)', () => {
  const NEW_PASSWORD = 'Tz8!kQm4Wr2#'

  test('a power user can reset another user, who must then change it within an hour', async () => {
    const admin = await loggedIn('power')
    withDb(server.dbPath, (db) =>
      db
        .prepare('UPDATE _users SET lockoutAttempts = 5 WHERE id = ?')
        .run(server.ids.other)
    )
    const res = await admin.post('/api/editpassword', {
      fields: { userId: server.ids.other, newPassword: NEW_PASSWORD }
    })
    expect(res.status).toBe(201)

    const row = userRow(server.ids.other)
    expect(row.lockoutAttempts).toBe(0)
    const minutesLeft = (new Date(row.updateBefore) - Date.now()) / 60000
    expect(minutesLeft).toBeGreaterThan(55)
    expect(minutesLeft).toBeLessThanOrEqual(60)

    const login = await new Client(server.baseUrl).post('/api/login', {
      username: USERS.other.username,
      password: NEW_PASSWORD
    })
    expect(login.status).toBe(200)
  })

  test('the default role cannot reset passwords', async () => {
    const c = await loggedIn('default')
    const res = await c.post('/api/editpassword', {
      fields: { userId: server.ids.other, newPassword: NEW_PASSWORD }
    })
    expect(res.status).toBe(403)
  })

  test('users cannot reset their own password this way', async () => {
    const c = await loggedIn('user')
    const res = await c.post('/api/editpassword', {
      fields: { userId: server.ids.user, newPassword: NEW_PASSWORD }
    })
    expect(res.status).toBe(403)
  })

  test('unauthenticated callers are refused', async () => {
    const res = await new Client(server.baseUrl).post('/api/editpassword', {
      fields: { userId: server.ids.other, newPassword: NEW_PASSWORD }
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('No authentication token provided')
  })

  test('weak passwords are rejected', async () => {
    const admin = await loggedIn('power')
    const res = await admin.post('/api/editpassword', {
      fields: { userId: server.ids.other, newPassword: 'short' }
    })
    expect(res.status).toBe(400)
  })
})

describe('clearing password expiry (/api/update-before)', () => {
  const setDeadline = (id) =>
    withDb(server.dbPath, (db) =>
      db
        .prepare('UPDATE _users SET updateBefore = ? WHERE id = ?')
        .run('2999-01-01T00:00:00.000Z', id)
    )

  test('users can clear their own deadline', async () => {
    const c = await loggedIn('default')
    setDeadline(server.ids.default)
    const res = await c.post('/api/update-before', {
      data: { userId: server.ids.default }
    })
    expect(res.status).toBe(201)
    expect(userRow(server.ids.default).updateBefore).toBe('')
  })

  test("the default role cannot clear another user's deadline", async () => {
    const c = await loggedIn('default')
    setDeadline(server.ids.user)
    const res = await c.post('/api/update-before', {
      data: { userId: server.ids.user }
    })
    expect(res.status).toBe(403)
    expect(userRow(server.ids.user).updateBefore).not.toBe('')
  })

  test("an rco-user can clear another user's deadline", async () => {
    const c = await loggedIn('user')
    setDeadline(server.ids.default)
    const res = await c.post('/api/update-before', {
      data: { userId: server.ids.default }
    })
    expect(res.status).toBe(201)
  })
})

describe('self-service password change (/api/insert-password)', () => {
  test('changes the password when the current one is right, and blocks reuse', async () => {
    const c = await loggedIn('power')
    const id = server.ids.power
    const first = 'Hv3$pLx9Nd6@'

    const res = await c.post('/api/insert-password', {
      fields: { userId: id, currentPassword: PASSWORD, password: first }
    })
    expect(res.status).toBe(201)
    expect(userRow(id).lastUpdatedAt).toBeTruthy()

    const login = await new Client(server.baseUrl).post('/api/login', {
      username: USERS.power.username,
      password: first
    })
    expect(login.status).toBe(200)

    const second = 'Bq5%rTy7Jc1&'
    await c.post('/api/insert-password', {
      fields: { userId: id, currentPassword: first, password: second }
    })
    const reuse = await c.post('/api/insert-password', {
      fields: { userId: id, currentPassword: second, password: first }
    })
    expect(reuse.status).toBe(400)
    expect(reuse.body.message).toMatch(/last five passwords/)
  })

  test('rejects a wrong current password', async () => {
    const c = await loggedIn('user')
    const res = await c.post('/api/insert-password', {
      fields: {
        userId: server.ids.user,
        currentPassword: 'wrong',
        password: 'Tz8!kQm4Wr2#'
      }
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid current password')
  })

  const hashOf = (id) =>
    withDb(server.dbPath, (db) =>
      db.prepare('SELECT hashed_password FROM _users WHERE id = ?').get(id)
    ).hashed_password

  test('the forced-reset dialog can set a new password without the current one', async () => {
    // src/App.tsx sends only { userId, password } for the logged-in user
    const c = await loggedIn('default')
    const res = await c.post('/api/insert-password', {
      fields: { userId: server.ids.default, password: 'Tz8!kQm4Wr2#' }
    })
    expect(res.status).toBe(201)
  })

  test('requires a logged-in caller', async () => {
    const before = hashOf(server.ids.user)
    const res = await new Client(server.baseUrl).post('/api/insert-password', {
      fields: { userId: server.ids.user, password: 'Hv3$pLx9Nd6@' }
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('No authentication token provided')
    expect(hashOf(server.ids.user)).toBe(before)
  })

  test("refuses to change another user's password", async () => {
    const c = await loggedIn('user')
    const before = hashOf(server.ids.other)
    const res = await c.post('/api/insert-password', {
      fields: { userId: server.ids.other, password: 'Hv3$pLx9Nd6@' }
    })
    expect(res.status).toBe(403)
    expect(hashOf(server.ids.other)).toBe(before)
  })

  test('refuses a userId that is not the caller, whatever its form', async () => {
    const c = await loggedIn('user')
    const res = await c.post('/api/insert-password', {
      fields: { userId: `${server.ids.user}'`, password: 'Hv3$pLx9Nd6@' }
    })
    expect(res.status).toBe(403)
  })

  test('records the new password in the history table', async () => {
    const c = await loggedIn('user')
    const res = await c.post('/api/insert-password', {
      fields: {
        userId: server.ids.user,
        currentPassword: PASSWORD,
        password: 'Hv3$pLx9Nd6@'
      }
    })
    expect(res.status).toBe(201)
    const history = withDb(
      require('path').join(server.workDir, 'db', 'Security.sqlite'),
      (db) =>
        db
          .prepare('SELECT userId, password FROM passwords WHERE userId = ?')
          .all(server.ids.user)
    )
    expect(history).toHaveLength(1)
    expect(history[0].password).toMatch(/^\$2[aby]\$/)
  })
})
