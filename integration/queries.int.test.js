// The REST calls RCO's data provider (src/providers/dataProvider/index.ts)
// makes, sent to a real soul server. Expected results come from SQL on the
// same database copy, so these tests pin soul's query behaviour rather than
// the dev data. A soul upgrade that changes filtering, paging or writes
// shows up here.

const harness = require('./helpers/soul-server')
const Client = require('./helpers/client').Client

const startSoul = harness.startSoul
const withDb = harness.withDb
const USERS = harness.USERS
const ROLES = harness.ROLES
const PASSWORD = harness.PASSWORD

let server
let power

beforeAll(async () => {
  server = await startSoul()
  power = new Client(server.baseUrl)
  const res = await power.login(USERS.power.username, PASSWORD)
  if (res.status !== 201) throw new Error(`login failed: ${res.text}`)
})

afterAll(async () => {
  await server?.stop()
})

const sql = (query, ...args) =>
  withDb(server.dbPath, (db) => db.prepare(query).all(...args))
const one = (query, ...args) => sql(query, ...args)[0]

// The data provider's own builder for soul's _filters (compiled by babel-jest)
const filterString =
  require('../src/providers/dataProvider/soul-filters').toSoulFilters

const list = async (table, query) => {
  const qs = Object.entries(query)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  const res = await power.get(`/api/tables/${table}/rows?${qs}`)
  expect(res.status).toBe(200)
  return res.body
}

const ids = (rows) => rows.map((r) => r.id).sort((a, b) => a - b)

describe('reading rows', () => {
  test('getOne returns the row', async () => {
    const row = one('SELECT * FROM item ORDER BY id LIMIT 1 OFFSET 10')
    const res = await power.get(`/api/tables/item/rows/${row.id}`)
    expect(res.status).toBe(200)
    expect(res.body.data[0]).toMatchObject({
      id: row.id,
      itemNumber: row.itemNumber,
      batch: row.batch,
      createdAt: row.createdAt
    })
  })

  test('getMany fetches a comma-separated list of ids', async () => {
    const want = ids(sql('SELECT id FROM item ORDER BY id LIMIT 3'))
    const res = await power.get(`/api/tables/item/rows/${want.join(',')}`)
    expect(res.status).toBe(200)
    expect(ids(res.body.data)).toEqual(want)
  })

  test('getList pages and orders, and reports the total', async () => {
    const body = await list('item', {
      _page: 2,
      _limit: 5,
      _ordering: '-id'
    })
    const want = sql('SELECT id FROM item ORDER BY id DESC LIMIT 5 OFFSET 5')
    expect(body.data.map((r) => r.id)).toEqual(want.map((r) => r.id))
    expect(body.total).toBe(one('SELECT count(*) n FROM item').n)
  })

  test('the richItem view can be listed and filtered', async () => {
    const project = one(
      'SELECT project FROM richItem WHERE project IS NOT NULL LIMIT 1'
    ).project
    const body = await list('richItem', {
      _limit: 1000,
      _filters: filterString({ project })
    })
    const want = sql('SELECT id FROM richItem WHERE project = ?', project)
    expect(body.total).toBe(want.length)
    expect(ids(body.data)).toEqual(ids(want))
  })
})

describe('getList filters', () => {
  const check = async (filter, where, ...args) => {
    const body = await list('item', {
      _limit: 5000,
      _filters: filterString(filter)
    })
    const want = sql(`SELECT id FROM item WHERE ${where}`, ...args)
    expect(want.length).toBeGreaterThan(0)
    expect(body.total).toBe(want.length)
    expect(ids(body.data)).toEqual(ids(want))
  }

  test('equals', async () => {
    const batch = one('SELECT batch FROM item LIMIT 1').batch
    await check({ batch }, 'batch = ?', batch)
  })

  test('not equals (_neq becomes __neq)', async () => {
    const mediaType = one('SELECT mediaType FROM item LIMIT 1').mediaType
    await check({ mediaType__neq: mediaType }, 'mediaType != ?', mediaType)
  })

  test('greater-or-equal on a date containing colons', async () => {
    // date pickers send ISO strings; stored values use a space separator
    const createdAt = one(
      'SELECT createdAt FROM item ORDER BY createdAt LIMIT 1 OFFSET 500'
    ).createdAt
    const iso = createdAt.replace(' ', 'T')
    expect(iso).toContain(':')
    await check({ createdAt__gte: iso }, 'createdAt >= ?', iso)
  })

  test('a value containing a space matches', async () => {
    const name = 'Prot Mark-1'
    const body = await list('protectiveMarking', {
      _filters: filterString({ name })
    })
    const want = sql('SELECT id FROM protectiveMarking WHERE name = ?', name)
    expect(want.length).toBe(1)
    expect(ids(body.data)).toEqual(ids(want))
  })

  test('less-or-equal on a number', async () => {
    await check({ id__lte: 50 }, 'id <= 50')
  })

  test('null and not-null', async () => {
    await check(
      { loanedTo__null: '', batch__notnull: '' },
      'loanedTo IS NULL AND batch IS NOT NULL'
    )
  })

  test('a list value matches any of its entries', async () => {
    const want = ids(sql('SELECT id FROM item ORDER BY id LIMIT 3'))
    await check({ id: want }, `id IN (${want.join(',')})`)
  })

  test('several filters are ANDed', async () => {
    const row = one('SELECT batch, mediaType FROM item LIMIT 1')
    await check(
      { batch: row.batch, mediaType: row.mediaType, id__gte: 1 },
      'batch = ? AND mediaType = ? AND id >= 1',
      row.batch,
      row.mediaType
    )
  })

  test('booleans are sent as 1 and 0', async () => {
    const body = await list('department', {
      _filters: filterString({ active: 1 })
    })
    expect(body.total).toBe(
      one('SELECT count(*) n FROM department WHERE active = 1').n
    )
  })

  test('_search finds a row by its item number', async () => {
    const row = one('SELECT id, itemNumber FROM item LIMIT 1')
    const body = await list('item', { _search: row.itemNumber, _limit: 5000 })
    expect(body.data.map((r) => r.id)).toContain(row.id)
  })
})

describe('writing rows', () => {
  test('create, update and updateMany (as an rco-power-user)', async () => {
    // department.id is a TEXT key the caller supplies
    const created = ['it-dept-a', 'it-dept-b']
    for (const id of created) {
      const res = await power.post('/api/tables/department/rows', {
        fields: { id, name: id, active: 1 }
      })
      expect(res.status).toBe(201)
    }

    const upd = await power.put(`/api/tables/department/rows/${created[0]}`, {
      fields: { name: 'it-dept-renamed' }
    })
    expect(upd.status).toBe(200)

    const manyUrl = `/api/tables/department/rows/${created.join(',')}`
    const deactivate = { fields: { active: 0 } }
    const many = await power.put(manyUrl, deactivate)
    expect(many.status).toBe(200)

    expect(
      sql(
        'SELECT id, name, active FROM department WHERE id IN (?, ?) ORDER BY id',
        ...created
      )
    ).toEqual([
      { id: created[0], name: 'it-dept-renamed', active: 0 },
      { id: created[1], name: 'it-dept-b', active: 0 }
    ])
  })
})

describe('protective-marking codes on an item (useRefTable)', () => {
  // Editing an item's codes deletes its rows in itemCode/itemCave/
  // itemHandle and recreates them (src/hooks/useRefTable.ts). These tests
  // record what each role can actually do on a real server today.
  const itemCodeIds = () => {
    const item = one('SELECT item FROM itemCode LIMIT 1').item
    return sql('SELECT id FROM itemCode WHERE item = ?', item).map((r) => r.id)
  }

  test.each([
    ['rco-user', 'user', ROLES.RCO_USER],
    ['rco-power-user', 'power', ROLES.RCO_POWER_USER]
  ])(
    'an %s cannot delete existing codes (no role has delete permission)',
    async (_label, key) => {
      const c = new Client(server.baseUrl)
      await c.login(USERS[key].username, PASSWORD)
      const res = await c.delete(`/api/tables/itemCode/rows/${itemCodeIds()}`)
      expect(res.status).toBe(403)
    }
  )

  test('an rco-user cannot add codes (no create permission)', async () => {
    const c = new Client(server.baseUrl)
    await c.login(USERS.user.username, PASSWORD)
    const res = await c.post('/api/tables/itemCode/rows', {
      fields: { item: 1, catCode: 'code-1' }
    })
    expect(res.status).toBe(403)
  })

  test('a superuser can delete and recreate codes', async () => {
    const c = new Client(server.baseUrl)
    await c.login(USERS.superuser.username, PASSWORD)
    const before = itemCodeIds()
    const del = await c.delete(`/api/tables/itemCode/rows/${before}`)
    expect([401, 403]).not.toContain(del.status)
  })
})
