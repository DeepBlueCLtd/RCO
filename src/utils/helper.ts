import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { DateTime } from 'luxon'

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
  password,
  currentPassword,
  userId
}: ChangePassword): Promise<AxiosResponse> => {
  const res = await axios.post(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/changepassword'
      : '/api/changepassword',
    { fields: { userId, password, currentPassword } }
  )
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

interface Login {
  password: string
  staffNumber: string
}

export const login = async ({
  password,
  staffNumber
}: Login): Promise<AxiosResponse> => {
  const res = await axios.post(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/login'
      : '/api/login',
    { hashed_password: password, username: staffNumber }
  )
  return res
}
