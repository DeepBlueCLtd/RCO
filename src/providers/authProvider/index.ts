import { type AuthProvider, type DataProvider } from 'react-admin'
import constants from '../../constants'
import { AuditType, trackEvent } from '../../utils/audit'
import { decryptData, encryptData, generateSalt } from '../../utils/ecnryption'
export const getToken = (): string | null => {
  const JsonUser = localStorage.getItem(constants.TOKEN_KEY)
  if (JsonUser !== null) {
    const user = JSON.parse(JsonUser) as User & { salt: string }
    const decryptedData = decryptData(`${user.id}${user.salt}`)
    user.id = decryptedData.substring(
      0,
      decryptedData.length - user.salt.length
    )
    return JSON.stringify(user)
  } else return null
}

const setToken = (token: string): void => {
  localStorage.setItem(constants.TOKEN_KEY, token)
}

const removeToken = (): void => {
  localStorage.removeItem(constants.TOKEN_KEY)
}

const authProvider = (dataProvider: DataProvider): AuthProvider => {
  const audit = trackEvent(dataProvider)
  return {
    login: async ({ username, password }) => {
      const data = await dataProvider.getList('users', {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1 },
        filter: { name: username, password }
      })
      const user = data.data.find((item: any) => item.name === username)
      if (user !== undefined) {
        if (user.password === password) {
          const id: number = user.id
          const salt = generateSalt()
          user.id = encryptData(`${id}${salt}`)
          user.salt = salt
          const token = JSON.stringify(user)
          setToken(token)
          await audit(AuditType.LOGIN, 'Logged in')
          return await Promise.resolve(data)
        } else {
          throw new Error('Wrong password')
        }
      } else {
        throw new Error('Wrong username')
      }
    },
    logout: async (): Promise<void> => {
      await audit(AuditType.LOGOUT, 'Logged out')
      removeToken()
      await Promise.resolve()
    },
    checkAuth: async (): Promise<void> => {
      const token = getToken()
      token !== null
        ? await Promise.resolve()
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
      const token = getToken()
      if (token !== null) {
        return JSON.parse(token)
      }
    },

    getPermissions: async () => {
      try {
        const token = getToken()
        if (token != null) {
          const user = JSON.parse(token)
          const isAdmin = user.adminRights as boolean
          return await Promise.resolve(isAdmin ? 'admin' : 'user')
        } else {
          throw new Error('You are not a registered user.')
        }
      } catch (error) {
        await Promise.resolve()
      }
    }
  }
}

export default authProvider
