import { DateTime } from 'luxon'
import { nowDate } from '../providers/dataProvider/dataprovider-utils'
import * as constants from '../constants'
import { ID_FIX } from '../constants'

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

const generateBatchId = (year: string, batch: Batch[]): string => {
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

export const generateProject = (length: number, user: number): Project[] => {
  const projects: Project[] = []
  for (let i = 1; i <= length; i++) {
    const [startDate, endDate] = generateRandomDate()
    const obj: Project = {
      id: i,
      createdAt: nowDate(),
      name: `project-${i}`,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      remarks: `project-remarks-${i}`,
      createdBy: user
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
  protectiveMarking: number,
  user: number
): Batch[] => {
  const batches: Batch[] = []

  const isNull = (): boolean => {
    if (Math.random() > 0.3) {
      return false
    }
    return true
  }

  for (let i = 1; i <= length; i++) {
    const year = String(generateRandomNumber(2020, 2023))

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
      project: isNull() ? undefined : generateRandomNumber(1, projects - 1),
      platform: isNull() ? undefined : generateRandomNumber(1, platforms - 1),
      vault: Math.random() >= 0.5 ? 'LEGACY' : 'VAULT',
      organisation,
      protectiveMarking: generateRandomNumber(1, protectiveMarking - 1),
      remarks: `remarks-batch-${i}`,
      receiptNotes: `Reference-${i}`,
      createdBy: user
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
    const skipEnd = skipEndDate()
    let start: DateTime | null = null
    let end: DateTime | null = null
    if (!skipStart && !skipEnd) {
      ;[start, end] = skipEndDate() ? [null, null] : generateRandomDate()
    }

    const batchNumber: string = batch.batchNumber
    const itemReference: string = getItemReferenceNumber(batch, items)
    const idOfBatch = batch.id
    const obj: Item = {
      id: offset + i,
      createdAt: nowDate(),
      mediaType: generateRandomNumber(1, mediaType - 1),
      batch: idOfBatch,
      itemNumber: `${batchNumber}/${itemReference}`,
      startDate:
        start === null ? start : setMinuteToStep(start.toJSDate().toString()),
      endDate: end === null ? end : setMinuteToStep(end.toJSDate().toString()),
      vaultLocation: generateRandomNumber(1, vaults - 1),
      remarks: `remarks-${i + 1}`,
      musterRemarks: `muster-remarks-${i + 1}`,
      protectiveMarking: generateRandomNumber(1, protectiveMarking - 1),
      consecPages: `consec-pages-${i + 1}`,
      createdBy: user
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
      active,
      staffNumber: `d:${i + 1}`,
      createdBy: generateRandomNumber(0, length - 1),
      role: getRandomRole(),
      createdAt: nowDate()
    }
    users.push(obj)
  }
  return users
}
