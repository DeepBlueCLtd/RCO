const BS3Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')
const passwordValidationSchema = require('./password-validation.schema')

const tableName = 'passwords'

const getIp = {
  method: 'GET',
  path: '/api/ip',
  handler: (req, res) => {
    res.status(200).json({ ip: req.headers['x-forwarded-for'] })
  }
}

const removeOldPasswords = (db, userId) => {
  const deleteQuery = `
    DELETE FROM ${tableName}
    WHERE userId = ?
    AND createdAt NOT IN (
      SELECT createdAt FROM ${tableName}
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT 4
    )
  `
  db.prepare(deleteQuery).run(userId, userId)
}

const checkAgainstLastFivePassowrds = (db, userId, password) => {
  const query = `SELECT password FROM ${tableName} WHERE userId = ? ORDER BY createdAt DESC LIMIT 5`
  const rows = db.prepare(query).all(userId)
  const recentPasswords = rows.map((row) => row.password)
  if (recentPasswords.some((p) => bcrypt.compareSync(password, p)))
    throw new Error(
      'Password cannot be the same as any of the last five passwords.'
    )
}

const insertPasswordRecord = {
  method: 'POST',
  path: '/api/insert-password',
  handler: async (req, res) => {
    let db
    try {
      db = new BS3Database(path.join(process.cwd(), 'db/Security.sqlite'))
      const { fields: queryFields } = req.body
      queryFields.createdAt = new Date().toISOString()

      const { userId, password } = queryFields

      await passwordValidationSchema.validate(password)

      checkAgainstLastFivePassowrds(db, userId, password)
      removeOldPasswords(db, userId)

      queryFields.password = bcrypt.hashSync(password)

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
      if (db) db.close()
    }
  }
}

module.exports = {
  getIp,
  insertPasswordRecord
}
