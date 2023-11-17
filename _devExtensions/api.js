const BS3Database = require('better-sqlite3')
const path = require('path')

const tableName = 'passwords'

const getIp = {
  method: 'GET',
  path: '/api/ip',
  handler: (req, res) => {
    res.status(200).json({ ip: req.headers['x-forwarded-for'] })
  }
}

const removeOldestPassword = (db, userId) => {
  const query = `DELETE FROM ${tableName} WHERE userId = ? ORDER BY createdAt LIMIT 1`
  db.prepare(query).run(userId)
}

const checkCoundAndRemoveOldestPassword = (db, userId) => {
  const countQuery = `SELECT COUNT(*) as count FROM ${tableName} WHERE userId = ?`
  const count = db.prepare(countQuery).get(userId).count

  if (count >= 5) {
    removeOldestPassword(db, userId)
  }
}

const insertPasswordRecord = {
  method: 'POST',
  path: '/api/insert-password',
  handler: (req, res) => {
    const db = new BS3Database(path.join(process.cwd(), 'db/Security.sqlite'))

    const { fields: queryFields } = req.body
    queryFields.createdAt = new Date().toISOString()

    checkCoundAndRemoveOldestPassword(db, queryFields.userId)

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
