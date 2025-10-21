const jwt = require('jsonwebtoken')

/**
 * Authenticates a request by verifying the JWT token in cookies
 * @param {object} req - Express request object
 * @returns {object} - { userId, roleIds } extracted from JWT
 * @throws {Error} - If token is missing or invalid
 */
const authenticateRequest = (req) => {
  const token = req.cookies.accessToken

  if (!token) {
    throw new Error('No authentication token provided')
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)
    return {
      userId: payload.userId,
      roleIds: payload.roleIds || []
    }
  } catch (error) {
    throw new Error('Invalid or expired authentication token')
  }
}

/**
 * Checks if user has a specific role
 * @param {number[]} roleIds - Array of role IDs from JWT
 * @param {number} requiredRoleId - Required role ID
 * @returns {boolean} - True if user has the role
 */
const hasRole = (roleIds, requiredRoleId) => {
  return roleIds.includes(requiredRoleId)
}

/**
 * Checks if user can manage passwords (requires rco-user or rco-power-user role)
 * @param {number[]} roleIds - Array of role IDs from JWT
 * @returns {boolean} - True if user has rco-user (2) or rco-power-user (3) role
 */
const canManagePasswords = (roleIds) => {
  return roleIds.includes(ROLES.RCO_USER) || roleIds.includes(ROLES.RCO_POWER_USER)
}

/**
 * Role ID constants matching database _roles table
 */
const ROLES = {
  DEFAULT: 1,          // Read-only access
  RCO_USER: 2,         // Operational user
  RCO_POWER_USER: 3    // Admin/power user
}

module.exports = {
  authenticateRequest,
  hasRole,
  canManagePasswords,
  ROLES
}
