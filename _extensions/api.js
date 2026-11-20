const path = require('node:path')
const express = require('express')
const {
  insertPasswordRecord,
  login,
  editPassword,
  updateBefore,
  setUserRole
} = require('../_devExtensions/api')

const getIp = {
  method: 'GET',
  path: '/api/ip',
  handler: (req, res) => {
    res.status(200).json({ ip: req.headers['x-forwarded-for'] })
  }
}

const distPath = path.join(__dirname, '../dist')
const serveDist = express.static(distPath)
let distServed = false

// soul applies helmet's default Content-Security-Policy, whose
// `upgrade-insecure-requests` makes browsers fetch the app's assets over
// https://. Clients serve RCO over plain HTTP, where that fails, so drop
// that directive. Everything is same-origin, so HTTPS deployments lose
// nothing.
const allowPlainHttp = (res) => {
  const csp = res.getHeader('Content-Security-Policy')
  if (typeof csp !== 'string') return
  const directives = csp
    .split(';')
    .map((directive) => directive.trim())
    .filter((directive) => directive && directive !== 'upgrade-insecure-requests')
  res.setHeader('Content-Security-Policy', directives.join(';'))
}

const rcoClient = {
  method: 'GET',
  path: '/',
  handler: (req, res) => {
    // soul has no hook for static files: add them once, on first page load
    if (!distServed) {
      res.app.use(serveDist)
      distServed = true
    }
    allowPlainHttp(res)
    res.sendFile(path.join(distPath, 'index.html'))
  }
}

module.exports = {
  getIp,
  rcoClient,
  insertPasswordRecord,
  login,
  editPassword,
  updateBefore,
  setUserRole
}
