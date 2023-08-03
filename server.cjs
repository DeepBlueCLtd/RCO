const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 8080

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(302, { Location: '/index.html' })
    res.end()
  }
  const filePath = path.join(__dirname, 'dist', req.url)
  const contentType = getContentType(filePath)

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('File not found')
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    }
  })
})

function getContentType(filePath) {
  const extname = path.extname(filePath)
  switch (extname) {
    case '.html':
      return 'text/html'
    case '.js':
      return 'text/javascript'
    case '.css':
      return 'text/css'
    case '.png':
      return 'image/png'
    default:
      return 'text/plain'
  }
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
