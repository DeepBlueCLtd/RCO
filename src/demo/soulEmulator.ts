// An in-browser stand-in for the soul-cli server, for the hosted demo and PR
// previews (GitHub Pages has no backend). It answers the same HTTP API the
// app calls in production - soul's REST rows API with auth enabled, plus the
// RCO extensions in _devExtensions/ - against an in-memory SQLite database
// (sql.js), so the app runs its production code paths unchanged.
//
// Behaviour follows soul-cli 0.7.8 (node_modules/soul-cli/src/controllers/
// rows.js, middlewares/auth.js, middlewares/api.js, controllers/auth/) and
// _devExtensions/*.js. SQL is built the same way soul builds it, including
// its quoting quirks, so the demo shows the same behaviour as production.
// Not emulated: token expiry, refresh-token revocation, websockets, and the
// table-management endpoints (/api/tables without /rows), which RCO never calls.
import bcrypt from 'bcryptjs'
import { type Database, type SqlValue } from 'sql.js'
import { common as passwordSchema } from '../utils/password-validation.schema'

export interface EmulatorRequest {
  method: string
  /** path plus query string, e.g. /api/tables/item/rows?_page=1 */
  url: string
  body?: any
}

export interface EmulatorResponse {
  status: number
  data: any
}

export interface Session {
  userId: number
  username: string
  isSuperuser: boolean
  roleIds: number[]
}

export interface SessionStore {
  get: () => Session | null
  set: (session: Session | null) => void
}

export const memorySessionStore = (): SessionStore => {
  let session: Session | null = null
  return {
    get: () => session,
    set: (value) => {
      session = value
    }
  }
}

const ROLES = { DEFAULT: 1, RCO_USER: 2, RCO_POWER_USER: 3 }
const VERB_PERMISSION: Record<string, string> = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete'
}
const OPERATORS: Record<string, string> = {
  eq: '=',
  lt: '<',
  gt: '>',
  lte: '<=',
  gte: '>=',
  neq: '!=',
  null: 'IS NULL',
  notnull: 'IS NOT NULL'
}

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

const toBoolean = (value: unknown): boolean =>
  value === true || value === 1 || value === 'true' || value === '1'

// --- thin better-sqlite3-like helpers over sql.js ---------------------------

const all = (
  db: Database,
  sql: string,
  params: SqlValue[] = []
): Array<Record<string, any>> => {
  const stmt = db.prepare(sql)
  try {
    stmt.bind(params)
    const rows: Array<Record<string, any>> = []
    while (stmt.step()) rows.push(stmt.getAsObject())
    return rows
  } finally {
    stmt.free()
  }
}

const get = (
  db: Database,
  sql: string,
  params: SqlValue[] = []
): Record<string, any> | undefined => all(db, sql, params)[0]

const run = (
  db: Database,
  sql: string,
  params: SqlValue[] = []
): { changes: number; lastInsertRowid: number } => {
  db.run(sql, params)
  const changes = db.getRowsModified()
  const lastInsertRowid = Number(
    get(db, 'SELECT last_insert_rowid() AS id')?.id ?? 0
  )
  return { changes, lastInsertRowid }
}

// soul passes values straight to better-sqlite3, which rejects booleans
// and objects; sql.js would coerce them, so check here to match.
const bindable = (value: unknown): SqlValue => {
  if (
    value === null ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    value instanceof Uint8Array
  ) {
    return value
  }
  if (typeof value === 'bigint') return Number(value)
  throw new HttpError(
    400,
    'SQLite3 can only bind numbers, strings, bigints, buffers, and null'
  )
}

const primaryKey = (db: Database, table: string): string => {
  const pk = all(db, `PRAGMA table_info(${table})`).find((f) => f.pk === 1)
  if (!pk) throw new HttpError(400, 'Primary key not found')
  return pk.name
}

const stripPasswords = (rows: Array<Record<string, any>>): void => {
  rows.forEach((row) => {
    delete row.hashed_password
    delete row.salt
  })
}

// --- the emulator ---------------------------------------------------------

export const createSoulEmulator = (
  db: Database,
  sessions: SessionStore = memorySessionStore()
): ((req: EmulatorRequest) => EmulatorResponse) => {
  const requireSession = (): Session => {
    const session = sessions.get()
    if (!session) throw new HttpError(401, 'Invalid access token')
    return session
  }

  // middlewares/auth.js hasAccess
  const checkAccess = (table: string, method: string): void => {
    const session = requireSession()
    if (session.isSuperuser) return
    const roleIds = session.roleIds
    const permissions = roleIds.length
      ? all(
          db,
          `SELECT * FROM _roles_permissions WHERE role_id IN (${roleIds
            .map(() => '?')
            .join(',')})`,
          roleIds
        ).filter((row) => row.table_name === table)
      : []
    if (permissions.length === 0) {
      throw new HttpError(403, 'Permission not defined for this role')
    }
    const verb = VERB_PERMISSION[method]
    if (!permissions.some((row) => toBoolean(row[verb]))) {
      throw new HttpError(403, 'Not authorized')
    }
  }

  const roleIdsFor = (userId: number): number[] =>
    all(db, 'SELECT role_id FROM _users_roles WHERE user_id = ?', [userId]).map(
      (row) => Number(row.role_id)
    )

  // controllers/rows.js listTableRows
  const listRows = (table: string, query: URLSearchParams): any => {
    const page = parseInt(query.get('_page') ?? '1')
    const limit = parseInt(query.get('_limit') ?? '10')
    const filtersParam = query.get('_filters') ?? ''
    const search = query.get('_search')
    const ordering = query.get('_ordering')

    let whereString = ''
    if (filtersParam !== '') {
      const filters = filtersParam.split(/,(?![^[]*?\])/).map((filter) => {
        const [key, ...rest] = filter.split(':')
        let value: string | null = rest.join(':')
        const [field, fieldOperator = 'eq'] = key.split('__')
        if (!OPERATORS[fieldOperator]) {
          throw new HttpError(
            400,
            `Invalid field operator '${fieldOperator}' for field '${field}'. You can only use the following operators after the '${field}' field: __lt, __gt, __lte, __gte, __eq, __neq.`
          )
        }
        if (['null', 'notnull'].includes(fieldOperator)) value = null
        return { field, operator: OPERATORS[fieldOperator], value }
      })
      whereString =
        ' WHERE ' +
        filters
          .map(({ field, operator, value }) => {
            if (value) {
              if (value.startsWith('[') && value.endsWith(']')) {
                const values = value
                  .slice(1, -1)
                  .split(',')
                  .map((v) => `'${v}'`)
                return `${table}.${field} IN (${values.join(', ')})`
              }
              return `${table}.${field} ${operator} '${value}'`
            }
            return `${table}.${field} ${operator}`
          })
          .join(' AND ')
    }

    if (search) {
      whereString += whereString === '' ? ' WHERE ' : ' AND '
      const fields = all(db, `PRAGMA table_info(${table})`)
      whereString +=
        '(' +
        fields
          .map((f) => `${table}.${String(f.name)} LIKE '%${search}%'`)
          .join(' OR ') +
        ')'
    }

    let orderString = ''
    if (ordering) {
      orderString = ` ORDER BY ${ordering.replace('-', '')} ${
        ordering.startsWith('-') ? 'DESC' : 'ASC'
      }`
    }

    const data = all(
      db,
      `SELECT ${table}.* FROM ${table} ${whereString} ${orderString} LIMIT ? OFFSET ?`,
      [limit || 10, limit * (page - 1) || 0]
    )
    const total = Number(
      get(db, `SELECT COUNT(*) as total FROM ${table} ${whereString}`)?.total
    )
    return { data, total }
  }

  // controllers/rows.js getRowInTableByPK
  const getRows = (table: string, pks: string, query: URLSearchParams): any => {
    const lookupField = query.get('_lookup_field') ?? primaryKey(db, table)
    const keys = pks.split(',')
    const data = all(
      db,
      `SELECT ${table}.* FROM ${table} WHERE ${table}.${lookupField} in (${keys
        .map(() => '?')
        .join(',')})`,
      keys
    )
    if (data.length === 0) throw new HttpError(404, 'Row not found')
    return { data }
  }

  // controllers/rows.js insertRowInTable / rowService.save
  const insertRow = (table: string, queryFields: Record<string, any>): any => {
    const fields = Object.fromEntries(
      Object.entries(queryFields ?? {}).filter(([, value]) => value !== null)
    )
    const names = Object.keys(fields)
    const values = Object.values(fields).map(bindable)
    const sql =
      names.length === 0
        ? `INSERT INTO ${table} DEFAULT VALUES`
        : `INSERT INTO ${table} (${names
            .map((n) => `'${n}'`)
            .join(', ')}) VALUES (${values.map(() => '?').join(',')})`
    return { message: 'Row inserted', data: run(db, sql, values) }
  }

  // controllers/auth/user.js registerUser (POST /api/tables/_users/rows)
  const registerUser = (queryFields: Record<string, any>): any => {
    const { username, password, ...optionalFields } = queryFields ?? {}
    if (!username) throw new HttpError(400, 'username is required')
    if (!password) throw new HttpError(400, 'password is required')
    if (get(db, 'SELECT id FROM _users WHERE username = ?', [username])) {
      throw new HttpError(409, 'This username is taken')
    }
    const salt = bcrypt.genSaltSync(10)
    const hashed = bcrypt.hashSync(password, 10)
    const { data } = insertRow('_users', {
      username,
      salt,
      hashed_password: hashed,
      is_superuser: 'false',
      ...optionalFields
    })
    const defaultRole = get(db, 'SELECT id FROM _roles WHERE name = ?', [
      'default'
    ])
    if (defaultRole) {
      insertRow('_users_roles', {
        user_id: data.lastInsertRowid,
        role_id: defaultRole.id
      })
    }
    // soul does not return the new id for users
    return { message: 'Row Inserted' }
  }

  // controllers/rows.js updateRowInTableByPK / rowService.update
  const updateRows = (
    table: string,
    pks: string,
    fields: Record<string, any>,
    query: URLSearchParams
  ): any => {
    const lookupField = query.get('_lookup_field') ?? primaryKey(db, table)
    const updates = { ...(fields ?? {}) }
    if (table === '_users') {
      delete updates.salt
      delete updates.is_superuser
      delete updates.hashed_password
    }
    // soul wraps strings in quotes without escaping: the app doubles quotes
    const fieldsString = Object.keys(updates)
      .map((key) => {
        const value = updates[key]
        return `'${key}' = ${
          typeof value === 'string' ? `'${value}'` : String(value)
        }`
      })
      .join(', ')
    if (fieldsString === '') throw new HttpError(400, 'No fields provided')
    const keys = pks.split(',')
    const data = run(
      db,
      `UPDATE ${table} SET ${fieldsString} WHERE ${lookupField} in (${keys
        .map(() => '?')
        .join(',')})`,
      keys
    )
    return { message: 'Row updated', data }
  }

  // controllers/rows.js deleteRowInTableByPK
  const deleteRows = (
    table: string,
    pks: string,
    query: URLSearchParams
  ): any => {
    const lookupField = query.get('_lookup_field') ?? primaryKey(db, table)
    const keys = pks.split(',')
    const data = run(
      db,
      `DELETE FROM ${table} WHERE ${lookupField} in (${keys
        .map(() => '?')
        .join(',')})`,
      keys
    )
    if (data.changes === 0) throw new HttpError(404, 'not_found')
    return { message: 'Row deleted', data }
  }

  const rows = (
    method: string,
    table: string,
    pks: string | undefined,
    query: URLSearchParams,
    body: any
  ): EmulatorResponse => {
    checkAccess(table, method)
    if (method === 'GET' && pks === undefined) {
      const payload = listRows(table, query)
      if (table === '_users') stripPasswords(payload.data)
      return { status: 200, data: payload }
    }
    if (method === 'GET' && pks !== undefined) {
      const payload = getRows(table, pks, query)
      if (table === '_users') stripPasswords(payload.data)
      return { status: 200, data: payload }
    }
    if (method === 'POST' && pks === undefined) {
      if (table === '_users') {
        return { status: 201, data: registerUser(body?.fields) }
      }
      return { status: 201, data: insertRow(table, body?.fields) }
    }
    if (method === 'PUT' && pks !== undefined) {
      return { status: 200, data: updateRows(table, pks, body?.fields, query) }
    }
    if (method === 'DELETE' && pks !== undefined) {
      return { status: 200, data: deleteRows(table, pks, query) }
    }
    throw new HttpError(404, `Cannot ${method} ${table}`)
  }

  // controllers/auth/token.js obtainAccessToken
  const obtainToken = (body: any): EmulatorResponse => {
    const { username, password } = body?.fields ?? {}
    const user = get(db, 'SELECT * FROM _users WHERE username = ?', [username])
    if (!user || !bcrypt.compareSync(String(password), user.hashed_password)) {
      throw new HttpError(401, 'Invalid username or password')
    }
    const isSuperuser = toBoolean(user.is_superuser)
    const roleIds = isSuperuser ? [] : roleIdsFor(Number(user.id))
    if (!isSuperuser && roleIds.length === 0) {
      throw new HttpError(401, 'Role not found for this user')
    }
    sessions.set({
      userId: Number(user.id),
      username: user.username,
      isSuperuser,
      roleIds
    })
    return {
      status: 201,
      data: { message: 'Success', data: { userId: user.id } }
    }
  }

  // _devExtensions/login-controller.js
  const login = (body: any): EmulatorResponse => {
    const { password, username } = body ?? {}
    if (!password || !username) {
      throw new HttpError(400, 'password and username is required')
    }
    const user = get(db, 'SELECT * FROM _users WHERE username=?', [username])
    if (!user) throw new HttpError(400, 'User not found')
    if (Number(user.lockoutAttempts) >= 5) {
      throw new HttpError(
        400,
        `Your account is locked. Please contact your administrator [${String(
          user.lockoutAttempts
        )}]`
      )
    }
    if (user.departedDate && new Date() > new Date(user.departedDate)) {
      throw new HttpError(400, 'User has departed organisation')
    }
    const updateBefore = user.updateBefore
    if (updateBefore && new Date().toISOString() > updateBefore) {
      throw new HttpError(
        400,
        'You have not updated the password. Please contact your administrator'
      )
    }
    if (!bcrypt.compareSync(String(password), user.hashed_password)) {
      run(db, 'UPDATE _users SET lockoutAttempts = ? where username = ?', [
        Number(user.lockoutAttempts) + 1,
        username
      ])
      throw new HttpError(400, 'Invalid password')
    }
    run(db, 'UPDATE _users SET lockoutAttempts = ? where username = ?', [
      0,
      username
    ])
    delete user.hashed_password
    return { status: 200, data: { data: user } }
  }

  const canManagePasswords = (roleIds: number[]): boolean =>
    roleIds.includes(ROLES.RCO_USER) || roleIds.includes(ROLES.RCO_POWER_USER)

  const validatePassword = (password: unknown): void => {
    try {
      passwordSchema.validateSync(password)
    } catch (error) {
      throw new HttpError(400, (error as Error).message)
    }
  }

  // passwords table of db/Security.sqlite, kept in memory here
  const passwordHistory: Array<{ userId: number; password: string }> = []

  // _devExtensions/api.js insertPasswordRecord
  const insertPassword = (body: any): EmulatorResponse => {
    const session = requireSession()
    const { userId, currentPassword, password } = body?.fields ?? {}
    if (Number(userId) !== session.userId) {
      throw new HttpError(403, 'You can only change your own password.')
    }
    if (currentPassword !== undefined) {
      const user = get(db, 'SELECT hashed_password FROM _users WHERE id = ?', [
        session.userId
      ])
      if (!user) throw new HttpError(400, 'User not found')
      if (!bcrypt.compareSync(String(currentPassword), user.hashed_password)) {
        throw new HttpError(400, 'Invalid current password')
      }
    }
    validatePassword(password)
    const recent = passwordHistory
      .filter((p) => p.userId === session.userId)
      .slice(-5)
    if (recent.some((p) => bcrypt.compareSync(String(password), p.password))) {
      throw new HttpError(
        400,
        'Password cannot be the same as any of the last five passwords.'
      )
    }
    passwordHistory.push({
      userId: session.userId,
      password: bcrypt.hashSync(String(password))
    })
    run(
      db,
      'UPDATE _users SET hashed_password = ?, lastUpdatedAt = ? WHERE id = ?',
      [
        bcrypt.hashSync(String(password)),
        new Date().toISOString(),
        session.userId
      ]
    )
    return { status: 201, data: { message: 'Password updated!' } }
  }

  // _devExtensions/editPassword-controller.js
  const editPassword = (body: any): EmulatorResponse => {
    const session = requireSession()
    if (!canManagePasswords(session.roleIds)) {
      throw new HttpError(
        403,
        'Insufficient permissions. Password management requires rco-user or rco-power-user role.'
      )
    }
    const { userId, newPassword } = body?.fields ?? {}
    if (session.userId === userId) {
      throw new HttpError(
        403,
        'Cannot reset your own password using this endpoint. Use the password change form instead.'
      )
    }
    validatePassword(newPassword)
    run(
      db,
      'UPDATE _users SET hashed_password = ?, lastUpdatedAt = ?, updateBefore = ?, lockoutAttempts = ? WHERE id = ?',
      [
        bcrypt.hashSync(String(newPassword)),
        new Date().toISOString(),
        new Date(Date.now() + 60 * 60000).toISOString(),
        0,
        bindable(userId)
      ]
    )
    return {
      status: 201,
      data: { message: 'User Password updated Successfully.' }
    }
  }

  // _devExtensions/updateBefore-controller.js
  const updateBefore = (body: any): EmulatorResponse => {
    const session = requireSession()
    const { userId } = body?.data ?? {}
    if (session.userId !== userId && !canManagePasswords(session.roleIds)) {
      throw new HttpError(
        403,
        'Insufficient permissions. Can only clear your own password expiration unless you have rco-user or rco-power-user role.'
      )
    }
    run(db, 'UPDATE _users SET updateBefore = ? WHERE id = ?', [
      '',
      bindable(userId)
    ])
    const user = get(
      db,
      'SELECT createdAt, createdBy, departedDate, id, is_superuser, lastUpdatedAt, lockoutAttempts, name, updateBefore, username FROM _users WHERE id = ?',
      [bindable(userId)]
    )
    return { status: 201, data: { userDetails: user } }
  }

  return ({ method, url, body }: EmulatorRequest): EmulatorResponse => {
    const verb = method.toUpperCase()
    const parsed = new URL(url, 'http://demo.invalid')
    const path = parsed.pathname.replace(/\/+$/, '')
    try {
      const tableMatch = /^\/api\/tables\/([^/]+)\/rows(?:\/([^/]+))?$/.exec(
        path
      )
      if (tableMatch) {
        const table = decodeURIComponent(tableMatch[1])
        const pks =
          tableMatch[2] !== undefined
            ? decodeURIComponent(tableMatch[2])
            : undefined
        if (!/^\w+$/.test(table)) throw new HttpError(400, 'Invalid table name')
        return rows(verb, table, pks, parsed.searchParams, body)
      }
      const route = `${verb} ${path}`
      switch (route) {
        case 'GET /api/ip':
          return { status: 200, data: { ip: 'demo' } }
        case 'POST /api/login':
          return login(body)
        case 'POST /api/auth/token/obtain':
          return obtainToken(body)
        case 'GET /api/auth/token/refresh': {
          const session = sessions.get()
          if (!session) throw new HttpError(403, 'Invalid refresh token')
          return {
            status: 200,
            data: { message: 'Success', data: { userId: session.userId } }
          }
        }
        case 'GET /api/auth/logout':
          sessions.set(null)
          return { status: 200, data: { message: 'Logout successful' } }
        case 'POST /api/insert-password':
          return insertPassword(body)
        case 'POST /api/editpassword':
          return editPassword(body)
        case 'POST /api/update-before':
          return updateBefore(body)
        default:
          return { status: 404, data: { message: `Cannot ${verb} ${path}` } }
      }
    } catch (error) {
      if (error instanceof HttpError) {
        return { status: error.status, data: { message: error.message } }
      }
      // SQL errors: soul answers 400 with the SQLite message
      return { status: 400, data: { message: (error as Error).message } }
    }
  }
}
