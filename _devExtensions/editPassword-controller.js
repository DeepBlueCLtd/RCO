const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const path = require('path')
const passwordValidationSchema = require('./password-validation.schema')
const { authenticateRequest, canManagePasswords } = require('./auth-helper')

const updateUserPassword = (db, userId, newPassword) => {
  const hashedPassword = bcrypt.hashSync(newPassword)
  const now = new Date()
  const futureTime = new Date(now.getTime() + 60 * 60000)
  const futureTimeString = futureTime.toISOString()
  const lockoutAttempts = 0
  const query = `
        UPDATE _users
        SET hashed_password = ?, lastUpdatedAt = ?, updateBefore = ?, lockoutAttempts = ?
        WHERE id = ?;
      `
  db.prepare(query).run(
    hashedPassword,
    new Date().toISOString(),
    futureTimeString,
    lockoutAttempts,
    userId
  )
}

const editPasswordController = async (req, res) => {
  let mainDb

  try {
    // Authenticate the request and extract caller information
    const { userId: callerId, roleIds } = authenticateRequest(req)

    // Authorization: User must have rco-user or rco-power-user role
    if (!canManagePasswords(roleIds)) {
      return res.status(403).json({
        message: 'Insufficient permissions. Password management requires rco-user or rco-power-user role.'
      })
    }

    const { fields: queryFields } = req.body
    queryFields.createdAt = new Date().toISOString()
    const { userId: targetUserId, newPassword } = queryFields

    // Prevent users from using this endpoint on themselves
    // (self-service password change should use /api/insert-password with last-5 password checks)
    if (callerId === targetUserId) {
      return res.status(403).json({
        message: 'Cannot reset your own password using this endpoint. Use the password change form instead.'
      })
    }

    mainDb = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))

    await passwordValidationSchema.validate(newPassword)

    queryFields.newPassword = bcrypt.hashSync(newPassword)

    updateUserPassword(mainDb, targetUserId, newPassword)
    res.status(201).json({
      message: 'User Password updated Successfully.'
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      error: error
    })
  } finally {
    if (mainDb) mainDb.close()
  }
}

module.exports = editPasswordController
