// Roles and the permission matrix are read-only for every role
// (db/Scripts/migrations/2026-11-19-roles-tables-read-only.sql). Users'
// roles are set through /api/set-user-role (role-assignment.int.test.js).
const harness = require('./helpers/soul-server')
const Client = require('./helpers/client').Client

const USERS = harness.USERS
const PASSWORD = harness.PASSWORD
const withDb = harness.withDb

let server
let power

beforeAll(async () => {
  server = await harness.startSoul()
  power = new Client(server.baseUrl)
  await power.login(USERS.power.username, PASSWORD)
})

afterAll(async () => {
  await server.stop()
})

const one = (query, ...args) =>
  withDb(server.dbPath, (db) => db.prepare(query).get(...args))

describe('an rco-power-user', () => {
  test('can read roles and permissions (the app loads them at login)', async () => {
    expect((await power.get('/api/tables/_roles/rows')).status).toBe(200)
    expect(
      (await power.get('/api/tables/_roles_permissions/rows?_limit=5')).status
    ).toBe(200)
  })

  test('cannot change the permission matrix', async () => {
    const row = one(
      "SELECT id FROM _roles_permissions WHERE role_id = 2 AND table_name = 'item'"
    )
    const fields = {
      role_id: 2,
      table_name: 'item',
      create: 1,
      read: 1,
      update: 1,
      delete: 1
    }
    const put = await power.put(
      `/api/tables/_roles_permissions/rows/${row.id}`,
      {
        fields
      }
    )
    expect(put.status).toBe(403)
    const post = await power.post('/api/tables/_roles_permissions/rows', {
      fields: { ...fields, table_name: 'platform' }
    })
    expect(post.status).toBe(403)
    expect(
      one('SELECT "delete" AS d FROM _roles_permissions WHERE id = ?', row.id).d
    ).toBe(0)
  })

  test('cannot create or rename roles', async () => {
    expect(
      (
        await power.post('/api/tables/_roles/rows', {
          fields: { name: 'it-role' }
        })
      ).status
    ).toBe(403)
    const role = one("SELECT id FROM _roles WHERE name = 'rco-user'")
    expect(
      (
        await power.put(`/api/tables/_roles/rows/${role.id}`, {
          fields: { name: 'renamed' }
        })
      ).status
    ).toBe(403)
  })

  test("can set a user's role, through the endpoint only", async () => {
    const direct = await power.post('/api/tables/_users_roles/rows', {
      fields: { user_id: server.ids.noRole, role_id: 2 }
    })
    expect(direct.status).toBe(403)
    const res = await power.post('/api/set-user-role', {
      fields: { userId: server.ids.noRole, roleId: 2 }
    })
    expect(res.status).toBe(200)
    expect(
      one(
        'SELECT role_id FROM _users_roles WHERE user_id = ?',
        server.ids.noRole
      ).role_id
    ).toBe(2)
  })
})
