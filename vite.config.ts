import react from '@vitejs/plugin-react'
import preval from 'vite-plugin-babel-macros'
import EnvironmentPlugin from 'vite-plugin-environment'
import dotenv from 'dotenv'
import fs from 'node:fs'
import { type Plugin } from 'vite'

dotenv.config()

// Hosted demo only (VITE_DEMO, see src/demo/): the in-browser backend needs
// the SQLite engine and the development database, served next to the app.
// Added here, not imported by the app, so other builds do not ship them.
const DEMO_FILES: Record<string, string> = {
  'demo-data/sql-wasm.wasm': 'node_modules/sql.js/dist/sql-wasm.wasm',
  'demo-data/RCO2.sqlite': 'db/RCO2.sqlite'
}

const demoFiles = (): Plugin => ({
  name: 'val-demo-files',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const name = Object.keys(DEMO_FILES).find((file) =>
        req.url?.split('?')[0].endsWith(`/${file}`)
      )
      if (name === undefined) {
        next()
        return
      }
      if (name.endsWith('.wasm'))
        res.setHeader('Content-Type', 'application/wasm')
      res.end(fs.readFileSync(DEMO_FILES[name]))
    })
  },
  generateBundle() {
    for (const [fileName, source] of Object.entries(DEMO_FILES)) {
      this.emitFile({
        type: 'asset',
        fileName,
        source: fs.readFileSync(source)
      })
    }
  }
})

// https://vitejs.dev/config/
export default {
  plugins: [
    react(),
    preval(),
    EnvironmentPlugin({
      VITE_KEY: null,
      VITE_APP_VERSION: null,
      VITE_DATA_VERSION: null,
      MOCK: null,
      VITE_DEMO: null,
      VAL_TEST: null
    }),
    ...(process.env.VITE_DEMO ? [demoFiles()] : [])
  ],
  base: './'
}
