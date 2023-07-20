import { type UpdateParams, type CreateResult, type RaRecord } from 'ra-core'
import { DateTime } from 'luxon'
import { type AuditType } from '../../utils/activity-types'
import { isSameDate } from '../../utils/date'
import { getUser } from '../authProvider'
import { type ResourceTypes } from '../../constants'
import {
  type ResourceCallbacks,
  type DataProvider,
  type GetListParams
} from 'react-admin'
import ReferenceItemLifeCycle from './resource-callbacks/ReferenceItemLifeCycle'
import { isNumber } from '../../utils/number'

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
  activityDetail?: string
  securityRelated?: boolean
  resource: string | null
  dataId: number | null
  subject?: User['id']
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
  dataId,
  subject
}: AuditProps) => Promise<void>

export const auditForUpdatedChanges = async (
  record: UpdateParams<RCOResource>,
  resource: ResourceTypes,
  auditData: AuditDataArgs,
  audit: AuditFunctionType,
  subject?: User['id']
): Promise<UpdateParams<RCOResource>> => {
  // @ts-expect-error: property not found in type
  const { editRemarks, ...rest } = record.data
  if (editRemarks) {
    record.data = rest
  }
  const difference = getDifference(record.data, record.previousData)

  const activityDetail = `Previous values: ${JSON.stringify(difference)}${
    editRemarks ? `, Remarks: ${editRemarks}` : ''
  }`

  const dataId =
    record.previousData.id !== undefined ? record.previousData.id : null
  await audit({
    ...auditData,
    activityDetail,
    resource,
    dataId,
    subject
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
  record: CreateResult<ResourceWithCreation>
): CreateResult<ResourceWithCreation> => {
  const user = getUser()
  if (user !== undefined) {
    record.data.createdBy = user.id
  }
  record.data.createdAt = nowDate()
  return record
}

export const extendLifeCycle = (
  resource: ResourceTypes,
  audit: AuditFunctionType,
  securityRelated?: (record: UpdateParams<RCOResource>) => boolean,
  callbacks?: Omit<ResourceCallbacks, 'resource'>
): ResourceCallbacks<any> => ({
  ...ReferenceItemLifeCycle(audit, resource, securityRelated),
  ...callbacks
})

const getReferenceIdFromField = (reference: string, prefix: string): number => {
  return parseInt(reference.slice(prefix.length + 1, -5))
}

const compareVersions = (v1: string, v2: string, prefix: string): number => {
  if (typeof v2 !== 'string') return 1

  const s1 = getReferenceIdFromField(v1, prefix)
  const s2 = getReferenceIdFromField(v2, prefix)

  if (isNaN(s1) || isNaN(s2)) return NaN
  if (s1 < s2) {
    return -1
  } else if (s1 > s2) {
    return 1
  } else {
    return 0
  }
}

export async function generateReference<T extends RaRecord>(
  provider: DataProvider,
  year: string,
  resource: ResourceTypes,
  fieldName: keyof T,
  filter: GetListParams['filter'] = {
    createdAt_gte: DateTime.now().startOf('year').toISO()
  },
  prefix = 'V'
): Promise<string> {
  if (!isNumber(year)) throw new TypeError('Year invalid')
  const dispatch = await provider.getList<T>(resource, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 1000 },
    filter: { ...filter }
  })

  if (dispatch.data.length === 0) {
    return `${prefix}/0/${year}`
  }

  if (dispatch.data.length === 1) {
    return `${prefix}/1/${year}`
  }

  const greatestDispatch = dispatch.data.reduce((prev, current) =>
    compareVersions(prev[fieldName], current[fieldName], prefix) === -1
      ? current
      : prev
  )

  const referenceId = (
    getReferenceIdFromField(greatestDispatch[fieldName], prefix) + 1
  ).toLocaleString('en-US', {
    useGrouping: false
  })
  return `${prefix}/${referenceId}/${year}`
}
