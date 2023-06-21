import { DateTime } from 'luxon'
import { nowDate } from '../providers/dataProvider/dataprovider-utils'

const MediaType = ['DVD', 'Tape', 'Paper']

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
  const existing = items.filter((i) => i.batchId === batch.id)
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

const getRandomDateInLast20Years = (): string[] => {
  const randomStartDateInLast20Years = generateRandomDateInRange(
    new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
    new Date()
  )

  const randomEndDateInLast20Years = generateRandomDateInRange(
    new Date(randomStartDateInLast20Years),
    new Date()
  )
  return [randomStartDateInLast20Years, randomEndDateInLast20Years]
}

export const generateBatch = (
  length: number,
  platforms: number,
  departments: number,
  projects: number,
  organisations: number,
  protectiveMarking: number,
  catCodes: number,
  catHandles: number,
  catCaves: number,
  user: number,
  isHigh?: boolean
): Batch[] => {
  const batches: Batch[] = []

  for (let i = 1; i <= length; i++) {
    const year = String(generateRandomNumber(2020, 2023))

    const [startDate, endDate] =
      isHigh !== undefined ? getRandomDateInLast20Years() : generateRandomDate()
    const obj: Batch = {
      id: i,
      createdAt: nowDate(),
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      batchNumber: `V${generateBatchId(year, batches)}/${year}`,
      yearOfReceipt: year,
      department: generateRandomNumber(1, departments - 1),
      project: generateRandomNumber(1, projects - 1),
      platform: generateRandomNumber(1, platforms - 1),
      organisation: generateRandomNumber(1, organisations - 1),
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
  catCodes: number,
  catHandles: number,
  catCaves: number,
  user: number
): Item[] => {
  const items: Item[] = []
  for (let i = 1; i <= length; i++) {
    const endDate = setMinuteToStep(
      generateRandomDateInRange(
        new Date(batch.startDate),
        new Date(batch.endDate)
      )
    )

    const minStartDate = DateTime.fromJSDate(new Date(endDate)).minus({
      minutes: 15
    })

    const startDate = setMinuteToStep(
      generateRandomDateInRange(
        new Date(batch.startDate),
        new Date(minStartDate.toString())
      )
    )

    const batchNumber: string = batch.batchNumber
    const itemReference: string = getItemReferenceNumber(batch, items)
    const obj: Item = {
      id: offset + i,
      createdAt: nowDate(),
      mediaType: MediaType[generateRandomNumber(0, 3)] as MediaType,
      startDate,
      batchId: batch.id,
      item_number: `${batchNumber}/${itemReference}`,
      endDate,
      vaultLocation: generateRandomNumber(1, vaults - 1),
      remarks: `remarks-${i + 1}`,
      musterRemarks: `muster-remarks-${i + 1}`,
      protectiveMarking: generateRandomNumber(1, protectiveMarking - 1),
      consecPages: `consec-pages-${i + 1}`,
      createdBy: user
    }
    items.push(obj)
  }
  return items
}

function getRandomRole(): UserRole[] {
  const roles: UserRole[] = ['rco-power-user', 'rco-user']
  const minLength = 1
  const maxLength = roles.length

  const combinationLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
  const shuffledRoles = roles.sort(() => Math.random() - 0.5)
  const selectedRoles = shuffledRoles.slice(0, combinationLength)

  return selectedRoles
}

export const generateUsers = (length: number): User[] => {
  const users: User[] = []
  const inActivePercentage = 0.4
  for (let i = 0; i < length; i++) {
    const active = i > inActivePercentage * length
    const obj: User = {
      id: i + 1,
      name: `user-${i + 1}`,
      password: 'user',
      adminRights: generateRandomNumber(0, 100) > 50,
      active,
      staffNumber: `d:${i + 1}`,
      createdBy: generateRandomNumber(0, length - 1),
      roles: getRandomRole(),
      createdAt: nowDate()
    }
    users.push(obj)
  }
  return users
}
