import { createServer } from 'http'
import { lstatSync, readFileSync, existsSync, readFile } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const PORT = 8080

const server = createServer(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const requestedUrl = new URL(req.url, `http://${req.headers.host}`)
  const path = requestedUrl.pathname
  const baseDirectory = join(__dirname, 'dist')

  if (path === '/') {
    res.writeHead(302, { Location: '/index.html' })
    res.end()
  } else {
    const requestedFile = join(baseDirectory, path.substring(1))
    try {
      if (existsSync(requestedFile) && lstatSync(requestedFile).isFile()) {
        const contentType = getContentType(requestedFile)
        const data = readFileSync(requestedFile)

        res.writeHead(200, { 'Content-Type': contentType })
        res.end(data)
      } else {
        throw new Error('File not found')
      }
    } catch (err) {
      res.writeHead(404)
      res.end('File not found')
    }
  }
})

function getContentType(filePath) {
  const ext = extname(filePath)
  switch (ext) {
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
