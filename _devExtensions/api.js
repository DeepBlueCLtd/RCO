const BS3Database = require('better-sqlite3')
const path = require('path')

const getIp = {
  method: 'GET',
  path: '/api/ip',
  handler: (req, res) => {
    res.status(200).json({ ip: req.headers['x-forwarded-for'] })
  }
}

const insertPasswordRecord = {
  method: 'POST',
  path: '/api/insert-password',
  handler: (req, res) => {
    const db = new BS3Database(path.join(process.cwd(), 'db/Security.sqlite'))
    const tableName = 'passwords'

    const { fields: queryFields } = req.body
    queryFields.createdAt = new Date().toISOString()

    const fields = Object.fromEntries(
      Object.entries(queryFields).filter(([_, value]) => value !== null)
    )

    const fieldsString = Object.keys(fields).join(', ')

    const valuesString = Object.values(fields)
      .map((value) => {
        if (typeof value === 'string') {
          return `'${value}'`
        }
        return value
      })
      .join(', ')

    let values = `(${fieldsString}) VALUES (${valuesString})`
    if (valuesString === '') {
      values = 'DEFAULT VALUES'
    }

    const query = `INSERT INTO ${tableName} ${values}`

    try {
      const data = db.prepare(query).run()
      res.status(201).json({
        message: 'Row inserted',
        data
      })
    } catch (error) {
      res.status(400).json({
        message: error.message,
        error: error
      })
    } finally {
      db.close()
    }
  }
}

module.exports = {
  getIp,
  insertPasswordRecord
}
