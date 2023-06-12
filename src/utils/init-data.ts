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
import { type DataProvider } from 'react-admin'

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

const assignItemsToRandomActiveUser = async (
  users: User[],
  items: Item[],
  provider: DataProvider & CustomDataProvider
): Promise<void> => {
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
  for (const userId in randomItems) {
    await provider.loanItems(randomItems[userId], Number(userId))
  }
}

const loadDefaultData = async (
  userId?: number,
  provider?: DataProvider & CustomDataProvider,
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

  const protectiveMarkingAuthority = getActiveReferenceData(
    'Protective Marking Authority'
  )

  const platformOriginator = getActiveReferenceData('Platform Originator')

  const batches = generateBatch(
    isHigh === true ? 500 : 10,
    platforms.length,
    department.length,
    projects.length,
    organisation.length,
    protectiveMarking.length,
    user
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
          user
        )
      )
    }
  })

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
    platformOriginator
  }

  // push all the default data into resources in localForage
  for (const [key, value] of Object.entries(defaultData)) {
    localForage
      .setItem(`${constants.LOCAL_STORAGE_DB_KEY}${key}`, value)
      .catch(console.log)
  }

  if (provider !== undefined)
    await assignItemsToRandomActiveUser(generatedUsers, items, provider)
}

export default loadDefaultData
