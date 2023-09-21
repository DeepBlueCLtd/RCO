const { spawn } = require('child_process')
const path = require('path')

const cwd = process.cwd()
const EXTENSION = path.join(cwd, '_extensions')
const command = 'soul'
const args = ['-d', './db/RCO2.sqlite', '-e', EXTENSION]
const child = spawn(command, args, { stdio: 'inherit' })
child.on('exit', (code) => {
  process.exit(code)
})
