import { type AuthProvider, type DataProvider } from 'react-admin'
import constants from '../../constants'
import { AuditType, trackEvent } from '../../utils/audit'
import { decryptData, encryptData } from '../../utils/ecnryption'
const salt =
  (import.meta.env.SALT as string) ?? '6d090796-ecdf-11ea-adc1-0242ac112345'
export const getToken = (): string | null => {
  const user = decryptData(localStorage.getItem(constants.TOKEN_KEY), salt)
  return user
}

const setToken = (token: string): void => {
  const secureToken = encryptData(token, salt)
  localStorage.setItem(constants.TOKEN_KEY, secureToken)
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
