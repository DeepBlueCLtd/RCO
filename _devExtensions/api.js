const getIp = {
  method: 'GET',
  path: '/api/ip',
  handler: (req, res) => {
    res.status(200).json({ ip: req.socket.remoteAddress })
  }
}

module.exports = {
  getIp
}