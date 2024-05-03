const path = require('path')
const express = require('express')
const {
  insertPasswordRecord,
  login,
  editPassword,
  updateBefore
} = require('../_devExtensions/api')

const getIp = {
  method: 'GET',
  path: '/api/ip',
  handler: (req, res) => {
    res.status(200).json({ ip: req.headers['x-forwarded-for'] })
  }
}

const rcoClient = {
  method: 'GET',
  path: '/',
  handler: (req, res) => {
    const clientPath = path.join(__dirname, '../dist', 'index.html')
    res.app.use(express.static(path.join(__dirname, '../dist')))
    res.sendFile(path.join(clientPath))
  }
}

module.exports = {
  getIp,
  rcoClient,
  insertPasswordRecord,
  login,
  editPassword,
  updateBefore
}
