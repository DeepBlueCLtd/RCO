import { DateTime } from 'luxon'
import { nowDate } from '../providers/dataProvider/dataprovider-utils'
import * as constants from '../constants'
import { ID_FIX } from '../constants'
import { type DataProvider } from 'react-admin'

const skipStartDate = (): boolean => {
  return Math.random() < 0.05
}

const skipEndDate = (): boolean => {
  return Math.random() < 0.05
}

export function generateRandomNumber(min: number, max: number): number {
  const array = new Uint32Array(1)
  const generatedRandomNumber = window.crypto.getRandomValues(array)
  const randomNumber = generatedRandomNumber[0] / (Math.pow(2, 32) - 1)
  const scaledRandomNumber = randomNumber * (max - min) + min
  const randomInteger = Math.floor(scaledRandomNumber)
  return randomInteger
}

export function generateRandomDate(): [DateTime, DateTime] {
  const startYear = 2020
  const endYear = 2023
  const randomStartYear = generateRandomNumber(startYear, endYear)
  const randomStartMonth = generateRandomNumber(1, 12)
  const randomStartDay = generateRandomNumber(1, 28)
  const randomStartDate = DateTime.fromObject({
    year: randomStartYear,
    month: randomStartMonth,
    day: randomStartDay
  })
  const endWeeks = generateRandomNumber(4, 10)
  const endDate = randomStartDate.plus({ weeks: endWeeks })
  return [randomStartDate, endDate]
}

export function generateRandomDateInRange(
  startDate: Date,
  endDate: Date
): string {
  const luxonStartDate = DateTime.fromJSDate(startDate)
  const luxonEndDate = DateTime.fromJSDate(endDate)
  const rangeInMs = luxonEndDate.toMillis() - luxonStartDate.toMillis()
  const maxDurationMs = 10 * 24 * 60 * 60 * 1000
  const durationMs = Math.min(rangeInMs, generateRandomNumber(0, maxDurationMs))
  const randomDate = luxonStartDate.plus({ milliseconds: durationMs })
  return randomDate.toJSDate().toString()
}

function generateDateForEnduringProjects(): {
  startDate: string
  endDate: string
} {
  const startYear = 1980
  const endYear = 2060

  const startDate = DateTime.fromObject({
    year: startYear,
    month: 1,
    day: 1
  }).toMillis()

  const endDate = DateTime.fromObject({
    year: endYear,
    month: 12,
    day: 31
  }).toMillis()

  const randomTimestamp = Math.random() * (endDate - startDate) + startDate
  const randomStartDate = DateTime.fromMillis(randomTimestamp)
  const randomDays = Math.floor(Math.random() * 3650) + 1
  const randomEndDate = randomStartDate.plus({ days: randomDays })

  return {
    startDate: randomStartDate.toString(),
    endDate: randomEndDate.toString()
  }
}

function setMinuteToStep(date: string, step = 15): string {
  const luxonDate = DateTime.fromJSDate(new Date(date))
  const updatedDate = luxonDate.minus({
    minute: luxonDate.minute % step,
    second: luxonDate.second
  })
  return updatedDate.toJSDate().toISOString()
}
const getItemReferenceNumber = (batch: Batch, items: Item[]): string => {
  const existing = items.filter((i) => i.batch === batch.id)
  return (existing.length + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
}

const generateBatchId = (year: number, batch: Batch[]): string => {
  const yearsFound = batch.filter((b) => b.yearOfReceipt === year)
  return (yearsFound.length + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
}

export const generatePlatform = (
  length: number,
  isHigh?: boolean
): Platform[] => {
  const platforms: Platform[] = []
  const inActivePercentage = 0.2
  for (let i = 1; i <= length; i++) {
    const isActive =
      isHigh === true ? i > length * inActivePercentage : i < 5 || i >= 9
    const newP: Omit<Platform, 'id'> = {
      name: `platform-${i}`,
      active: isActive
    }
    platforms.push(newP as Platform)
  }
  return platforms
}

export const generateProject = (
  length: number,
  user: number,
  offset: number
): Project[] => {
  const projects: Project[] = []
  for (let i = offset; i <= offset + length; i++) {
    const [startDate, endDate] = generateRandomDate()
    const obj: Project = {
      id: i,
      createdAt: nowDate(),
      name: `project-${i}`,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      remarks: `project-remarks-${i}`,
      createdBy: user,
      enduring: false,
      active: Math.random() > 0.4
    }
    projects.push(obj)
  }
  return projects
}

export const generateEnduringProjects = (
  names: string[],
  user: number
): Project[] => {
  const projects: Project[] = []
  const length = names.length
  for (let i = 0; i < length; i++) {
    const { startDate, endDate } = generateDateForEnduringProjects()
    const obj: Project = {
      id: i,
      createdAt: nowDate(),
      name: names[i],
      startDate,
      endDate,
      remarks: `project-remarks-${i}`,
      createdBy: user,
      enduring: true,
      active: true
    }
    projects.push(obj)
  }
  return projects
}

export const generateVault = (): Vault[] => {
  const vaults: Vault[] = [
    {
      id: 'VAULT',
      name: 'VAULT',
      active: true
    },
    {
      id: 'LEGACY',
      name: 'LEGACY',
      active: false
    }
  ]
  return vaults
}

// const getRandomDateInLast20Years = (): string[] => {
//   const randomStartDateInLast20Years = generateRandomDateInRange(
//     new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
//     new Date()
//   )

//   const randomEndDateInLast20Years = generateRandomDateInRange(
//     new Date(randomStartDateInLast20Years),
//     new Date()
//   )
//   return [randomStartDateInLast20Years, randomEndDateInLast20Years]
// }

export const generateBatch = (
  length: number,
  platforms: number,
  departments: number,
  projects: number,
  organisations: number,
  user: number
): Batch[] => {
  const batches: Batch[] = []

  const isNull = (): boolean => {
    return Math.random() > 0.3
  }

  for (let i = 1; i <= length; i++) {
    const year = generateRandomNumber(2020, 2023)

    const department = `${generateRandomNumber(1, departments - 1)}-${
      ID_FIX[constants.R_DEPARTMENT]
    }`

    const organisation = `${generateRandomNumber(1, organisations - 1)}-${
      ID_FIX[constants.R_ORGANISATION]
    }`

    const obj: Batch = {
      id: i,
      createdAt: nowDate(),
      batchNumber: `V${generateBatchId(year, batches)}/${year}`,
      yearOfReceipt: year,
      department,
      project: isNull() ? null : generateRandomNumber(1, projects - 1),
      platform: isNull() ? null : generateRandomNumber(1, platforms - 1),
      vault: Math.random() >= 0.5 ? 'LEGACY' : 'VAULT',
      organisation,
      remarks: `remarks-batch-${i}`,
      receiptNotes: `Reference-${i}`,
      createdBy: !isNull() ? null : user
    }
    batches.push(obj)
  }
  return batches
}

export const generateItems = (
  length: number,
  offset: number,
  batch: Batch,
  vaults: number,
  protectiveMarking: number,
  user: number,
  mediaType: number
): Item[] => {
  const items: Item[] = []

  for (let i = 1; i <= length; i++) {
    const skipStart = skipStartDate()
    const skip = skipEndDate()
    let start: DateTime | null = null
    let end: DateTime | null = null
    if (!skipStart && !skip) {
      ;[start, end] = skipEndDate() ? [null, null] : generateRandomDate()
    }

    const batchNumber: string = batch.batchNumber
    const itemReference: string = getItemReferenceNumber(batch, items)
    const idOfBatch = batch.id
    const obj: Item = {
      id: offset + i,
      createdAt: nowDate(),
      mediaType: generateRandomNumber(1, mediaType - 1),
      legacyMediaType: generateRandomNumber(1, mediaType - 1),
      batch: idOfBatch,
      itemNumber: `${batchNumber}/${itemReference}`,
      startDate:
        start === null ? start : setMinuteToStep(start.toJSDate().toString()),
      endDate: end === null ? end : setMinuteToStep(end.toJSDate().toString()),
      vaultLocation: skip ? null : generateRandomNumber(1, vaults - 1),
      remarks: `remarks-${i + 1}`,
      musterRemarks: `muster-remarks-${i + 1}`,
      protectiveMarking: generateRandomNumber(1, protectiveMarking - 1),
      consecSheets: `consec-sheets-${i + 1}`,
      createdBy: user,
      loanedDate: null,
      loanedTo: null,
      dispatchedDate: null,
      dispatchJob: null,
      destruction: null,
      destructionDate: null,
      protectionString: null
      // project: batch.project,
      // platform: batch.platform
    }
    items.push(obj)
  }
  return items
}
function getRandomRole(): UserRole {
  const roles: UserRole[] = ['rco-power-user', 'rco-user']
  const randomIndex = Math.floor(Math.random() * roles.length)
  const selectedRole = roles[randomIndex]

  return selectedRole
}

export const generateUsers = (length: number): User[] => {
  const users: User[] = []
  const inActivePercentage = 0.4
  for (let i = 0; i < length; i++) {
    const active = i > inActivePercentage * length
    const obj: User = {
      // to compensate default users the id has to start from 5
      id: i + 5,
      name: `user-${i + 1}`,
      password: 'user',
      adminRights: generateRandomNumber(0, 100) > 50,
      ...(active
        ? { departedDate: null }
        : { departedDate: generateRandomDate()[0].toString() }),
      staffNumber: `d:${i + 1}`,
      createdBy: generateRandomNumber(0, length - 1),
      role: getRandomRole(),
      createdAt: nowDate(),
      departedDate: null
    }
    users.push(obj)
  }
  return users
}

interface Params {
  project: Project[]
  platform: Platform[]
  item: Item[]
}

export const generateRichItems = async (
  dataProvider: DataProvider,
  data?: Params
): Promise<void> => {
  const params = {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'id', order: 'ASC' },
    filter: {}
  }
  const fetchedRichItems = (
    await dataProvider.getList<RichItem>(constants.R_RICH_ITEMS, params)
  ).data.map((item) => item.id)
  if (fetchedRichItems.length > 0)
    await dataProvider.deleteMany<RichItem>(constants.R_RICH_ITEMS, {
      ids: fetchedRichItems
    })

  const richItems: RichItem[] = []

  if (data === undefined) {
    const { data: fetchedItems } = await dataProvider.getList<Item>(
      constants.R_ITEMS,
      params
    )
    const { data: fetchedProjects } = await dataProvider.getList<Project>(
      constants.R_PROJECTS,
      params
    )
    const { data: fetchedPlatforms } = await dataProvider.getList<Platform>(
      constants.R_PLATFORMS,
      params
    )
    richItems.push(
      ...richItemsGenerate(fetchedItems, fetchedPlatforms, fetchedProjects)
    )
  } else {
    const { project, platform, item } = data
    richItems.push(...richItemsGenerate(item, platform, project))
  }

  const promises = richItems.map(async (richItem) => {
    await dataProvider.create<RichItem>(constants.R_RICH_ITEMS, {
      data: richItem
    })
  })

  try {
    await Promise.all(promises)
  } catch (error) {
    console.log(error)
  }
}

const richItemsGenerate = (
  items: Item[],
  platforms: Platform[],
  projects: Project[]
): RichItem[] => {
  const richItems: RichItem[] = []
  for (const item of items) {
    richItems.push({
      ...item,
      id: item.id,
      platform: generateRandomNumber(0, platforms.length),
      project: generateRandomNumber(0, projects.length)
    })
  }
  return richItems
}
