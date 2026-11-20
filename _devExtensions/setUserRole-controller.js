const BS3Database = require('better-sqlite3')
const path = require('path')
const { authenticateRequest, ROLES } = require('./auth-helper')

// Role ids rank the roles: default (1) < rco-user (2) < rco-power-user (3).
// Superusers outrank every role.
const SUPERUSER_LEVEL = Number.MAX_SAFE_INTEGER

const isTrue = (value) =>
  value === 1 || value === true || String(value).toLowerCase() === 'true'

// A user's level: superuser, else their highest role, else 0 (no role)
const levelOf = (db, userId) => {
  const user = db
    .prepare('SELECT is_superuser FROM _users WHERE id = ?')
    .get(userId)
  if (!user) return undefined
  if (isTrue(user.is_superuser)) return SUPERUSER_LEVEL
  const row = db
    .prepare('SELECT MAX(role_id) AS level FROM _users_roles WHERE user_id = ?')
    .get(userId)
  return Number(row.level ?? 0)
}

/**
 * POST /api/set-user-role { fields: { userId, roleId } }
 *
 * Sets a user's role. Callers may only assign roles up to their own level,
 * and only to users at or below their own level.
 */
const setUserRoleController = (req, res) => {
  let db
  try {
    let callerId
    try {
      callerId = authenticateRequest(req).userId
    } catch (error) {
      return res.status(401).json({ message: error.message })
    }

    const fields = (req.body && req.body.fields) || {}
    const userId = Number(fields.userId)
    const roleId = Number(fields.roleId)
    if (!Number.isInteger(userId) || !Number.isInteger(roleId)) {
      return res.status(400).json({ message: 'userId and roleId are required.' })
    }

    db = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))

    if (!db.prepare('SELECT id FROM _roles WHERE id = ?').get(roleId)) {
      return res.status(400).json({ message: 'Unknown role.' })
    }

    const callerLevel = levelOf(db, callerId) ?? 0
    if (callerLevel < ROLES.RCO_USER) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to set user roles.' })
    }
    if (roleId > callerLevel) {
      return res
        .status(403)
        .json({ message: 'You cannot assign a role above your own.' })
    }

    const targetLevel = levelOf(db, userId)
    if (targetLevel === undefined) {
      return res.status(404).json({ message: 'User not found.' })
    }
    if (targetLevel > callerLevel) {
      return res.status(403).json({
        message: 'You cannot change the role of a user above your own level.'
      })
    }

    const now = new Date().toISOString()
    const updated = db
      .prepare(
        'UPDATE _users_roles SET role_id = ?, updatedAt = ? WHERE user_id = ?'
      )
      .run(roleId, now, userId)
    if (updated.changes === 0) {
      db.prepare(
        'INSERT INTO _users_roles (user_id, role_id, createdAt, updatedAt) VALUES (?, ?, ?, ?)'
      ).run(userId, roleId, now, now)
    }

    return res.status(200).json({ message: 'Role updated', userId, roleId })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  } finally {
    if (db) db.close()
  }
}

module.exports = setUserRoleController
