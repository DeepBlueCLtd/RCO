// Login, tokens, refresh, logout and expiry against a real soul-cli server.

const jwt = require('jsonwebtoken')
const {
  startSoul,
  withDb,
  USERS,
  PASSWORD,
  TOKEN_SECRET
} = require('./helpers/soul-server')
const { Client } = require('./helpers/client')

let server

beforeAll(async () => {
  server = await startSoul()
})

afterAll(async () => {
  await server?.stop()
})

const client = () => new Client(server.baseUrl)
const lockoutAttempts = (username) =>
  withDb(server.dbPath, (db) =>
    db
      .prepare('SELECT lockoutAttempts FROM _users WHERE username = ?')
      .get(username)
  ).lockoutAttempts

describe('RCO login check (/api/login)', () => {
  test('accepts valid credentials and returns the user without its hash', async () => {
    const res = await client().post('/api/login', {
      username: USERS.user.username,
      password: PASSWORD
    })
    expect(res.status).toBe(200)
    expect(res.body.data.username).toBe(USERS.user.username)
    expect(res.body.data.hashed_password).toBeUndefined()
  })

  test('rejects a missing username or password', async () => {
    const res = await client().post('/api/login', {
      username: USERS.user.username
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('password and username is required')
  })

  test('rejects an unknown user', async () => {
    const res = await client().post('/api/login', {
      username: 'nobody',
      password: PASSWORD
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('User not found')
  })

  test('rejects a departed user', async () => {
    const res = await client().post('/api/login', {
      username: USERS.departed.username,
      password: PASSWORD
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('User has departed organisation')
  })

  test('rejects a user whose password update is overdue', async () => {
    const res = await client().post('/api/login', {
      username: USERS.overdue.username,
      password: PASSWORD
    })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/not updated the password/)
  })

  test('counts failed attempts, resets on success, and locks after 5 failures', async () => {
    const { username } = USERS.other
    const c = client()

    await c.post('/api/login', { username, password: 'wrong' })
    expect(lockoutAttempts(username)).toBe(1)

    expect(
      (await c.post('/api/login', { username, password: PASSWORD })).status
    ).toBe(200)
    expect(lockoutAttempts(username)).toBe(0)

    for (let i = 0; i < 5; i++) {
      const res = await c.post('/api/login', { username, password: 'wrong' })
      expect(res.body.message).toBe('Invalid password')
    }
    const locked = await c.post('/api/login', { username, password: PASSWORD })
    expect(locked.status).toBe(400)
    expect(locked.body.message).toMatch(/account is locked/)
  })
})

describe('token obtain (/api/auth/token/obtain)', () => {
  test('sets HttpOnly access and refresh cookies carrying the user and roles', async () => {
    const c = client()
    const res = await c.post('/api/auth/token/obtain', {
      fields: { username: USERS.user.username, password: PASSWORD }
    })
    expect(res.status).toBe(201)
    expect(res.body.data.userId).toBe(server.ids.user)

    const names = res.setCookies.map((ck) => ck.name).sort()
    expect(names).toEqual(['accessToken', 'refreshToken'])
    for (const ck of res.setCookies) expect(ck.attrs).toContain('httponly')

    const payload = c.tokenPayload()
    expect(payload).toMatchObject({
      subject: 'accessToken',
      userId: server.ids.user,
      username: USERS.user.username,
      roleIds: [USERS.user.role]
    })
    // 15 minute access token, as configured by `yarn serve`
    expect(payload.exp - payload.iat).toBe(15 * 60)
    expect(
      c.tokenPayload('refreshToken').exp - c.tokenPayload('refreshToken').iat
    ).toBe(60 * 60)
  })

  test('marks a superuser token and omits roles', async () => {
    const c = client()
    await c.post('/api/auth/token/obtain', {
      fields: { username: USERS.superuser.username, password: PASSWORD }
    })
    expect(c.tokenPayload()).toMatchObject({
      userId: server.ids.superuser,
      isSuperuser: 1
    })
    expect(c.tokenPayload().roleIds).toBeUndefined()
  })

  test('rejects a wrong password', async () => {
    const res = await client().post('/api/auth/token/obtain', {
      fields: { username: USERS.user.username, password: 'wrong' }
    })
    expect(res.status).toBe(401)
  })

  test('rejects a non-superuser with no role', async () => {
    const res = await client().post('/api/auth/token/obtain', {
      fields: { username: USERS.noRole.username, password: PASSWORD }
    })
    expect(res.status).toBe(401)
  })
})

describe('access token checks on /api/tables', () => {
  test('rejects requests without a token', async () => {
    const res = await client().get('/api/tables/item/rows')
    expect(res.status).toBe(401)
  })

  test('allows requests after the frontend login flow', async () => {
    const c = client()
    await c.login(USERS.user.username)
    expect((await c.get('/api/tables/item/rows')).status).toBe(200)
  })

  test('rejects a token signed with another secret', async () => {
    const c = client()
    c.cookies.accessToken = jwt.sign(
      { subject: 'accessToken', userId: server.ids.user, isSuperuser: 1 },
      'some-other-secret',
      { expiresIn: '15m' }
    )
    expect((await c.get('/api/tables/item/rows')).status).toBe(401)
  })

  test('rejects an expired token', async () => {
    const c = client()
    c.cookies.accessToken = jwt.sign(
      {
        subject: 'accessToken',
        userId: server.ids.user,
        roleIds: [2],
        isSuperuser: 0
      },
      TOKEN_SECRET,
      { expiresIn: -10 }
    )
    expect((await c.get('/api/tables/item/rows')).status).toBe(401)
  })
})

describe('refresh and logout', () => {
  test('refresh issues a new working access token', async () => {
    const c = client()
    await c.login(USERS.user.username)
    delete c.cookies.accessToken

    const res = await c.get('/api/auth/token/refresh')
    expect(res.status).toBe(200)
    expect(c.cookies.accessToken).toBeDefined()
    expect((await c.get('/api/tables/item/rows')).status).toBe(200)
  })

  test('refresh fails without a refresh token', async () => {
    // soul's request validator rejects the missing cookie before the controller
    expect((await client().get('/api/auth/token/refresh')).status).toBe(400)
  })

  test('refresh fails with a tampered refresh token', async () => {
    const c = client()
    c.cookies.refreshToken = jwt.sign(
      { subject: 'refreshToken', userId: server.ids.user },
      'some-other-secret',
      { expiresIn: '60m' }
    )
    expect((await c.get('/api/auth/token/refresh')).status).toBe(403)
  })

  test('refresh picks up a role change made after login', async () => {
    const c = client()
    await c.login(USERS.power.username)
    withDb(server.dbPath, (db) =>
      db
        .prepare('UPDATE _users_roles SET role_id = 1 WHERE user_id = ?')
        .run(server.ids.power)
    )
    await c.get('/api/auth/token/refresh')
    expect(c.tokenPayload().roleIds).toEqual([1])
    withDb(server.dbPath, (db) =>
      db
        .prepare('UPDATE _users_roles SET role_id = 3 WHERE user_id = ?')
        .run(server.ids.power)
    )
  })

  test('logout clears the cookies and revokes the refresh token', async () => {
    const c = client()
    await c.login(USERS.user.username)
    const refreshToken = c.cookies.refreshToken

    const res = await c.get('/api/auth/logout')
    expect(res.status).toBe(200)
    expect(c.cookies.accessToken).toBeUndefined()
    expect(c.cookies.refreshToken).toBeUndefined()

    // replaying the old refresh token is refused
    c.cookies.refreshToken = refreshToken
    expect((await c.get('/api/auth/token/refresh')).status).toBe(403)
  })
})
