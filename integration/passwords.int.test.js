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

describe('admin reset to a temporary password, end to end', () => {
  // The flow a locked-out user goes through:
  // 1. an admin sets a temporary password (UserShow.tsx -> /api/editpassword)
  // 2. the user logs in with it and sees the "update your password" banner
  //    (Welcome.tsx, shown while updateBefore is set)
  // 3. the user changes it via Change Password (ChangePassword.tsx), which
  //    sends the temporary password as the current one, then clears the
  //    deadline (/api/insert-password, then /api/update-before)
  const TEMP = 'Tz8!kQm4Wr2#'
  const CHOSEN = 'Hv3$pLx9Nd6@'
  const anon = () => new Client(server.baseUrl)

  test('locked-out user gets a temporary password and replaces it', async () => {
    const username = USERS.resetA.username
    const id = server.ids.resetA

    // the user locks themselves out
    for (let i = 0; i < 5; i++) {
      await anon().post('/api/login', { username, password: 'wrong' })
    }
    const locked = await anon().post('/api/login', {
      username,
      password: PASSWORD
    })
    expect(locked.body.message).toMatch(/account is locked/)

    // 1. admin resets to a temporary password
    const admin = await loggedIn('resetAdmin')
    const reset = await admin.post('/api/editpassword', {
      fields: { userId: id, newPassword: TEMP }
    })
    expect(reset.status).toBe(201)

    // the old password no longer works
    const old = await anon().post('/api/login', {
      username,
      password: PASSWORD
    })
    expect(old.status).toBe(400)
    expect(old.body.message).toBe('Invalid password')

    // 2. the user logs in with the temporary password; updateBefore is set,
    //    which is what shows the banner
    const user = new Client(server.baseUrl)
    const check = await user.post('/api/login', { username, password: TEMP })
    expect(check.status).toBe(200)
    expect(check.body.data.updateBefore).toBeTruthy()
    const token = await user.post('/api/auth/token/obtain', {
      fields: { username, password: TEMP }
    })
    expect(token.status).toBe(201)

    // 3. the user chooses their own password, then clears the deadline
    const change = await user.post('/api/insert-password', {
      fields: { userId: id, currentPassword: TEMP, password: CHOSEN }
    })
    expect(change.status).toBe(201)
    const clear = await user.post('/api/update-before', {
      data: { userId: id }
    })
    expect(clear.status).toBe(201)
    expect(clear.body.userDetails.updateBefore).toBe('')

    // the temporary password is dead; the chosen one works, with no deadline
    const tempAgain = await anon().post('/api/login', {
      username,
      password: TEMP
    })
    expect(tempAgain.status).toBe(400)
    const chosen = await anon().post('/api/login', {
      username,
      password: CHOSEN
    })
    expect(chosen.status).toBe(200)
    expect(chosen.body.data.updateBefore).toBe('')
    // (the reply shows the counter as it was before this login reset it)
    expect(userRow(id).lockoutAttempts).toBe(0)
  })

  test('a temporary password stops working once its deadline passes', async () => {
    const username = USERS.resetB.username
    const id = server.ids.resetB
    const admin = await loggedIn('resetAdmin')

    await admin.post('/api/editpassword', {
      fields: { userId: id, newPassword: TEMP }
    })
    // simulate the hour passing without the user changing it
    withDb(server.dbPath, (db) =>
      db
        .prepare('UPDATE _users SET updateBefore = ? WHERE id = ?')
        .run(new Date(Date.now() - 60000).toISOString(), id)
    )
    const late = await anon().post('/api/login', { username, password: TEMP })
    expect(late.status).toBe(400)
    expect(late.body.message).toMatch(/not updated the password/)

    // a fresh reset gives a new hour
    const again = await admin.post('/api/editpassword', {
      fields: { userId: id, newPassword: TEMP }
    })
    expect(again.status).toBe(201)
    const ok = await anon().post('/api/login', { username, password: TEMP })
    expect(ok.status).toBe(200)
  })
})
