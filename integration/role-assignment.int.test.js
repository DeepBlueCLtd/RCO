// Setting users' roles (/api/set-user-role): a user may assign roles up to
// their own level, and only to users at or below their own level. Direct
// writes to _users_roles are refused for every role
// (db/Scripts/migrations/2026-11-20-role-assignment-endpoint.sql).
const harness = require('./helpers/soul-server')
const Client = require('./helpers/client').Client

const USERS = harness.USERS
const PASSWORD = harness.PASSWORD
const ROLES = harness.ROLES
const withDb = harness.withDb

let server

beforeAll(async () => {
  server = await harness.startSoul()
})

afterAll(async () => {
  await server.stop()
})

const roleOf = (userId) =>
  withDb(server.dbPath, (db) =>
    db.prepare('SELECT role_id FROM _users_roles WHERE user_id = ?').get(userId)
  )?.role_id

const resetRole = (userId, roleId) =>
  withDb(server.dbPath, (db) => {
    db.prepare('DELETE FROM _users_roles WHERE user_id = ?').run(userId)
    if (roleId) {
      db.prepare(
        'INSERT INTO _users_roles (user_id, role_id) VALUES (?, ?)'
      ).run(userId, roleId)
    }
  })

const loggedIn = async (key) => {
  const c = new Client(server.baseUrl)
  await c.login(USERS[key].username, PASSWORD)
  return c
}

const setRole = (client, key, roleId) =>
  client.post('/api/set-user-role', {
    fields: { userId: server.ids[key], roleId }
  })

beforeEach(() => {
  resetRole(server.ids.noRole, null)
  resetRole(server.ids.other, ROLES.RCO_USER)
  resetRole(server.ids.power, ROLES.RCO_POWER_USER)
})

describe('assigning roles', () => {
  test.each([
    ['user', ROLES.DEFAULT, 200],
    ['user', ROLES.RCO_USER, 200],
    ['user', ROLES.RCO_POWER_USER, 403],
    ['power', ROLES.RCO_POWER_USER, 200],
    ['superuser', ROLES.RCO_POWER_USER, 200]
  ])('%s assigning role %i: %i', async (key, roleId, status) => {
    const c = await loggedIn(key)
    const res = await setRole(c, 'noRole', roleId)
    expect(res.status).toBe(status)
    expect(roleOf(server.ids.noRole)).toBe(status === 200 ? roleId : undefined)
  })

  test('a user with no write role cannot assign roles', async () => {
    const c = await loggedIn('default')
    expect((await setRole(c, 'noRole', ROLES.DEFAULT)).status).toBe(403)
    expect(roleOf(server.ids.noRole)).toBeUndefined()
  })

  test('updates an existing role rather than adding another', async () => {
    const c = await loggedIn('user')
    expect((await setRole(c, 'other', ROLES.DEFAULT)).status).toBe(200)
    const count = withDb(server.dbPath, (db) =>
      db
        .prepare('SELECT COUNT(*) AS n FROM _users_roles WHERE user_id = ?')
        .get(server.ids.other)
    ).n
    expect(count).toBe(1)
    expect(roleOf(server.ids.other)).toBe(ROLES.DEFAULT)
  })

  test('refuses unknown roles and users', async () => {
    const c = await loggedIn('power')
    expect((await setRole(c, 'noRole', 99)).status).toBe(400)
    const missing = await c.post('/api/set-user-role', {
      fields: { userId: 999999, roleId: ROLES.DEFAULT }
    })
    expect(missing.status).toBe(404)
  })

  test('needs a logged-in caller', async () => {
    const anon = new Client(server.baseUrl)
    expect((await setRole(anon, 'noRole', ROLES.DEFAULT)).status).toBe(401)
  })
})

describe('users above your own level', () => {
  test('an rco-user cannot change a power user', async () => {
    const c = await loggedIn('user')
    expect((await setRole(c, 'power', ROLES.DEFAULT)).status).toBe(403)
    expect(roleOf(server.ids.power)).toBe(ROLES.RCO_POWER_USER)
  })

  test('a power user cannot change a superuser', async () => {
    const c = await loggedIn('power')
    expect((await setRole(c, 'superuser', ROLES.DEFAULT)).status).toBe(403)
    expect(roleOf(server.ids.superuser)).toBeUndefined()
  })

  test('a power user can change another power user', async () => {
    const c = await loggedIn('power')
    resetRole(server.ids.other, ROLES.RCO_POWER_USER)
    expect((await setRole(c, 'other', ROLES.RCO_USER)).status).toBe(200)
    expect(roleOf(server.ids.other)).toBe(ROLES.RCO_USER)
  })
})

describe.each(['user', 'power'])('direct writes to _users_roles by %s', (key) => {
  test('are refused', async () => {
    const c = await loggedIn(key)
    const post = await c.post('/api/tables/_users_roles/rows', {
      fields: { user_id: server.ids.noRole, role_id: ROLES.DEFAULT }
    })
    expect(post.status).toBe(403)
    resetRole(server.ids.noRole, ROLES.DEFAULT)
    const row = withDb(server.dbPath, (db) =>
      db
        .prepare('SELECT id FROM _users_roles WHERE user_id = ?')
        .get(server.ids.noRole)
    )
    const put = await c.put(`/api/tables/_users_roles/rows/${row.id}`, {
      fields: { role_id: ROLES.RCO_POWER_USER }
    })
    expect(put.status).toBe(403)
    expect(roleOf(server.ids.noRole)).toBe(ROLES.DEFAULT)
  })
})

describe('auditing', () => {
  const audits = (userId) =>
    withDb(server.dbPath, (db) =>
      db
        .prepare(
          "SELECT * FROM audit WHERE activityType = 'ROLE_CHANGED' AND dataId = ? ORDER BY id"
        )
        .all(userId)
    )

  test('records who changed which role, from what to what', async () => {
    const c = await loggedIn('power')
    const before = audits(server.ids.other).length
    expect((await setRole(c, 'other', ROLES.RCO_POWER_USER)).status).toBe(200)
    const added = audits(server.ids.other).slice(before)
    expect(added).toHaveLength(1)
    expect(added[0]).toMatchObject({
      user: server.ids.power,
      resource: '_users',
      label: 'ROLE_CHANGED',
      activityDetail: 'Role changed from rco-user to rco-power-user',
      securityRelated: 1
    })
  })

  test('records a first role as changed from none', async () => {
    const c = await loggedIn('user')
    expect((await setRole(c, 'noRole', ROLES.DEFAULT)).status).toBe(200)
    expect(audits(server.ids.noRole).at(-1).activityDetail).toBe(
      'Role changed from none to default'
    )
  })

  test('records nothing for refused or unchanged roles', async () => {
    const c = await loggedIn('user')
    const before = audits(server.ids.power).length
    expect((await setRole(c, 'power', ROLES.DEFAULT)).status).toBe(403)
    const unchanged = audits(server.ids.other).length
    expect((await setRole(c, 'other', ROLES.RCO_USER)).status).toBe(200)
    expect(audits(server.ids.power)).toHaveLength(before)
    expect(audits(server.ids.other)).toHaveLength(unchanged)
  })
})
