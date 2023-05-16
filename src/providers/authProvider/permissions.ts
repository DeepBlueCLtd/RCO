type UserRoles = UserRole | 'user'

const permissions: Record<UserRoles, ResourcePermissions> = {
  user: {
    projects: { read: true, write: false, delete: false },
    batches: { read: true, write: false, delete: false },
    items: { read: true, write: false, delete: false },
    'reference-data': { read: true, write: false, delete: false }
  },
  'rco-user': {
    projects: { read: true, write: true, delete: false },
    batches: { read: true, write: true, delete: false },
    items: { read: true, write: true, delete: false },
    users: { read: true, write: true, delete: false },
    platforms: { read: true, write: true, delete: false },
    'reference-data': { read: true, write: true, delete: false }
  },
  'rco-power-user': {
    '*': { all: '*' }
  }
}

export default permissions

const generatePermission = (
  permission1: Permission,
  permission2?: Permission
): Permission => {
  if (permission2 == null) return permission1

  if (permission2.all === '*' || permission1.all === '*') {
    return { read: true, write: true, delete: true }
  }

  const read =
    typeof permission1.read !== 'undefined' && permission1.read
      ? true
      : permission2.read
  const write =
    typeof permission1.write !== 'undefined' && permission1.write
      ? true
      : permission2.write
  const deletePermission =
    typeof permission1.delete !== 'undefined' && permission1.read === true
      ? true
      : permission2.delete

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
