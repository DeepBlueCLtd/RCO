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

const generatedUsers = generateUsers(200)

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
): Promise<void> => {
  await localForage.clear()

  const user = typeof userId === 'undefined' ? users[0].id : userId
  const platforms = generatePlatform(isHigh === true ? 60 : 10, isHigh === true)
  const projects = generateProject(isHigh === true ? 60 : 10, user)

  const organisation = getActiveReferenceData('Organisation')

  const department = getActiveReferenceData('Department')

  const vaultLocation = getActiveReferenceData(
    'Vault Location',
    undefined,
    isHigh === true ? 100 : undefined,
    isHigh,
    5
  )

  const mediaType = getActiveReferenceData(
    'Media',
    undefined,
    isHigh === true ? 50 : undefined,
    isHigh,
    50
  )

  const protectiveMarking = getActiveReferenceData('Protective Marking', true)
  const addresses = getAddresses()

  const protectiveMarkingAuthority = getActiveReferenceData(
    'Protective Marking Authority'
  )

  const platformOriginator = getActiveReferenceData('Platform Originator')
  const catCode = getActiveReferenceData('Cat Code', true, 8)
  const catHandling = getActiveReferenceData('Cat Handling', true, 8)
  const catCave = getActiveReferenceData('Cat Cave', true, 8)
  const batches = generateBatch(
    isHigh === true ? 500 : 10,
    platforms.length,
    department.length,
    projects.length,
    organisation.length,
    protectiveMarking.length,
    catCode.length,
    catHandling.length,
    catCave.length,
    user,
    isHigh
  )

  const items: Item[] = []
  const numItems = isHigh === true ? Math.floor(Math.random() * 55) + 6 : 10

  batches.forEach((batch: Batch, index: number) => {
    const project = projects.find((project) => project.id === batch.project)
    if (project !== undefined) {
      items.push(
        ...generateItems(
          numItems,
          numItems * index,
          batches[index],
          vaultLocation.length,
          protectiveMarking.length,
          catCode.length,
          catHandling.length,
          catCave.length,
          user
        )
      )
    }
  })

  const randomItems = assignItemsToRandomActiveUser(
    isHigh === true ? generatedUsers : users,
    items
  )

  const audits: Audit[] = []
  const dispatches: Dispatch[] = []
  const destructions: Destruction[] = []

  const configDataItem: ConfigData = {
    projectName: 'Project',
    projectsName: 'Projects',
    fromAddress: 'Dept BB, Building CC, Department DD, Some Town, Some ZIP',
    protectionName: 'Protection',
    cat_code: 'Cat-Code',
    cat_handle: 'Cat-Handle',
    cat_cave: 'Cat-Cave'
  }
  const configData: ConfigData[] = [configDataItem]

  const defaultData: RCOStore = {
    users: encryptedUsers(isHigh),
    batches,
    items,
    platforms,
    projects,
    organisation,
    department,
    vaultLocation,
    mediaType,
    protectiveMarking,
    protectiveMarkingAuthority,
    platformOriginator,
    catCode,
    catHandling,
    catCave,
    audits,
    destructions,
    dispatches,
    addresses,
    configData
  }

  // push all the default data into resources in localForage
  for (const [key, value] of Object.entries(defaultData)) {
    if (key === constants.R_ITEMS) {
      localForage
        .setItem(`${constants.LOCAL_STORAGE_DB_KEY}${key}`, value)
        .then(async () => {
          const provider = await getDataProvider(false)
          if (provider !== undefined) {
            for (const userId in randomItems) {
              await provider.loanItems(randomItems[userId], Number(userId))
            }
          }
        })
        .catch(console.log)
    } else
      localForage
        .setItem(`${constants.LOCAL_STORAGE_DB_KEY}${key}`, value)
        .catch(console.log)
  }
}

export default loadDefaultData
