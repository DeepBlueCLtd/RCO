import * as constants from '../../constants'
type UserRoles = UserRole | 'user'

const permissions: Record<UserRoles, ResourcePermissions> = {
  user: {
    [constants.R_PROJECTS]: { read: true, write: false, delete: false },
    [constants.R_BATCHES]: { read: true, write: false, delete: false },
    [constants.R_ITEMS]: { read: true, write: false, delete: false },
    [constants.R_ADDRESSES]: { read: true, write: false, delete: false },
    [constants.R_ALL_ITEMS]: { read: true, write: false, delete: false },
    'reference-data': { read: false, write: false, delete: false }
  },
  'rco-user': {
    [constants.R_PROJECTS]: { read: true, write: true, delete: false },
    [constants.R_BATCHES]: { read: true, write: true, delete: false },
    [constants.R_ITEMS]: { read: true, write: true, delete: false },
    [constants.R_USERS]: { read: true, write: true, delete: false },
    [constants.R_PLATFORMS]: { read: true, write: false, delete: false },
    [constants.R_VAULT_LOCATION]: { read: true, write: false, delete: false },
    [constants.R_ADDRESSES]: { read: true, write: true, delete: false },
    [constants.R_DESTRUCTION]: { read: true, write: true, delete: false },
    [constants.R_DISPATCH]: { read: true, write: true, delete: false },
    'reference-data': { read: true, write: false, delete: false }
  },
  'rco-power-user': {
    '*': { all: '*' }
  }
}

export default permissions

export const getPermissionsByRoles = (role: UserRoles): ResourcePermissions => {
  const userPermissions = permissions[role]
  return userPermissions
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
