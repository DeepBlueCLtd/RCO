import users from '../providers/dataProvider/defaults/users'
import { generateSalt, encryptData } from './encryption'
import {
  generatePlatform,
  generateProject,
  generateBatch,
  generateItems,
  generateRandomDateInRange,
  generateUsers
} from './generateData'
import * as constants from '../constants'
import localForage from 'localforage'
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

export const getActiveReferenceData = (
  nameVal: string,
  alternateInactive = false,
  length = 5,
  isHigh?: boolean,
  inActivePercentage?: number
): ActiveReferenceItem[] => {
  return Array(length)
    .fill('')
    .map((_, index): ActiveReferenceItem => {
      const active =
        isHigh === true && inActivePercentage !== undefined
          ? index > inActivePercentage * length
          : alternateInactive
          ? index % 2 === 0
          : index === 0
      return {
        id: index + 1,
        name: nameVal + ':' + String(index + 1),
        active
      }
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

const assignItemsToRandomActiveUser = (
  users: User[],
  items: Item[]
): Record<string, number[]> => {
  const activeUsers = users.filter((user) => user.active)
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

  const user = typeof userId === 'undefined' ? users[0].id : userId
  const platform = generatePlatform(isHigh === true ? 60 : 10, isHigh === true)
  const project = generateProject(isHigh === true ? 60 : 10, user)

  const organisation = getActiveReferenceData('Organisation')

  const department = getActiveReferenceData('Department')

  const vaultLocation = getActiveReferenceData(
    'Vault Location',
    undefined,
    isHigh === true ? 100 : undefined,
    isHigh,
    5
  )

  const mediaType = getActiveReferenceData('Media', true, 30)

  const protectiveMarking = getActiveReferenceData('Protective Marking', true)
  const address = getAddresses()

  const catCode = getActiveReferenceData('Cat Code', true, 8)
  const catHandling = getActiveReferenceData('Cat Handling', true, 8)
  const catCave = getActiveReferenceData('Cat Cave', true, 8)
  const batch = generateBatch(
    isHigh === true ? 500 : 10,
    platform.length,
    department.length,
    project.length,
    organisation.length,
    protectiveMarking.length,
    user,
    isHigh
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
  const dispatche: Dispatch[] = []
  const destruction: Destruction[] = []

  const configDataItem: ConfigData = {
    id: 0,
    projectName: 'Project_NNNN',
    projectsName: 'Projects_NNN',
    fromAddress: 'Dept BB, Building CC, Department DD, Some Town, Some ZIP_NNN',
    protectionName: 'Protection_NNN',
    cat_code: 'Cat-Code_NNN',
    cat_handle: 'Cat-Handle_NNN',
    cat_cave: 'Cat-Cave_NNN'
  }
  const configData: ConfigData[] = [configDataItem]

  const defaultData: RCOStore = {
    user: encryptedUsers(isHigh),
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
    catHandling,
    catCave,
    audit,
    destruction,
    dispatche,
    address,
    configData
  }

  const map: Record<string, constants.ResourceTypes> = {
    user: constants.R_USERS,
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
    catHandling: constants.R_CAT_HANDLING,
    catCave: constants.R_CAT_CAVE,
    audit: constants.R_AUDIT,
    destruction: constants.R_DESTRUCTION,
    dispatche: constants.R_DISPATCH,
    address: constants.R_ADDRESSES,
    configData: constants.R_CONFIG
  }

  const dataprovider: DataProvider = await getDataProvider(false)

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
          await dataprovider.create<typeof value>(map[key], {
            data: val
          })
        }
    }
  }
  return dataprovider
}

export default loadDefaultData
