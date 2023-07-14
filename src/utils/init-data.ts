import users from '../providers/dataProvider/defaults/users'
import { generateSalt, encryptData } from './encryption'
import { generateUsers } from './generateData'
import { ID_FIX } from '../constants'
import { DateTime } from 'luxon'
import { getDataProvider } from '../providers/dataProvider'
import { type DataProvider } from 'react-admin'

const generatedUsers = [...generateUsers(200), ...users]

export const encryptedUsers = (isHigh?: boolean): User[] => {
  const userList = isHigh === true ? generatedUsers : users
  const mappedUsers = userList.map((user) => {
    const salt: string = generateSalt()
    const userPassword: string = user.password
    const updatedUser = {
      ...user,
      salt,
      password: encryptData(`${userPassword}${salt}`)
    }
    return updatedUser
  })
  return mappedUsers
}

interface GetActiveRefData {
  nameVal: string
  alternateInactive?: boolean
  length?: number
  isHigh?: boolean
  inActivePercentage?: number
  resource?: string
}

export const getActiveReferenceData = <T>({
  nameVal,
  alternateInactive = false,
  length = 5,
  isHigh,
  inActivePercentage,
  resource = ''
}: GetActiveRefData): T[] => {
  return Array(length)
    .fill('')
    .map((_, index): T => {
      const active =
        isHigh === true && inActivePercentage !== undefined
          ? index > inActivePercentage * length
          : alternateInactive
          ? index % 2 === 0
          : index === 0

      const idPostFix = ID_FIX?.[resource]

      const id =
        typeof idPostFix !== 'undefined'
          ? `${index + 1}-${idPostFix}`
          : index + 1

      return {
        id,
        name: nameVal + ':' + String(index + 1),
        active
      } as any as T
    })
}

export const getAddresses = (
  alternateInactive = true,
  length = 5,
  isHigh?: boolean,
  inActivePercentage?: number
): Address[] => {
  return Array(length)
    .fill('')
    .map((_, index): Address => {
      const active =
        isHigh === true && inActivePercentage !== undefined
          ? index > inActivePercentage * length
          : alternateInactive
          ? index % 2 === 0
          : index === 0
      const ctr = index + 1
      return {
        id: index + 1,
        fullAddress: `${ctr} Some St, Some Town, Some County, DD${ctr} ${ctr}EF`,
        createdAt: DateTime.now().toISO() ?? '',
        Remarks: '',
        active
      }
    })
}

const loadDefaultData = async (): Promise<DataProvider> => {
  const dataprovider: DataProvider = await getDataProvider()

  return dataprovider
}

export default loadDefaultData
