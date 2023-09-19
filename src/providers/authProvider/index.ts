import {
  type UserIdentity,
  type AuthProvider,
  type DataProvider
} from 'react-admin'
import * as constants from '../../constants'
import { trackEvent } from '../../utils/audit'
import { AuditType } from '../../utils/activity-types'
import { decryptData, encryptData, generateSalt } from '../../utils/encryption'
import { getPermissionsByRoles } from './permissions'
import bcrypt from 'bcryptjs'
import { type AuditFunctionType } from '../dataProvider/dataprovider-utils'

export const getUser = (): User | undefined => {
  const encryptedUser = getCookie(constants.TOKEN_KEY)
  const salt = getCookie(constants.SALT)
  if (encryptedUser && salt) {
    const decryptedData = decryptData(encryptedUser)
    return JSON.parse(
      decryptedData.substring(0, decryptedData.length - salt.length)
    )
  }
  return undefined
}

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split('; ')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=')
    if (cookie[0] === name) {
      return decodeURIComponent(cookie[1])
    }
  }
  return null
}

const setToken = (token: string, salt: string): void => {
  const date = new Date()
  date.setTime(date.getTime() + 1 * 60 * 60 * 1000)
  const expires = date.toUTCString()
  document.cookie = `${constants.TOKEN_KEY}=${token}; expires=${expires}; path=/ `
  document.cookie = `${constants.SALT}=${salt}; expires=${expires}; path=/`
}

export const removeToken = (): void => {
  removeCookie(constants.TOKEN_KEY)
  removeCookie(constants.SALT)
}

const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
}

const createUserToken = async (
  user: User,
  audit: AuditFunctionType
): Promise<void> => {
  const clonedUser: User = {
    ...user
  }
  delete clonedUser.password
  const salt = generateSalt()
  const token = encryptData(`${JSON.stringify(clonedUser)}${salt}`)
  setToken(token, salt)
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

const authProvider = (dataProvider: DataProvider): AuthProvider => {
  const audit = trackEvent(dataProvider)
  return {
    login: async ({ staffNumber, password }) => {
      const data = await dataProvider.getList(constants.R_USERS, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1 },
        filter: { staffNumber }
      })
      const user = data.data.find(
        (item: any) => item.staffNumber === staffNumber
      )
      if (user !== undefined) {
        if (user.password && bcrypt.compareSync(password, user.password)) {
          await createUserToken(user, audit)
          return await Promise.resolve(data)
        } else if (!user.password && password === user.staffNumber) {
          await createUserToken(user, audit)
        } else {
          throw new Error('Wrong password')
        }
      } else {
        throw new Error('Wrong username')
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
      removeToken()
      await Promise.resolve()
    },
    checkAuth: async (): Promise<void> => {
      // await Promise.resolve()
      const token = getUser()
      token !== undefined
        ? await Promise.resolve(true)
        : await Promise.reject(new Error('Token not found'))
    },
    checkError: async (error): Promise<any> => {
      const status = error.status
      if (status === 401 || status === 403) {
        removeToken()
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
          const permissions = getPermissionsByRoles(user.role)
          return await Promise.resolve(permissions)
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
