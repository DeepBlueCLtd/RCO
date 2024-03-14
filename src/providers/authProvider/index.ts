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
import {
  getErrorDetails,
  login,
  checkIfDateHasPassed
} from '../../utils/helper'
import { isAxiosError } from 'axios'
import bcrypt from 'bcryptjs'

export const getUser = (): User | undefined => {
  const encryptedUser = getCookie(constants.TOKEN_KEY)
  if (encryptedUser) {
    const decryptedData = decryptData(encryptedUser)
    return JSON.parse(decryptedData)
  }
  return undefined
}

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const items = cookie.split('=')
    if (items[0] === name) {
      return decodeURIComponent(items[1])
    }
  }
  return null
}

const setToken = (token: string): void => {
  const date = new Date()
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
  const expires = date.toUTCString()
  document.cookie = `${constants.TOKEN_KEY}=${token}; expires=${expires}; path=/ `
}

export const removeUserToken = (): void => {
  removeCookie(constants.TOKEN_KEY)
}

const removeCookie = (name: string): void => {
  // note: setting the expiry date of a cookie to a past data effectively
  // removes it
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
}

const createUserToken = async (
  user: User,
  audit: AuditFunctionType
): Promise<void> => {
  const clonedUser: User = {
    ...user
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

const updateLockouAttempts = async (
  val: number,
  dataProvider: DataProvider,
  previousData: User
): Promise<void> => {
  await dataProvider.update<User>(constants.R_USERS, {
    id: previousData.id,
    data: { lockoutAttempts: val },
    previousData
  })
}

const authProvider = (dataProvider: DataProvider): AuthProvider => {
  const audit = trackEvent(dataProvider)
  return {
    login: async ({ staffNumber, password }) => {
      if (process.env.MOCK) {
        const data = await dataProvider.getList<User>(constants.R_USERS, {
          sort: { field: 'id', order: 'ASC' },
          pagination: { page: 1, perPage: 1 },
          filter: { staffNumber }
        })
        const user = data.data.find(
          (item: any) => item.staffNumber === staffNumber
        )
        if (user !== undefined) {
          const hasUserDeparted =
            user.departedDate !== undefined &&
            user.departedDate !== null &&
            checkIfDateHasPassed(user.departedDate)

          if (user.lockoutAttempts >= 5) {
            throw new Error(
              `Your account is locked. Please contact your administrator (' ${user.lockoutAttempts} ')`
            )
          }

          if (
            user.hashed_password &&
            bcrypt.compareSync(password, user.hashed_password) &&
            !hasUserDeparted
          ) {
            await updateLockouAttempts(0, dataProvider, user)
            await createUserToken(user, audit)
            return await Promise.resolve(data)
          } else if (
            !user.hashed_password &&
            password === user.username &&
            !hasUserDeparted
          ) {
            await updateLockouAttempts(0, dataProvider, user)
            await createUserToken(user, audit)
          } else if (hasUserDeparted) {
            throw new Error('User has departed organisation')
          } else {
            await updateLockouAttempts(
              user.lockoutAttempts + 1,
              dataProvider,
              user
            )
            throw new Error('Wrong password')
          }
        } else {
          throw new Error('Wrong username')
        }
      } else {
        try {
          const res = await login({ password, staffNumber })
          await createUserToken(res.data.data, audit)
          sessionStorage.setItem('login', 'true')
          return await Promise.resolve(res.data.data)
        } catch (error) {
          if (isAxiosError(error))
            throw new Error(getErrorDetails(error).message)
          throw new Error((error as Error).message)
        }
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
      // await Promise.resolve()
      const token = getUser()
      token !== undefined
        ? await Promise.resolve(true)
        : await Promise.reject(new Error('Token not found'))
    },
    checkError: async (error): Promise<any> => {
      const status = error.status
      if (status === 401 || status === 403) {
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
