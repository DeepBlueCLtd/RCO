import axios, { type AxiosResponse } from 'axios'
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

export const checkIfUserIsActive = (user: User): boolean => {
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
    console.log(error)
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

export const insertPassword = async ({
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
