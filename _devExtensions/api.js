const BS3Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')
const passwordValidationSchema = require('./password-validation.schema')
const loginController = require('./login-controller')
const editPasswordController = require('./editPassword-controller')
const updateBeforeController = require('./updateBefore-controller')
const tableName = 'passwords'

const getIp = {
  method: 'GET',
  path: '/api/ip',
  handler: (req, res) => {
    res.status(200).json({ ip: req.headers['x-forwarded-for'] })
  }
}

const validateCurrentPassword = (db, userId, currentPassword) => {
  const query = `SELECT hashed_password FROM _users WHERE id = ?`
  const user = db.prepare(query).get(userId)
  if (!user) {
    throw new Error('User not found')
  }
  const isPasswordValid = bcrypt.compareSync(
    currentPassword,
    user.hashed_password
  )
  if (!isPasswordValid) {
    throw new Error('Invalid current password')
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
    UPDATE _users
    SET hashed_password = ?, lastUpdatedAt = ?
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

      const { userId, currentPassword, password } = queryFields

      // if currentPassword present, validate it
      if (currentPassword !== undefined) {
        validateCurrentPassword(mainDb, userId, currentPassword)
      }

      await passwordValidationSchema.validate(password)
      checkAgainstLastFivePassowrds(securityDb, userId, password)
      removeOldPasswords(securityDb, userId)

      queryFields.password = bcrypt.hashSync(password)

      const fields = Object.fromEntries(
        Object.entries(queryFields).filter(
          ([name, value]) => (value !== null) & (name !== 'currentPassword')
        )
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

const editPassword = {
  method: 'POST',
  path: '/api/editpassword',
  handler: editPasswordController
}
const updateBefore = {
  method: 'POST',
  path: '/api/update-before',
  handler: updateBeforeController
}

module.exports = {
  getIp,
  insertPasswordRecord,
  login,
  editPassword,
  updateBefore
}
