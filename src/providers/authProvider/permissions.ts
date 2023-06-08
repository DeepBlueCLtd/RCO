import * as constants from '../../constants'
type UserRoles = UserRole | 'user'

const permissions: Record<UserRoles, ResourcePermissions> = {
  user: {
    [constants.R_PROJECTS]: { read: true, write: false, delete: false },
    [constants.R_BATCHES]: { read: true, write: false, delete: false },
    [constants.R_ITEMS]: { read: true, write: false, delete: false },
    [constants.R_ADDRESSES]: { read: true, write: false, delete: false },
    'reference-data': { read: true, write: false, delete: false }
  },
  'rco-user': {
    [constants.R_PROJECTS]: { read: true, write: true, delete: false },
    [constants.R_BATCHES]: { read: true, write: true, delete: false },
    [constants.R_ITEMS]: { read: true, write: true, delete: false },
    [constants.R_USERS]: { read: true, write: true, delete: false },
    [constants.R_PLATFORMS]: { read: true, write: true, delete: false },
    [constants.R_VAULT_LOCATION]: { read: true, write: false, delete: false },
    [constants.R_ADDRESSES]: { read: true, write: true, delete: false },
    'reference-data': { read: true, write: false, delete: false }
  },
  'rco-power-user': {
    '*': { all: '*' }
  }
}

export default permissions

const generatePermission = (
  resourcePermission: Permission,
  mergedPermissions?: Permission
): Permission => {
  if (mergedPermissions == null) return resourcePermission

  if (mergedPermissions.all === '*' || resourcePermission.all === '*') {
    return { read: true, write: true, delete: true }
  }

  const read =
    typeof resourcePermission.read !== 'undefined' && resourcePermission.read
      ? true
      : mergedPermissions.read
  const write =
    typeof resourcePermission.write !== 'undefined' && resourcePermission.write
      ? true
      : mergedPermissions.write
  const deletePermission =
    typeof resourcePermission.delete !== 'undefined' &&
    resourcePermission.read === true
      ? true
      : mergedPermissions.delete

  return { read, write, delete: deletePermission }
}

function mergedPermission(
  permissions: ResourcePermissions[]
): ResourcePermissions {
  const results: ResourcePermissions = permissions[0]
  permissions.slice(1).forEach((permission) => {
    Object.entries(permission).forEach(([key, value]) => {
      results[key] = generatePermission(value, results[key])
    })
  })
  return results
}

export const getPermissionsByRoles = (
  roles: UserRoles[]
): ResourcePermissions => {
  if (roles.length === 0) return permissions[roles[0]]
  const userPermissions = roles.map((role) => permissions[role])
  return mergedPermission(userPermissions)
}

export const canAccess = (
  permissions: ResourcePermissions,
  resource: string,
  actions: Permission
): boolean => {
  if (typeof permissions === 'undefined') return false

  const resourcePermissions =
    typeof permissions[resource] !== 'undefined'
      ? permissions[resource]
      : typeof permissions['*'] !== 'undefined'
      ? permissions['*']
      : undefined

  if (typeof resourcePermissions === 'undefined') return false

  // check if user have * permissions
  if (resourcePermissions.all === '*') {
    return true
  } else if (
    actions.all === '*' &&
    resourcePermissions.read === true &&
    resourcePermissions.delete === true &&
    resourcePermissions.write === true
  ) {
    return true
  }

  return Object.keys(actions).every((key: string) => {
    const actionKey = key as keyof Permission
    const action = actions[actionKey]
    const resourceAction = resourcePermissions[actionKey]
    if (
      typeof action !== 'undefined' &&
      typeof resourceAction !== 'undefined'
    ) {
      return action === resourceAction
    }
    return false
  })
}
