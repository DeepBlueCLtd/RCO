import { type UpdateParams, type CreateResult } from 'ra-core'
import { DateTime } from 'luxon'
import { type AuditType } from '../../utils/activity-types'
import { isSameDate } from '../../utils/date'
import { getUser } from '../authProvider'
import { type ResourceTypes } from '../../constants'
import { type ResourceCallbacks } from 'react-admin'
import ReferenceItemLifeCycle from './resource-callbacks/ReferenceItemLifeCycle'

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
  dataId
}: AuditProps) => Promise<void>

export const auditForUpdatedChanges = async (
  record: UpdateParams<RCOResource>,
  resource: ResourceTypes,
  auditData: AuditDataArgs,
  audit: AuditFunctionType
): Promise<UpdateParams<RCOResource>> => {
  const difference = getDifference(record.data, record.previousData)
  const dataId =
    record.previousData.id !== undefined ? record.previousData.id : null
  await audit({
    ...auditData,
    activityDetail: `Previous values: ${JSON.stringify(difference)}`,
    resource,
    dataId
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
