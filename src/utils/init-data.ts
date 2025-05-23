import users from '../providers/dataProvider/defaults/users'
import {
  generatePlatform,
  generateProject,
  generateBatch,
  generateItems,
  generateRandomDateInRange,
  generateUsers,
  generateVault,
  generateEnduringProjects,
  generateRichItems
} from './generateData'
import * as constants from '../constants'
import { ID_FIX } from '../constants'
import localForage from 'localforage'
import { DateTime } from 'luxon'
import { getDataProvider } from '../providers/dataProvider'
import { type DataProvider } from 'react-admin'
import bcrypt from 'bcryptjs'
import { checkIfUserIsActive } from './helper'

const generatedUsers = [...generateUsers(200), ...users]

export const encryptedUsers = (isHigh?: boolean): _Users[] => {
  const userList = isHigh === true ? generatedUsers : users
  const mappedUsers = userList.map((user) => {
    return user.hashed_password
      ? {
          ...user,
          hashed_password: bcrypt.hashSync(user.hashed_password)
        }
      : user
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
        remarks: '',
        active
      }
    })
}

const assignItemsToRandomActiveUser = (
  users: _Users[],
  items: Item[]
): Record<string, number[]> => {
  const activeUsers = users.filter((user) => checkIfUserIsActive(user))
  const randomItems: Record<number, number[]> = {}

  for (const item of items) {
    if (Math.random() > 0.8) {
      const randomUser = users[Math.floor(Math.random() * activeUsers.length)]
      item.loanedTo = randomUser.id
      item.loanedDate = new Date(
        generateRandomDateInRange(
          DateTime.now().minus({ month: 3 }).toJSDate(),
          DateTime.now().toJSDate()
        )
      ).toISOString()

      if (!Object.prototype.hasOwnProperty.call(randomItems, randomUser.id)) {
        randomItems[randomUser.id] = [] as number[]
      }
      randomItems[randomUser.id].push(item.id)
    }
  }

  return randomItems
}

const loadDefaultData = async (
  userId?: number,
  isHigh?: boolean
): Promise<DataProvider> => {
  await localForage.clear()

  const enduringProjectNames = [
    'RECYCLING (ENDURING)',
    'DESTRUCTION (ENDURING)',
    'TEST MEDIA (ENDURING)'
  ]

  const user = typeof userId === 'undefined' ? users[0].id : userId
  const platform = generatePlatform(isHigh === true ? 60 : 10, isHigh === true)
  const project: Project[] = []
  project.push(
    ...generateEnduringProjects(enduringProjectNames, user),
    ...generateProject(isHigh === true ? 100 : 60, user, 3)
  )

  const vault = generateVault()

  const organisation = getActiveReferenceData<StringReferenceItem>({
    nameVal: 'Organisation',
    resource: constants.R_ORGANISATION
  })

  const department = getActiveReferenceData<StringReferenceItem>({
    nameVal: 'Department',
    resource: constants.R_DEPARTMENT
  })

  const vaultLocationCore = getActiveReferenceData<IntegerReferenceItem>({
    nameVal: 'Vault Location',
    length: isHigh === true ? 200 : 50,
    alternateInactive: true,
    isHigh
  })

  const vaultLocation: VaultLocation[] = vaultLocationCore.map(
    (item): VaultLocation => {
      return {
        shelfSize: null,
        ...item
      }
    }
  )

  const mediaTypeCore = getActiveReferenceData<IntegerReferenceItem>({
    nameVal: 'Media',
    alternateInactive: true,
    length: 30
  })
  const mediaType: MediaType[] = mediaTypeCore.map((item): MediaType => {
    return {
      itemSize: Math.floor(Math.random() * 10),
      ...item
    }
  })
  const protectiveMarking = getActiveReferenceData<IntegerReferenceItem>({
    nameVal: 'Protective Marking',
    alternateInactive: true
  })
  const address = getAddresses()

  const protectionFieldParams = {
    alternateInactive: true,
    length: 8
  }

  const catCode = getActiveReferenceData<StringReferenceItem>({
    ...protectionFieldParams,
    nameVal: 'Cat Code',
    resource: constants.R_CAT_CODE
  })
  const catHandle = getActiveReferenceData<StringReferenceItem>({
    ...protectionFieldParams,
    nameVal: 'Cat Handle',
    resource: constants.R_CAT_HANDLE
  })
  const catCave = getActiveReferenceData<StringReferenceItem>({
    ...protectionFieldParams,
    nameVal: 'Cat Cave',
    resource: constants.R_CAT_CAVE
  })
  const batch = generateBatch(
    isHigh === true ? 500 : 10,
    platform.length,
    department.length,
    project.length,
    organisation.length,
    user
  )

  const item: Item[] = []
  const numItems = isHigh === true ? Math.floor(Math.random() * 55) + 6 : 10

  batch.forEach((batch2: Batch, index: number) => {
    const project3 = project.find((project2) => project2.id === batch2.project)
    if (project3 !== undefined) {
      item.push(
        ...generateItems(
          numItems,
          numItems * index,
          batch[index],
          vaultLocation.length,
          protectiveMarking.length,
          user,
          mediaType.length
        )
      )
    }
  })

  const randomItems = assignItemsToRandomActiveUser(
    isHigh === true ? generatedUsers : users,
    item
  )

  const audit: Audit[] = []
  const dispatch: Dispatch[] = []
  const destruction: Destruction[] = []

  const configDataItem: ConfigData = {
    id: 0,
    projectName: 'Projject',
    projectsName: 'Projjects',
    fromAddress: 'Dept AA, Building BB, Department CC, Some Town, Some ZIP',
    protectionName: 'Prottection',
    catCode: 'Catt-Code',
    catHandle: 'Catt-Handle',
    catCave: 'Catt-Cave',
    headerMarking: 'HEADER-MARKING',
    reportPrefix: 'DBC/VAL'
  }
  const configData: ConfigData[] = [configDataItem]
  const defaultData: Omit<RCOStore, 'richItem'> = {
    _users: encryptedUsers(isHigh),
    batch,
    item,
    platform,
    project,
    organisation,
    department,
    vaultLocation,
    mediaType,
    protectiveMarking,
    catCode,
    catHandle,
    catCave,
    audit,
    destruction,
    dispatch,
    address,
    configData,
    vault,
    itemCode: [],
    itemCave: [],
    itemHandle: [],
    batchCode: [],
    batchCave: [],
    batchHandle: []
  }
  const map: Record<string, constants.ResourceTypes> = {
    _users: constants.R_USERS,
    batch: constants.R_BATCHES,
    item: constants.R_ITEMS,
    platform: constants.R_PLATFORMS,
    project: constants.R_PROJECTS,
    organisation: constants.R_ORGANISATION,
    department: constants.R_DEPARTMENT,
    vaultLocation: constants.R_VAULT_LOCATION,
    mediaType: constants.R_MEDIA_TYPE,
    protectiveMarking: constants.R_PROTECTIVE_MARKING,
    catCode: constants.R_CAT_CODE,
    catHandle: constants.R_CAT_HANDLE,
    catCave: constants.R_CAT_CAVE,
    audit: constants.R_AUDIT,
    destruction: constants.R_DESTRUCTION,
    dispatch: constants.R_DISPATCH,
    address: constants.R_ADDRESSES,
    configData: constants.R_CONFIG,
    vault: constants.R_VAULT
  }

  const dataprovider: DataProvider = await getDataProvider(
    false,
    !!process.env.MOCK
  )

  await dataprovider.create<LoanUser>(constants.R_LOAN_USERS, {
    data: []
  })

  for (const [key, value] of Object.entries(defaultData)) {
    if (map[key] !== undefined) {
      if (key === constants.R_ITEMS) {
        for (const val of value) {
          await dataprovider.create<Item>(constants.R_ITEMS, { data: val })
        }
        for (const userId in randomItems) {
          await dataprovider.loanItems(randomItems[userId], Number(userId))
        }
      } else
        for (const val of value) {
          await dataprovider.create<(typeof value)[0]>(map[key], {
            data: val
          })
        }
    }
  }

  await generateRichItems(dataprovider, {
    project,
    platform,
    item,
    department,
    vault
  })

  return dataprovider
}

export default loadDefaultData
