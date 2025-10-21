const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const path = require('path')
const { authenticateRequest, canManagePasswords } = require('./auth-helper')

const getUserById = (db, userId) => {
  const query = `
    SELECT createdAt, createdBy, departedDate, id, is_superuser, lastUpdatedAt, lockoutAttempts, name, updateBefore, username
    FROM _users
    WHERE id = ?;
  `
  return db.prepare(query).get(userId)
}

const clearUserUpdateBefore = (db, userId) => {
  const futureTimeString = ''
  const query = `
        UPDATE _users
        SET updateBefore = ?
        WHERE id = ?;
      `
  db.prepare(query).run(futureTimeString, userId)
}

const updateBeforeController = async (req, res) => {
  let mainDb
  try {
    // Authenticate the request and extract caller information
    const { userId: callerId, roleIds } = authenticateRequest(req)

    const { userId: targetUserId } = req.body.data

    // Dual-flow authorization:
    // Flow 1: Self-service - any user can clear their own password expiration
    // Flow 2: Admin - rco-user or rco-power-user can clear any user's password expiration
    const isSelfService = callerId === targetUserId
    const canManageOthersPasswords = canManagePasswords(roleIds)

    if (!isSelfService && !canManageOthersPasswords) {
      return res.status(403).json({
        message: 'Insufficient permissions. Can only clear your own password expiration unless you have rco-user or rco-power-user role.'
      })
    }

    mainDb = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))

    clearUserUpdateBefore(mainDb, targetUserId)
    const user = getUserById(mainDb, targetUserId)
    res.status(201).json({
      userDetails: user
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

module.exports = updateBeforeController
