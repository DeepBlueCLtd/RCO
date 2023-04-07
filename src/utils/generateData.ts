import { DateTime } from 'luxon'

const MediaType = ['DVD', 'Tape', 'Paper']

function generateRandomNumber(min: number, max: number): number {
  const randomNumber = Math.random()
  const scaledRandomNumber = randomNumber * (max - min) + min
  const randomInteger = Math.floor(scaledRandomNumber)
  return randomInteger
}

function generateRandomDate(): [DateTime, DateTime] {
  const startYear = 2020
  const endYear = 2023
  const randomStartYear = generateRandomNumber(startYear, endYear)
  const randomStartMonth = Math.floor(Math.random() * 12) + 1
  const randomStartDay = Math.floor(Math.random() * 28) + 1
  const randomStartDate = DateTime.fromObject({
    year: randomStartYear,
    month: randomStartMonth,
    day: randomStartDay
  })
  const endWeeks = Math.floor(Math.random() * 7) + 4
  const endDate = randomStartDate.plus({ weeks: endWeeks })
  return [randomStartDate, endDate]
}

function generateRandomDateInRange(startDate: Date, endDate: Date): string {
  const luxonStartDate = DateTime.fromJSDate(startDate)
  const luxonEndDate = DateTime.fromJSDate(endDate)
  const rangeInMs = luxonEndDate.toMillis() - luxonStartDate.toMillis()
  const maxDurationMs = 10 * 24 * 60 * 60 * 1000
  const durationMs = Math.min(rangeInMs, generateRandomNumber(0, maxDurationMs))
  const randomDate = luxonStartDate.plus({ milliseconds: durationMs })
  return randomDate.toJSDate().toString()
}

const generateBatchId = (year: string, batch: Batch[]): string => {
  const yearsFound = batch.filter((b) => b.year_of_receipt === year)
  return (yearsFound.length + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })
}

export const generatePlatform = (length: number): Platform[] => {
  const platforms: Platform[] = []
  for (let i = 1; i <= length; i++) {
    platforms.push({ id: i, name: `platform-${i}`, active: true })
  }
  return platforms
}

export const generateProject = (length: number): Project[] => {
  const projects: Project[] = []
  for (let i = 1; i <= length; i++) {
    const [startDate, endDate] = generateRandomDate()
    const obj: Project = {
      id: i,
      name: `project-${i}`,
      start_date: startDate.toString(),
      end_date: endDate.toString(),
      project_code: String(generateRandomNumber(1, 1000)),
      remarks: `project-remarks-${i}`
    }
    projects.push(obj)
  }
  return projects
}

export const generateBatch = (
  length: number,
  platforms: number,
  departments: number,
  projects: number,
  organisations: number,
  protectiveMarkingAuthority: number,
  protectiveMarking: number
): Batch[] => {
  const batches: Batch[] = []

  for (let i = 1; i <= length; i++) {
    const year = String(generateRandomNumber(2020, 2023))
    const obj: Batch = {
      id: i,
      name: `batch-${i}`,
      batch_number: `V${generateBatchId(year, batches)}/${year}`,
      vault: generateRandomNumber(0, length),
      year_of_receipt: year,
      department: generateRandomNumber(1, departments - 1),
      project: generateRandomNumber(1, projects - 1),
      platform: generateRandomNumber(1, platforms - 1),
      organisation: generateRandomNumber(1, organisations - 1),
      protective_marking_authority: generateRandomNumber(
        1,
        protectiveMarkingAuthority - 1
      ),
      maximum_protective_marking: generateRandomNumber(
        1,
        protectiveMarking - 1
      ),
      remarks: `remarks-batch-${i}`
    }
    batches.push(obj)
  }
  return batches
}

export const generateItems = (
  length: number,
  batch: Batch,
  vaults: number,
  protectiveMarking: number,
  project: Project
): Item[] => {
  const items: Item[] = []
  for (let i = 1; i <= length; i++) {
    const endDate = generateRandomDateInRange(
      new Date(project.start_date),
      new Date(project.end_date)
    )
    const startDate = generateRandomDateInRange(
      new Date(project.start_date),
      new Date(endDate)
    )
    const id: number = generateRandomNumber(1, 100000)
    const obj: Item = {
      id,
      media_type: MediaType[generateRandomNumber(0, 3)] as MediaType,
      start: startDate,
      batch_id: batch.id,
      item_number: `${batch.batch_number}/${id + 1}`,
      end: endDate,
      vault_location: generateRandomNumber(1, vaults - 1),
      remarks: `remarks-${i + 1}`,
      protective_marking: generateRandomNumber(1, protectiveMarking - 1),
      mag_tape: {
        minutes: i,
        brand: `brand-${i}`,
        media_type: MediaType[generateRandomNumber(0, 3)] as MediaType
      },
      dvd: {
        media_type: MediaType[generateRandomNumber(0, 3)] as MediaType,
        size: i
      },
      paper: `paper-${i}`
    }
    items.push(obj)
  }
  return items
}
