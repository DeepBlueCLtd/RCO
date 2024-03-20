import axios, { type AxiosResponse } from 'axios'
import * as constants from '../../constants'

const basePermissions = {
  [constants.R_PROJECTS]: { read: true, write: true, delete: false },
  [constants.R_BATCHES]: { read: true, write: true, delete: false },
  [constants.R_ITEMS]: { read: true, write: true, delete: false },
  [constants.R_ALL_ITEMS]: { read: true, write: true, delete: false },
  [constants.R_USERS]: { read: true, write: false, delete: false },
  [constants.R_PLATFORMS]: { read: true, write: false, delete: false },
  [constants.R_VAULT_LOCATION]: { read: true, write: false, delete: false },
  [constants.R_ADDRESSES]: { read: true, write: true, delete: false },
  [constants.R_DESTRUCTION]: { read: true, write: true, delete: false },
  [constants.R_DISPATCH]: { read: true, write: true, delete: false },
  'reference-data': { read: true, write: false, delete: false },
  'welcome-page': { read: true }
}

const permissions: Record<UserRole, ResourcePermissions> = {
  'rco-user': { ...basePermissions },
  'rco-power-user': {
    ...basePermissions,
    [constants.R_PLATFORMS]: { read: true, write: true, delete: false },
    [constants.R_USERS]: { read: true, write: true, delete: false },
    [constants.R_VAULT_LOCATION]: { read: true, write: true, delete: false },
    'reference-data': { read: true, write: true, delete: false }
  }
}

export default permissions

const getRoleId = async (role: UserRole): Promise<number | undefined> => {
  return await axios
    .get(`http://localhost:8000/api/tables/_roles/rows?_filters=name:${role}`)
    .then((res) => res.data.data?.[0]?.id)
}

const getPermissionsByRoleId = async (
  roleId: number
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(
    `http://localhost:8000/api/tables/_roles_permissions/rows?_filters=role_id:${roleId}`
  )
}

const mapPermissions = (permissions: any): ResourcePermissions => {
  const mappedPermissions = permissions.reduce((acc: any, permission: any) => {
    acc[permission.table_name] = {
      read: permission.read === 'true',
      write: permission.create === 'true',
      delete: permission.delete === 'true'
    }
    return acc
  }, {})
  console.log(mappedPermissions)
  mappedPermissions['welcome-page'] = { read: true }
  return mappedPermissions
}

export const getPermissionsByRoles = async (
  role: UserRole
): Promise<ResourcePermissions> => {
  const roleId = await getRoleId(role)
  if (roleId === undefined) {
    throw new Error('Role ID is undefined')
  }
  const fetchedPermissions = (await getPermissionsByRoleId(roleId)).data.data
  return mapPermissions(fetchedPermissions)
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
      : undefined

  if (typeof resourcePermissions === 'undefined') return false

  if (
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
