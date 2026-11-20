const BS3Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')
const passwordValidationSchema = require('./password-validation.schema')
const loginController = require('./login-controller')
const editPasswordController = require('./editPassword-controller')
const updateBeforeController = require('./updateBefore-controller')
const setUserRoleController = require('./setUserRole-controller')
const { authenticateRequest } = require('./auth-helper')
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
      // Callers must be logged in, and may only change their own password
      const { userId: callerId } = authenticateRequest(req)

      const { userId, currentPassword, password } = req.body.fields
      if (Number(userId) !== callerId) {
        return res.status(403).json({
          message: 'You can only change your own password.'
        })
      }

      securityDb = new BS3Database(
        path.join(process.cwd(), 'db/Security.sqlite')
      )

      mainDb = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))

      // if currentPassword present, validate it
      if (currentPassword !== undefined) {
        validateCurrentPassword(mainDb, callerId, currentPassword)
      }

      await passwordValidationSchema.validate(password)
      checkAgainstLastFivePassowrds(securityDb, callerId, password)
      removeOldPasswords(securityDb, callerId)

      const data = securityDb
        .prepare(
          `INSERT INTO ${tableName} (userId, password, createdAt) VALUES (?, ?, ?)`
        )
        .run(callerId, bcrypt.hashSync(password), new Date().toISOString())

      updateUserPassword(mainDb, callerId, password)

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

const setUserRole = {
  method: 'POST',
  path: '/api/set-user-role',
  handler: setUserRoleController
}

module.exports = {
  getIp,
  insertPasswordRecord,
  login,
  editPassword,
  updateBefore,
  setUserRole
}
