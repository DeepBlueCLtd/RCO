const path = require('path')
const express = require('express')

const getIp = {
  method: 'GET',
  path: '/api/ip',
  handler: (req, res) => {
    res.status(200).json({ ip: req.socket.remoteAddress })
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
  rcoClient
}