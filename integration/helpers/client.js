// Minimal HTTP client with a cookie jar, standing in for the browser.
// soul keeps the access and refresh tokens in HttpOnly cookies.

const jwt = require('jsonwebtoken')
const { PASSWORD } = require('./soul-server')

const parseSetCookies = (res) =>
  res.headers.getSetCookie().map((raw) => {
    const [pair, ...attrs] = raw.split(';').map((s) => s.trim())
    const eq = pair.indexOf('=')
    return {
      name: pair.slice(0, eq),
      value: decodeURIComponent(pair.slice(eq + 1)),
      attrs: attrs.map((a) => a.toLowerCase()),
      raw
    }
  })

class Client {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.cookies = {}
  }

  async request(method, url, body) {
    const headers = {}
    const cookieHeader = Object.entries(this.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')
    if (cookieHeader) headers.cookie = cookieHeader
    if (body !== undefined) headers['content-type'] = 'application/json'

    const res = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    })
    const setCookies = parseSetCookies(res)
    for (const c of setCookies) {
      if (
        c.value === '' ||
        c.attrs.some((a) => a.startsWith('expires=thu, 01 jan 1970'))
      ) {
        delete this.cookies[c.name]
      } else {
        this.cookies[c.name] = c.value
      }
    }
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch (err) {
      json = undefined
    }
    const result = {
      status: res.status,
      body: json,
      text: text,
      setCookies: setCookies
    }
    return result
  }

  get(url) {
    return this.request('GET', url)
  }

  post(url, body) {
    return this.request('POST', url, body)
  }

  put(url, body) {
    return this.request('PUT', url, body)
  }

  delete(url) {
    return this.request('DELETE', url)
  }

  /** The same two-step login the frontend does (src/utils/helper.ts). */
  async login(username, password = PASSWORD) {
    const check = await this.post('/api/login', { username, password })
    if (check.status !== 200) return check
    return this.post('/api/auth/token/obtain', {
      fields: { username, password }
    })
  }

  tokenPayload(name = 'accessToken') {
    return this.cookies[name] ? jwt.decode(this.cookies[name]) : undefined
  }
}

module.exports = { Client }
