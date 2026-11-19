// Hosted demo (GitHub Pages): answer the app's API calls in the browser.
// Loaded only when the app is built with VITE_DEMO=true (yarn build:demo).
// The database is the repository's db/RCO2.sqlite plus the demo accounts,
// held in memory: changes last until the page is reloaded.
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import initSqlJs from 'sql.js'
import { seedDemoUsers } from './seed'
import {
  createSoulEmulator,
  type Session,
  type SessionStore
} from './soulEmulator'

// soul keeps the login in cookies; keep it for the browser tab
const SESSION_KEY = 'val-demo-session'
const tabSessionStore = (): SessionStore => ({
  get: () => {
    try {
      const value = sessionStorage.getItem(SESSION_KEY)
      return value ? (JSON.parse(value) as Session) : null
    } catch {
      return null
    }
  },
  set: (session) => {
    try {
      if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      else sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // storage unavailable: the login lasts until the page is reloaded
    }
  }
})

const parseBody = (data: unknown): unknown => {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

export const demoAdapter = (
  handle: ReturnType<typeof createSoulEmulator>
): AxiosAdapter => {
  return async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    const url = config.url ?? ''
    const apiIndex = url.indexOf('/api/')
    const result =
      apiIndex === -1
        ? { status: 404, data: { message: `Not found: ${url}` } }
        : handle({
            method: config.method ?? 'get',
            url: url.slice(apiIndex),
            body: parseBody(config.data)
          })
    const response: AxiosResponse = {
      data: result.data,
      status: result.status,
      statusText: String(result.status),
      headers: new AxiosHeaders({ 'content-type': 'application/json' }),
      config,
      request: {}
    }
    const validate = config.validateStatus
    if (!validate || validate(result.status)) return response
    throw new AxiosError(
      `Request failed with status code ${result.status}`,
      result.status >= 500
        ? AxiosError.ERR_BAD_RESPONSE
        : AxiosError.ERR_BAD_REQUEST,
      config,
      response.request,
      response
    )
  }
}

// served next to index.html by the val-demo-files plugin (vite.config.ts)
const demoFile = (name: string): string => `demo-data/${name}`

export const startDemoBackend = async (): Promise<void> => {
  const [SQL, dbFile] = await Promise.all([
    initSqlJs({ locateFile: () => demoFile('sql-wasm.wasm') }),
    fetch(demoFile('RCO2.sqlite')).then(async (res) => {
      if (!res.ok)
        throw new Error(`Could not load the demo database (${res.status})`)
      return new Uint8Array(await res.arrayBuffer())
    })
  ])
  const db = new SQL.Database(dbFile)
  seedDemoUsers(db)
  axios.defaults.adapter = demoAdapter(
    createSoulEmulator(db, tabSessionStore())
  )
}
