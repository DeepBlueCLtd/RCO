// Per-role table permissions, enforced by soul from _roles_permissions.
//
// For every role and every table it has a permissions row for, each verb must
// be refused (403) exactly when the matrix says so. The matrix is read from the
// database copy, so this pins soul's enforcement, not the matrix's contents.
// The matrix's contents are pinned separately, by a snapshot.

const { startSoul, withDb, USERS } = require('./helpers/soul-server')
const { Client } = require('./helpers/client')

let server
const sessions = {}

const ROLE_USERS = { 1: 'default', 2: 'user', 3: 'power' }

// verb -> the request that exercises it, and the matrix column that governs it
const VERBS = {
  read: (c, t) => c.get(`/api/tables/${t}/rows?_limit=1`),
  create: (c, t) => c.post(`/api/tables/${t}/rows`, { fields: {} }),
  update: (c, t) => c.put(`/api/tables/${t}/rows/999999999`, { fields: {} }),
  delete: (c, t) => c.delete(`/api/tables/${t}/rows/999999999`)
}

let matrix

beforeAll(async () => {
  server = await startSoul()
  matrix = withDb(server.dbPath, (db) =>
    db
      .prepare(
        `SELECT role_id, table_name, "create", read, "update", "delete"
         FROM _roles_permissions ORDER BY role_id, table_name`
      )
      .all()
  )
  for (const key of [...Object.values(ROLE_USERS), 'superuser']) {
    sessions[key] = new Client(server.baseUrl)
    const res = await sessions[key].login(USERS[key].username)
    if (res.status !== 201)
      throw new Error(`login failed for ${key}: ${res.text}`)
  }
})

afterAll(async () => {
  await server?.stop()
})

test('the permissions matrix matches the reviewed snapshot', () => {
  const compact = {}
  for (const row of matrix) {
    const flags = ['create', 'read', 'update', 'delete']
      .map((v) => (row[v] ? v[0].toUpperCase() : '-'))
      .join('')
    ;(compact[row.role_id] ??= {})[row.table_name] = flags
  }
  expect(compact).toMatchSnapshot()
})

test.each(Object.entries(ROLE_USERS))(
  'soul enforces every matrix entry for role %s (%s)',
  async (roleId, userKey) => {
    const rows = matrix.filter((r) => r.role_id === Number(roleId))
    expect(rows.length).toBeGreaterThan(0)
    const mismatches = []
    for (const row of rows) {
      for (const [verb, send] of Object.entries(VERBS)) {
        const res = await send(sessions[userKey], row.table_name)
        const refused = res.status === 403
        const allowed = Boolean(row[verb])
        if (allowed === refused || res.status === 401) {
          mismatches.push(
            `${row.table_name} ${verb}: matrix=${
              allowed ? 'allow' : 'deny'
            } got ${res.status}`
          )
        }
      }
    }
    expect(mismatches).toEqual([])
  }
)

test('a table with no permissions row is refused for non-superusers', async () => {
  // `sqlite_sequence` has a row for role 1 only
  const res = await sessions.power.get('/api/tables/sqlite_sequence/rows')
  expect(res.status).toBe(403)
})

test('a superuser can read and write every table', async () => {
  const s = sessions.superuser
  expect(
    (await s.get('/api/tables/_roles_permissions/rows?_limit=1')).status
  ).toBe(200)
  const del = await s.delete('/api/tables/item/rows/999999999')
  expect([401, 403]).not.toContain(del.status)
})
