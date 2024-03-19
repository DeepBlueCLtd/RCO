require('dotenv').config()

const { exec } = require('child_process')
const path = require('path')
const packagePath = path.resolve(__dirname, 'node_modules/.bin/soul')

const child = exec(`${packagePath} -d ./db/RCO2.sqlite -e %cd%\\_devExtensions`)

child.stdout.on('data', (data) => console.log(data))

child.stderr.on('data', (data) => console.error(data))

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})
