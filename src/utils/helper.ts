import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { DateTime } from 'luxon'

axios.defaults.withCredentials = true

export const transformProtectionValues = (
  data: Record<string, any>
): Record<string, any> => {
  const { catCave = '', catCode = '', catHandle = '', ...rest } = data
  const item = {
    ...rest,
    protectionString: `${catCode} ${catHandle} ${catCave}`
  }
  return item
}

export const checkIfUserIsActive = (user: _Users): boolean => {
  if (user.departedDate) {
    return DateTime.fromJSDate(new Date(user.departedDate)) > DateTime.now()
  }
  return true
}

const getIp = async (): Promise<string | undefined> => {
  try {
    const data = await axios.get(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000/api/ip'
        : '/api/ip'
    )
    return data.data?.ip
  } catch (error) {
    return undefined
  }
}

let clientIp: string | undefined

export const initialize = async (): Promise<void> => {
  if (!clientIp) {
    clientIp = await getIp()
  }
}

export const getClientIp = (): string | undefined => {
  return clientIp
}

export const checkIfDateHasPassed = (dateString: string): boolean => {
  const jsDate = new Date(dateString)
  const dateTime = DateTime.fromJSDate(jsDate)
  const currentDateTime = DateTime.local()
  return currentDateTime > dateTime
}

interface InsertPassword {
  password: string
  userId: number
}

export const insertAndUpdatePassword = async ({
  password,
  userId
}: InsertPassword): Promise<AxiosResponse> => {
  const res = await axios.post(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/insert-password'
      : '/api/insert-password',
    { fields: { password, userId } }
  )
  return res
}

interface ChangePassword {
  password: string
  currentPassword: string
  userId: number
}

export const changeAndUpdatePassword = async ({
  userId,
  password,
  currentPassword
}: ChangePassword): Promise<AxiosResponse> => {
  const res = await axios.post(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/insert-password'
      : '/api/insert-password',
    { fields: { userId, currentPassword, password } }
  )
  return res
}

interface DeleteUpdateBefore {
  userId: number
}
export const deleteUpdateBefore = async ({
  userId
}: DeleteUpdateBefore): Promise<AxiosResponse> => {
  console.log('In deleteUpdateBefore 1')
  const res = await axios.post(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/update-before'
      : '/api/update-before',
    { data: { userId } }
  )
  console.log('In deleteUpdateBefore 2')
  return res
}

interface EditPassword {
  newPassword: string
  userId: number
}
export const editUserPassowrd = async ({
  newPassword,
  userId
}: EditPassword): Promise<AxiosResponse> => {
  const url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/editpassword'
      : '/api/editpassword'
  const res = await axios.post(url, {
    fields: {
      newPassword,
      userId
    }
  })
  return res
}

interface ErrorDetails {
  message: string
  status: number
  data: any
}
export const getErrorDetails = (error: AxiosError): ErrorDetails => {
  if (error.response) {
    const { data, status, statusText } = error.response
    const message = `Error Code: ${status}, Message: ${
      (data as any)?.message || statusText
    }`

    return { message, status, data }
  } else if (error.request) {
    const status = error.request.status
    const message = `Error Code: ${status}, Message: No response received from the server.`
    return { message, status, data: null }
  } else {
    const message = `Error Code: 0, Message: ${error.message}`
    return { message, status: 0, data: null }
  }
}

export const isDateNotInPastDays = (
  isoDateString: string,
  diffDays: number
): boolean => {
  const dateToCheck = DateTime.fromISO(isoDateString)
  const currentDate = DateTime.now()
  return currentDate.diff(dateToCheck, 'days').days > diffDays
}

export const logout = async (): Promise<AxiosResponse> => {
  const res = await axios.get(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/auth/logout'
      : '/api/auth/logout'
  )
  return res
}

interface Login {
  password: string
  username: string
}

export const login = async ({
  password,
  username
}: Login): Promise<AxiosResponse> => {
  const res = await axios.post(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/login'
      : '/api/login',
    { password, username }
  )
  if (res.status === 200) {
    await getAccessToken({ password, username })
    return res
  } else {
    throw new Error('Login failed')
  }
}

export const getAccessToken = async ({
  password,
  username
}: Login): Promise<AxiosResponse> => {
  const res = await axios.post(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/auth/token/obtain'
      : '/api/auth/token/obtain',
    { fields: { password, username } }
  )
  return res
}

export const handleRefreshToken = async (): Promise<AxiosResponse> => {
  const res = await axios.get(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/auth/token/refresh'
      : '/api/auth/token/refresh'
  )
  return res
}

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const errorMessage = (error.response.data as any)?.message as string
      if (errorMessage === 'Invalid current password') {
        return await Promise.reject(error)
      }
      if (error.response.status === 401) {
        try {
          await handleRefreshToken()
          const originalRequest = error.config
          if (originalRequest) return await axios(originalRequest)
        } catch (refreshError) {
          return await Promise.reject(refreshError)
        }
      }
    }
    return await Promise.reject(error)
  }
)
