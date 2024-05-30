import {
  type UserIdentity,
  type AuthProvider,
  type DataProvider
} from 'react-admin'
import * as constants from '../../constants'
import { trackEvent } from '../../utils/audit'
import { AuditType } from '../../utils/activity-types'
import { decryptData, encryptData } from '../../utils/encryption'
import { getPermissionsByRoles } from './permissions'
import { type AuditFunctionType } from '../dataProvider/dataprovider-utils'
import { getErrorDetails, login, logout } from '../../utils/helper'
import axios, { isAxiosError } from 'axios'

export const getUser = (): _UserWithRole | undefined => {
  const encryptedUser = getCookie(constants.ACCESS_TOKEN_KEY)
  if (encryptedUser) {
    const decryptedData = decryptData(encryptedUser)
    return JSON.parse(decryptedData)
  }
  return undefined
}

const getCookie = (name: string): string | null => {
  return localStorage.getItem(name)
}

const setToken = (token: string): void => {
  localStorage.setItem(constants.ACCESS_TOKEN_KEY, token)
}

export const removeUserToken = (): void => {
  void logout()
  removeLocalStorageItem(constants.ACCESS_TOKEN_KEY)
}

const removeLocalStorageItem = (key: string): void => {
  localStorage.removeItem(key)
}

const createUserToken = async (
  user: _Users,
  userRole: string,
  audit: AuditFunctionType
): Promise<void> => {
  const clonedUser: _UserWithRole = {
    ...user,
    userRole
  }
  delete clonedUser.hashed_password
  const token = encryptData(`${JSON.stringify(clonedUser)}`)
  setToken(token)
  await audit({
    activityType: AuditType.LOGIN,
    resource: constants.R_USERS,
    dataId: user.id,
    subjectId: null,
    subjectResource: null,
    securityRelated: null,
    activityDetail: null
  })
}

const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''
const fetchUser = async (username: string): Promise<any> => {
  const user = await axios.get(
    `${BASE_URL}/api/tables/_users/rows?_filters=username:${username}`
  )

  return user.data.data?.[0]
}

const fetchUserRoleId = async (userId: number): Promise<any> => {
  const userRoleId = await axios.get(
    `${BASE_URL}/api/tables/_users_roles/rows?_filters=user_id:${userId}`
  )
  const userValue =
    userRoleId.data.data[0]?.role_id === 2
      ? 'rco-user'
      : userRoleId.data.data[0]?.role_id === 3
      ? 'rco-power-user'
      : 'default'
  return userValue
}

const authProvider = (dataProvider: DataProvider): AuthProvider => {
  const audit = trackEvent(dataProvider)
  return {
    login: async ({
      username,
      password
    }: {
      username: string
      password: string
    }) => {
      try {
        await login({ password, username })
        const user: _UserWithRole = await fetchUser(username)
        const userRole: string = await fetchUserRoleId(user?.id)
        await createUserToken(user, userRole, audit)
        sessionStorage.setItem('login', 'true')
        return await Promise.resolve(user)
      } catch (error) {
        if (isAxiosError(error)) throw new Error(getErrorDetails(error).message)
        throw new Error((error as Error).message)
      }
    },
    logout: async (): Promise<void> => {
      const user = getUser()
      await audit({
        activityType: AuditType.LOGOUT,
        resource: constants.R_USERS,
        dataId: user?.id ?? null,
        subjectId: null,
        subjectResource: null,
        securityRelated: null,
        activityDetail: null
      })
      removeUserToken()
      await Promise.resolve()
    },
    checkAuth: async (): Promise<void> => {
      // NOTE: we just do superficial check of auth here,
      // because every backend interaction includes auth validation
      await Promise.resolve()
      const token = localStorage.getItem(constants.ACCESS_TOKEN_KEY)
      token !== undefined
        ? await Promise.resolve(true)
        : await Promise.reject(new Error('Token not found'))
    },
    checkError: async (error): Promise<any> => {
      const status = error.status
      if (status === 403) {
        removeUserToken()
        await Promise.reject(
          new Error('Server returned code ' + String(status))
        )
      }
      await Promise.resolve()
    },
    getIdentity: async () => {
      const user = getUser()
      if (user !== undefined) {
        const userIdentity: UserIdentity = { ...user, fullName: user.name }
        return userIdentity
      } else return await Promise.reject(new Error('user not found'))
    },

    getPermissions: async () => {
      try {
        const user = getUser()
        if (user !== undefined) {
          let permissions
          if (user.is_superuser) {
            permissions = {
              [constants.R_PROJECTS]: { read: true, write: true, delete: true },
              [constants.R_BATCHES]: { read: true, write: true, delete: true },
              [constants.R_ITEMS]: { read: true, write: true, delete: true },
              [constants.R_ALL_ITEMS]: {
                read: true,
                write: true,
                delete: true
              },
              [constants.R_USERS]: { read: true, write: true, delete: true },
              [constants.R_PLATFORMS]: {
                read: true,
                write: true,
                delete: true
              },
              [constants.R_VAULT_LOCATION]: {
                read: true,
                write: true,
                delete: true
              },
              [constants.R_ADDRESSES]: {
                read: true,
                write: true,
                delete: true
              },
              [constants.R_DESTRUCTION]: {
                read: true,
                write: true,
                delete: true
              },
              [constants.R_DISPATCH]: { read: true, write: true, delete: true },
              'reference-data': { read: true, write: true, delete: true },
              'welcome-page': { read: true }
            }
          } else {
            permissions = await getPermissionsByRoles(user.userRole)
          }
          return permissions
        } else {
          throw new Error('You are not a registered user.')
        }
      } catch (error) {
        throw new Error('You are not a registered user.')
      }
    }
  }
}

export default authProvider
