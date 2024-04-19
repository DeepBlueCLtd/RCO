const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const path = require('path')
const passwordValidationSchema = require('./password-validation.schema')

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
    mainDb = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))
    const { fields: queryFields } = req.body
    queryFields.createdAt = new Date().toISOString()
    const { userId, newPassword } = queryFields

    await passwordValidationSchema.validate(newPassword)

    queryFields.newPassword = bcrypt.hashSync(newPassword)

    updateUserPassword(mainDb, userId, newPassword)
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
