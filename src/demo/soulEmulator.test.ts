/**
 * @jest-environment node
 */
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import initSqlJs, { type Database } from 'sql.js'
import { getErrorDetails } from '../utils/helper'
import { DEMO_PASSWORD, DEMO_USERS } from './credentials'
import { demoAdapter } from '.'
import { seedDemoUsers } from './seed'
import { createSoulEmulator, type EmulatorResponse } from './soulEmulator'

const Q = '\u0027'
const ROOT = path.join(__dirname, '..', '..')

let db: Database
let handle: ReturnType<typeof createSoulEmulator>

const call = (method: string, url: string, body?: unknown): EmulatorResponse =>
  handle({ method, url, body })

const loginAs = (username: string, password = DEMO_PASSWORD): void => {
  expect(call('POST', '/api/login', { username, password }).status).toBe(200)
  expect(
    call('POST', '/api/auth/token/obtain', { fields: { username, password } })
      .status
  ).toBe(201)
}

beforeEach(async () => {
  const SQL = await initSqlJs()
  db = new SQL.Database(fs.readFileSync(path.join(ROOT, 'db', 'RCO2.sqlite')))
  seedDemoUsers(db)
  handle = createSoulEmulator(db)
})

afterEach(() => {
  db.close()
})

describe('demo accounts', () => {
  it.each(DEMO_USERS.map((u) => u.username))('%s can log in', (username) => {
    loginAs(username)
    const res = call(
      'GET',
      `/api/tables/_users/rows?_filters=username:${username}`
    )
    expect(res.status).toBe(200)
    expect(res.data.data[0].username).toBe(username)
  })

  it('are published on the landing page and in preview comments', () => {
    const page = fs.readFileSync(path.join(ROOT, 'pages', 'index.html'), 'utf8')
    expect(page).toContain(DEMO_PASSWORD)
    const workflow = fs.readFileSync(
      path.join(ROOT, '.github', 'workflows', 'pr-preview.yml'),
      'utf8'
    )
    expect(workflow).toContain(DEMO_PASSWORD)
    DEMO_USERS.forEach((u) => {
      expect(page).toContain(`>${u.username}<`)
    })
  })
})

describe('auth', () => {
  it('rejects table requests before login, as soul does with auth on', () => {
    expect(call('GET', '/api/tables/item/rows').status).toBe(401)
  })

  it('counts failed logins and clears the count on success', () => {
    const res = call('POST', '/api/login', { username: 'demo', password: 'x' })
    expect(res).toEqual({ status: 400, data: { message: 'Invalid password' } })
    loginAs('demo')
    const user = call('GET', '/api/tables/_users/rows?_filters=username:demo')
    expect(user.data.data[0].lockoutAttempts).toBe(0)
  })

  it('applies role permissions', () => {
    loginAs('demo-viewer')
    expect(call('GET', '/api/tables/item/rows').status).toBe(200)
    expect(
      call('PUT', '/api/tables/item/rows/1', { fields: { remarks: 'x' } })
    ).toEqual({ status: 403, data: { message: 'Not authorized' } })
  })

  it('never returns password hashes', () => {
    loginAs('demo')
    const res = call('GET', '/api/tables/_users/rows?_limit=100')
    expect(res.data.data.length).toBeGreaterThan(0)
    res.data.data.forEach((row: any) => {
      expect(row).not.toHaveProperty('hashed_password')
    })
  })

  it('logs out', () => {
    loginAs('demo')
    call('GET', '/api/auth/logout')
    expect(call('GET', '/api/tables/item/rows').status).toBe(401)
  })
})

describe('rows API', () => {
  beforeEach(() => {
    loginAs('demo')
  })

  it('lists with filters, ordering and paging', () => {
    const res = call(
      'GET',
      '/api/tables/item/rows?_page=2&_limit=5&_ordering=-id&_filters=loanedTo__null:'
    )
    expect(res.status).toBe(200)
    expect(res.data.data).toHaveLength(5)
    const expectedTotal = db.exec(
      'SELECT COUNT(*) FROM item WHERE loanedTo IS NULL'
    )[0].values[0][0]
    expect(res.data.total).toBe(expectedTotal)
    const ids = res.data.data.map((r: any) => r.id)
    expect(ids).toEqual([...ids].sort((a, b) => b - a))
  })

  it('filters by a list of values', () => {
    const res = call('GET', '/api/tables/item/rows?_filters=id:[1,2,3]')
    expect(res.data.data.map((r: any) => r.id)).toEqual([1, 2, 3])
  })

  it('queries views', () => {
    expect(call('GET', '/api/tables/richItem/rows?_limit=1').status).toBe(200)
  })

  it('rejects unknown operators', () => {
    expect(
      call('GET', '/api/tables/item/rows?_filters=id__like:1').status
    ).toBe(400)
  })

  it('gets rows by primary key, and 404s when none match', () => {
    const res = call('GET', '/api/tables/item/rows/1,2')
    expect(res.data.data.map((r: any) => r.id)).toEqual([1, 2])
    expect(call('GET', '/api/tables/item/rows/999999').status).toBe(404)
  })

  it('inserts, updates and deletes as the role permissions allow', () => {
    const created = call('POST', '/api/tables/itemCode/rows', {
      fields: { item: 1, catCode: 1, extra: null }
    })
    expect(created.status).toBe(201)
    const id = created.data.data.lastInsertRowid
    expect(id).toBeGreaterThan(0)

    const updated = call('PUT', '/api/tables/item/rows/1', {
      // the data provider doubles quotes (sanitizeCode) for soul's raw SQL
      fields: { remarks: `it${Q}${Q}s here` }
    })
    expect(updated.status).toBe(200)
    expect(call('GET', '/api/tables/item/rows/1').data.data[0].remarks).toBe(
      `it${Q}s here`
    )

    // item codes may be deleted (replaced) by the roles that edit items
    // (db/Scripts/migrations/2026-11-19-item-protection-permissions.sql)
    expect(call('DELETE', `/api/tables/itemCode/rows/${id}`).status).toBe(200)

    // business records are never deleted: soul refuses (as in production)
    expect(call('DELETE', '/api/tables/item/rows/1')).toEqual({
      status: 403,
      data: { message: 'Not authorized' }
    })
  })
})

describe('password endpoints', () => {
  it('lets users change their own password', () => {
    loginAs('demo-user')
    const userId = call(
      'GET',
      '/api/tables/_users/rows?_filters=username:demo-user'
    ).data.data[0].id
    const res = call('POST', '/api/insert-password', {
      fields: {
        userId,
        currentPassword: DEMO_PASSWORD,
        password: 'Gr8-Vault-Keeper!'
      }
    })
    expect(res.status).toBe(201)
    expect(
      call('POST', '/api/login', {
        username: 'demo-user',
        password: 'Gr8-Vault-Keeper!'
      }).status
    ).toBe(200)
  })

  it('rejects weak passwords', () => {
    loginAs('demo-user')
    const userId = call(
      'GET',
      '/api/tables/_users/rows?_filters=username:demo-user'
    ).data.data[0].id
    const res = call('POST', '/api/insert-password', {
      fields: { userId, password: 'short' }
    })
    expect(res.status).toBe(400)
  })
})

describe('axios adapter', () => {
  it('resolves successes and rejects errors like a server would', async () => {
    const client = axios.create({ adapter: demoAdapter(handle) })
    const ok = await client.post('/api/login', {
      username: 'demo',
      password: DEMO_PASSWORD
    })
    expect(ok.data.data.username).toBe('demo')

    const err: unknown = await client
      .get('/api/tables/item/rows')
      .catch((e: unknown) => e)
    if (!axios.isAxiosError(err)) throw new Error('expected an AxiosError')
    expect(getErrorDetails(err)).toEqual({
      message: 'Error Code: 401, Message: Invalid access token',
      status: 401,
      data: { message: 'Invalid access token' }
    })
  })
})
