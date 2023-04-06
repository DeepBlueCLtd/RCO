import { DateTime } from 'luxon'

const MediaType = ['DVD', 'Tape', 'Paper']

function generateRandomNumber(min: number, max: number): number {
  const randomNumber = Math.random()
  const scaledRandomNumber = randomNumber * (max - min) + min
  const randomInteger = Math.floor(scaledRandomNumber)
  return randomInteger
}

function generateRandomDate(): DateTime[] {
  const earliestDate = DateTime.now().minus({ days: 2 })
  const daysAgo = Math.floor(Math.random() * 31)
  const secondDate = earliestDate.minus({ days: daysAgo })
  const firstDate = secondDate.minus({
    days: generateRandomNumber(4 * 7, 10 * 7)
  })
  return [firstDate, secondDate]
}

// function generateRandomDateInRange(startDate: Date, endDate: Date): Date {
//   const luxonStartDate = DateTime.fromJSDate(startDate)
//   const luxonEndDate = DateTime.fromJSDate(endDate)
//   const rangeInMs = luxonEndDate.toMillis() - luxonStartDate.toMillis()
//   const randomDate = luxonStartDate.plus({
//     milliseconds: Math.random() * rangeInMs
//   })
//   return randomDate.toJSDate()
// }

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
    const obj = {
      id: i,
      name: `project-${i}`,
      start_date: startDate.toString(),
      end_date: endDate.toString(),
      project_code: String(generateRandomNumber(1, 1000)),
      remarks: `project remarks ${i}`
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
    const year = String(generateRandomNumber(2000, 2023))
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
  protectiveMarking: number
): Item[] => {
  const items: Item[] = []
  for (let i = 1; i <= length; i++) {
    const obj: Item = {
      id: generateRandomNumber(1, 100000),
      media_type: MediaType[generateRandomNumber(0, 3)] as MediaType,
      start: DateTime.now().toString(),
      batch_id: batch.id,
      item_number: `${batch.batch_number}/${i}`,
      end: DateTime.now().toString(),
      vault_location: generateRandomNumber(1, vaults - 1),
      remarks: `remarks-${i + 1}`,
      protective_marking: generateRandomNumber(1, protectiveMarking - 1),
      mag_tape: {
        minutes: i,
        brand: 'brand',
        media_type: MediaType[generateRandomNumber(0, 3)] as MediaType
      },
      dvd: {
        media_type: MediaType[generateRandomNumber(0, 3)] as MediaType,
        size: 1
      },
      paper: 'abc'
    }
    items.push(obj)
  }
  return items
}
