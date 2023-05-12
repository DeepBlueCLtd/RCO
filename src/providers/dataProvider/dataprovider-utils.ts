import {
  type DataProvider,
  type UpdateParams,
  type CreateResult
} from 'ra-core'
import * as constants from '../../constants'
import { isNumber } from '../../utils/number'
import { DateTime } from 'luxon'
import { type AuditType } from '../../utils/activity-types'
import { isSameDate } from '../../utils/date'
import { getUser } from '../authProvider'

export const compareVersions = (v1: string, v2: string): number => {
  const s1 = parseInt(v1.substring(1))
  const s2 = parseInt(v2.substring(1))
  if (isNaN(s1) || isNaN(s2)) return NaN
  if (s1 < s2) {
    return -1
  } else if (s1 > s2) {
    return 1
  } else {
    return 0
  }
}

export const generateBatchId = async (
  provider: DataProvider,
  year: string
): Promise<string> => {
  if (!isNumber(year)) throw new TypeError('Year invalid')
  const batches = await provider.getList(constants.R_BATCHES, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 1000 },
    filter: { yearOfReceipt: year }
  })

  if (batches.data.length === 0) {
    return '00'
  }

  if (batches.data.length === 1) {
    return '01'
  }
  const greatestBatch = batches.data.reduce((prev, current) =>
    compareVersions(prev.batchNumber, current.batchNumber) === -1
      ? current
      : prev
  )

  return (parseInt(greatestBatch.batchNumber.substring(1)) + 1).toLocaleString(
    'en-US',
    {
      minimumIntegerDigits: 2,
      useGrouping: false
    }
  )
}

export const nowDate = (): string => {
  const isoDate = DateTime.utc().toISO()
  return isoDate !== null ? isoDate : 'n/a'
}

export const getDifference = (
  data: Record<string, any>,
  previousData: Record<string, any>
): Record<any, string> => {
  const valuesChanged: Record<string, any> = {}
  Object.keys(data).forEach((item) => {
    const isDateModified =
      data[item] instanceof Date && !isSameDate(data[item], previousData[item])
    if (
      isDateModified ||
      (typeof data[item] !== 'object' && data[item] !== previousData[item])
    ) {
      valuesChanged[item] = previousData[item]
    }
  })
  return valuesChanged
}

interface AuditProps {
  type: AuditType
  activityDetail: string
  securityRelated?: boolean
  resource: string | null
  id: number | null
  index?: number
}

interface AuditDataArgs {
  type: AuditType
  securityRelated?: boolean
}

export type AuditFunctionType = ({
  type,
  activityDetail,
  securityRelated,
  resource,
  id
}: AuditProps) => Promise<void>

export const auditForUpdatedChanges = async (
  record: UpdateParams,
  auditData: AuditDataArgs,
  audit: AuditFunctionType
): Promise<UpdateParams<Item>> => {
  const difference = getDifference(record.data, record.previousData)
  await audit({
    ...auditData,
    activityDetail: `Previous values: ${JSON.stringify(difference)}`,
    resource: constants.R_ITEMS,
    index: record.id as number,
    id: record.data.id
  })
  return record
}

export const convertDateToISO = <T>(
  record: Partial<Record<keyof T, any>>,
  keys: Array<keyof T>
): Partial<T> => {
  keys.forEach((key) => {
    if (typeof record[key] !== 'undefined') {
      record[key] = new Date(record[key]).toISOString()
    }
  })
  return record
}
/** utility method to initialise the created by and created at fields */
export const withCreatedByAt = (
  record: CreateResult<Item | Batch | Project>
): CreateResult<Batch | Project | Item> => {
  const user = getUser()
  if (user !== undefined) {
    record.data.createdBy = user.id
  }
  record.data.createdAt = nowDate()
  return record
}
