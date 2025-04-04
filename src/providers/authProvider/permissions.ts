import axios, { type AxiosResponse } from 'axios'
import * as constants from '../../constants'
const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''

const getRoleId = async (role: string): Promise<number | undefined> => {
  return await axios
    .get(`${BASE_URL}/api/tables/_roles/rows?_filters=name:${role}`)
    .then((res) => res.data.data?.[0]?.id)
}

const getPermissionsByRoleId = async (
  roleId: number
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/tables/_roles_permissions/rows?_filters=role_id:${roleId}&_limit=100`
    )
    return response
  } catch (error) {
    return await Promise.reject(error)
  }
}

interface DBPermissionType {
  id: number
  role_id: number
  table_name: string
  create: string
  update: string
  read: string
  delete: string
  createdAt: string
  updatedAt: string
}

const mapPermissions = (
  permissions: DBPermissionType[]
): ResourcePermissions => {
  const mappedPermissions = permissions.reduce((acc: any, permission: any) => {
    acc[permission.table_name] = {
      read: !!permission.read,
      write: !!permission.create,
      delete: !!permission.delete
    }
    return acc
  }, {})
  const foundItemPermissions = permissions.find(
    (item: { table_name: string }) => item.table_name === 'item'
  )
  if (foundItemPermissions) {
    const { create, read, update, delete: del } = foundItemPermissions
    mappedPermissions[constants.R_ALL_ITEMS] = {
      read,
      create,
      update,
      delete: del
    }
  }

  mappedPermissions['welcome-page'] = { read: true }
  if (permissions[0]?.role_id === 3) {
    mappedPermissions['reference-data'] = {
      read: true,
      write: true,
      delete: false
    }
  } else if (permissions[0]?.role_id === 2) {
    mappedPermissions['reference-data'] = {
      read: true,
      write: false,
      delete: false
    }
  } else if (permissions[0]?.role_id === 1) {
    mappedPermissions['reference-data'] = {
      read: false,
      write: false,
      delete: false
    }
  }

  return mappedPermissions
}

export const getPermissionsByRoles = async (
  userRole: string
): Promise<ResourcePermissions> => {
  const roleId = await getRoleId(userRole)
  if (roleId === undefined) {
    throw new Error('Role ID is undefined')
  }
  const fetchedPermissions = (await getPermissionsByRoleId(roleId)).data.data
  return mapPermissions(fetchedPermissions as DBPermissionType[])
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
    !!resourcePermissions.read &&
    !!resourcePermissions.delete &&
    !!resourcePermissions.write
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
