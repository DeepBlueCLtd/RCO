const BS3Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')
const passwordValidationSchema = require('./password-validation.schema')
const loginController = require('./login-controller')
const changePasswordController = require('./changePassword-controller')
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

const updateUserPassword = (db, userId, password) => {
  const hashedPassword = bcrypt.hashSync(password)
  const query = `
    UPDATE user
    SET password = ?, lastUpdatedAt = ? 
    WHERE id = ?;
  `
  db.prepare(query).run(hashedPassword, new Date().toISOString(), userId)
}

const insertPasswordRecord = {
  method: 'POST',
  path: '/api/insert-password',
  handler: async (req, res) => {
    let securityDb
    let mainDb

    try {
      securityDb = new BS3Database(
        path.join(process.cwd(), 'db/Security.sqlite')
      )

      mainDb = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))

      const { fields: queryFields } = req.body
      queryFields.createdAt = new Date().toISOString()

      const { userId, password } = queryFields

      await passwordValidationSchema.validate(password)

      checkAgainstLastFivePassowrds(securityDb, userId, password)
      removeOldPasswords(securityDb, userId)

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

      const data = securityDb.prepare(query).run()

      updateUserPassword(mainDb, userId, password)

      res.status(201).json({
        message: 'Password updated!',
        data
      })
    } catch (error) {
      res.status(400).json({
        message: error.message,
        error: error
      })
    } finally {
      if (securityDb) securityDb.close()
      if (mainDb) mainDb.close()
    }
  }
}

const login = {
  method: 'POST',
  path: '/api/login',
  handler: loginController
}

const changepassword = {
  method: 'POST',
  path: '/api/changepassword',
  handler: changePasswordController
}

module.exports = {
  getIp,
  insertPasswordRecord,
  login,
  changepassword
}
